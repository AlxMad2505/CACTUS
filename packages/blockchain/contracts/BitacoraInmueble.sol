// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPropertyStructures.sol";
import "./IcmPropertyPortal.sol";

/**
 * @title BitacoraInmueble
 * @author // mikedev000
 * @notice Contrato principal de Identidad Inmobiliaria en Avalanche L1
 */
contract BitacoraInmueble is ERC721URIStorage, Ownable, IPropertyStructures {

    uint256 private _nextTokenId;

    // Mapeos principales basados en nuestro modelo de datos robusto
    mapping(uint256 => PropertyRecord) private _properties;

    function properties(uint256 propertyId) external view returns (PropertyRecord memory) {
        return _properties[propertyId];
    }
    mapping(uint256 => mapping(ServiceType => ServiceDebtStatus)) public propertyDebts;
    mapping(uint256 => HistoryLog[]) private _propertyHistory;

    // Lista blanca para el segmento "Preventas con Desarrolladoras"
    mapping(address => bool) public authorizedDevelopers;

    // Errores personalizados para ahorrar gas en comparación con require strings
    error PropertyLocked();
    error NotAuthorized();
    error PropertyDoesNotExist();
    error InvalidStatusTransition();

    // Eventos eficientes para el rastreo en el frontend y Snowtrace
    event PropertyMinted(uint256 indexed propertyId, address indexed developer, string cadastralKey);
    event PropertyStatusChanged(uint256 indexed propertyId, PropertyStatus newStatus);
    event DebtUpdated(uint256 indexed propertyId, ServiceType indexed service, bool isClear, uint256 amountOwed);
    event HistoryLogAdded(uint256 indexed propertyId, address indexed actor, string description);

    modifier onlyAuthorized() {
        if (msg.sender != owner() && !authorizedDevelopers[msg.sender]) revert NotAuthorized();
        _;
    }

    constructor() ERC721("Propiedad Digital", "PROP") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    // --- SEGUNDO SEGMENTO: PREVENTAS CON DESARROLLADORAS ---

    function setDeveloperStatus(address developer, bool status) external onlyOwner {
        authorizedDevelopers[developer] = status;
    }

    /**
     * @notice Registra un inmueble desde su origen "limpio" y digital.
     */
    function mintProperty(
        address to,
        uint32 area,
        string calldata cadastralKey,
        string calldata ipfsURI
    ) external onlyAuthorized returns (uint256) {
        uint256 propertyId = _nextTokenId++;

        _safeMint(to, propertyId);
        _setTokenURI(propertyId, ipfsURI);

        _properties[propertyId] = PropertyRecord({
            currentOwner: to,
            constructionDate: uint64(block.timestamp),
            status: PropertyStatus.ACTIVA,
            isLocked: false,
            area: area,
            brickTokenAddress: address(0),
            cadastralKey: cadastralKey,
            ipfsMetadataHash: ipfsURI
        });

        emit PropertyMinted(propertyId, msg.sender, cadastralKey);
        
        // Inicializar el historial de la bitácora
        _logHistory(propertyId, msg.sender, "Propiedad registrada e incorporada a la bitacora inmutable.");

        return propertyId;
    }

    // --- INTEGRIDAD Y LOGICA DE CONTROL (Para Bóveda DeFi y Escrow) ---

    address public authorizedEscrow;
    address public propertyPortal; // Nuevo: Portal ICM

    function setAuthorizedEscrow(address _escrow) external onlyOwner {
        authorizedEscrow = _escrow;
    }

    function setPropertyPortal(address _portal) external onlyOwner {
        propertyPortal = _portal;
    }

    /**
     * @notice Bloquea o desbloquea el activo. Llamado por el Escrow para evitar doble venta.
     */
    function setPropertyLock(uint256 propertyId, bool lockState) external {
        if (_ownerOf(propertyId) != msg.sender && msg.sender != owner() && msg.sender != authorizedEscrow) {
            revert NotAuthorized();
        }
        
        _properties[propertyId].isLocked = lockState;
        _properties[propertyId].status = lockState ? PropertyStatus.EN_ESCROW : PropertyStatus.ACTIVA;
        
        // Sincronización Cross-Chain automática vía ICM
        if (propertyPortal != address(0)) {
            try IcmPropertyPortal(propertyPortal).syncPropertyState(
                propertyId, 
                _properties[propertyId].currentOwner, 
                _properties[propertyId].status
            ) {} catch {}
        }
        
        emit PropertyStatusChanged(propertyId, _properties[propertyId].status);
    }

    /**
     * @notice Permite al Escrow registrar eventos en la bitácora histórica.
     */
    function externalLogHistory(uint256 propertyId, string calldata description) external {
        if (msg.sender != authorizedEscrow) revert NotAuthorized();
        _logHistory(propertyId, msg.sender, description);
    }

    // --- TERCER SEGMENTO: TRANSPARENCIA DE ADEUDOS (Chainlink / Oráculos) ---

    /**
     * @notice Actualiza el estatus de deudas. Función destino del callback de Chainlink.
     */
    function updateDebtStatus(
        uint256 propertyId,
        ServiceType service,
        bool isClear,
        uint256 amountOwed
    ) external {
        // MVP: Filtro simplificado, idealmente restringido al contrato consumidor de Chainlink
        if (!_exists(propertyId)) revert PropertyDoesNotExist();
        
        propertyDebts[propertyId][service] = ServiceDebtStatus({
            lastVerification: uint64(block.timestamp),
            isClear: isClear,
            amountOwed: amountOwed
        });

        emit DebtUpdated(propertyId, service, isClear, amountOwed);
        
        string memory desc = string(abi.encodePacked(
            "Auditoria de servicio finalizada. Estado de deuda actualizado."
        ));
        _logHistory(propertyId, msg.sender, desc);
    }

    // --- HISTORIAL AUDITABLE (El "currículum" de la casa) ---

    function registerMaintenanceEvent(uint256 propertyId, string calldata description) external {
        if (_ownerOf(propertyId) != msg.sender) revert NotAuthorized();
        if (_properties[propertyId].isLocked) revert PropertyLocked();

        _logHistory(propertyId, msg.sender, description);
    }

    function _logHistory(uint256 propertyId, address actor, string memory description) internal {
        _propertyHistory[propertyId].push(HistoryLog({
            actor: actor,
            timestamp: uint64(block.timestamp),
            description: description
        }));
        emit HistoryLogAdded(propertyId, actor, description);
    }

    function getPropertyHistory(uint256 propertyId) external view returns (HistoryLog[] memory) {
        if (!_exists(propertyId)) revert PropertyDoesNotExist();
        return _propertyHistory[propertyId];
    }

    // --- SOBREESCRITURAS DE SEGURIDAD ERC-721 ---

    /**
     * @dev Hook de transferencia modificado para garantizar la inmutabilidad y los bloqueos DeFi.
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);
        
        if (previousOwner != address(0)) { // Si no es un mint básico
            if (_properties[tokenId].isLocked) revert PropertyLocked();
            
            // Actualizar el dueño en nuestro registro optimizado
            _properties[tokenId].currentOwner = to;
            
            // Registrar el cambio de manos de forma automática e inmutable
            _logHistory(tokenId, previousOwner, "Transferencia de dominio ejecutada exitosamente.");
        }
        
        return previousOwner;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}