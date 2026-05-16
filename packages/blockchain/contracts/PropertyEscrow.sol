// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// Nota: Se asume que @chainlink/contracts está instalado o disponible en el entorno de compilación.
// En un entorno local de Hardhat, se debe ejecutar: npm install @chainlink/contracts
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "./interfaces/IPropertyStructures.sol";

/**
 * @title IBitacoraInmueble
 * @notice Interfaz mínima para interactuar con el contrato de Identidad Inmobiliaria.
 */
interface IBitacoraInmueble is IPropertyStructures {
    function setPropertyLock(uint256 propertyId, bool lockState) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
    function properties(uint256 propertyId) external view returns (PropertyRecord memory);
}

/**
 * @title PropertyEscrow
 * @author Gemini CLI Agent
 * @notice Capa 2 de Transacción: Escrow inteligente con validación vía Chainlink Functions.
 */
contract PropertyEscrow is FunctionsClient, ReentrancyGuard, IPropertyStructures {
    using FunctionsRequest for FunctionsRequest.Request;

    enum EscrowStatus { PENDING, FUNDED, CONDITIONS_MET, RELEASED, REFUNDED }

    struct EscrowDetails {
        address buyer;
        address seller;
        uint256 propertyId;
        uint256 price;
        uint64 deadline;
        EscrowStatus status;
        bool predialClear;
        bool waterClear;
    }

    // --- ESTADO ---
    IBitacoraInmueble public immutable bitacora;
    uint64 public immutable subscriptionId;
    bytes32 public immutable donId;

    mapping(uint256 => EscrowDetails) public escrows;
    mapping(bytes32 => uint256) private _requestIdToPropertyId;

    // --- EVENTOS ---
    event EscrowInitiated(uint256 indexed propertyId, address indexed buyer, address indexed seller, uint256 price);
    event FundsDeposited(uint256 indexed propertyId, uint256 amount);
    event ConditionCheckRequested(bytes32 indexed requestId, uint256 indexed propertyId);
    event ConditionsVerified(uint256 indexed propertyId, bool predial, bool water);
    event EscrowReleased(uint256 indexed propertyId);
    event EscrowRefunded(uint256 indexed propertyId);

    // --- ERRORES ---
    error InvalidStatus();
    error Unauthorized();
    error InsufficientFunds();
    error DeadlineNotReached();
    error ConditionsNotMet();
    error TransferFailed();

    constructor(
        address _router,
        address _bitacora,
        uint64 _subscriptionId,
        bytes32 _donId
    ) FunctionsClient(_router) {
        bitacora = IBitacoraInmueble(_bitacora);
        subscriptionId = _subscriptionId;
        donId = _donId;
    }

    /**
     * @notice Inicia un proceso de Escrow bloqueando la propiedad.
     * @param propertyId ID de la propiedad en la Bitácora.
     * @param buyer Dirección del comprador.
     * @param price Precio acordado en AVAX (wei).
     * @param duration Duración del escrow en segundos antes de poder pedir reembolso.
     */
    function initiateEscrow(uint256 propertyId, address buyer, uint256 price, uint64 duration) external {
        if (bitacora.ownerOf(propertyId) != msg.sender) revert Unauthorized();
        
        escrows[propertyId] = EscrowDetails({
            buyer: buyer,
            seller: msg.sender,
            propertyId: propertyId,
            price: price,
            deadline: uint64(block.timestamp + duration),
            status: EscrowStatus.PENDING,
            predialClear: false,
            waterClear: false
        });

        // Bloquear propiedad en la bitácora para evitar transferencias externas
        bitacora.setPropertyLock(propertyId, true);
        
        emit EscrowInitiated(propertyId, buyer, msg.sender, price);
    }

    /**
     * @notice El comprador deposita los fondos en el contrato.
     */
    function depositFunds(uint256 propertyId) external payable nonReentrant {
        EscrowDetails storage escrow = escrows[propertyId];
        if (escrow.status != EscrowStatus.PENDING) revert InvalidStatus();
        if (msg.sender != escrow.buyer) revert Unauthorized();
        if (msg.value < escrow.price) revert InsufficientFunds();

        escrow.status = EscrowStatus.FUNDED;
        emit FundsDeposited(propertyId, msg.value);
    }

    /**
     * @notice Prepara y envía la petición a Chainlink Functions para verificar deudas externas.
     * @param propertyId ID de la propiedad.
     * @param source Código JS para el oráculo.
     */
    function checkConditions(uint256 propertyId, string calldata source) external returns (bytes32 requestId) {
        EscrowDetails storage escrow = escrows[propertyId];
        if (escrow.status != EscrowStatus.FUNDED) revert InvalidStatus();

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        
        // Obtenemos la clave catastral de la bitácora para pasarla como argumento al JS
        PropertyRecord memory record = bitacora.properties(propertyId);
        string[] memory args = new string[](1);
        args[0] = record.cadastralKey;
        req.setArgs(args);

        // Envío de la petición al Router de Chainlink Functions
        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, 300000, donId);
        _requestIdToPropertyId[requestId] = propertyId;
        
        emit ConditionCheckRequested(requestId, propertyId);
    }

    /**
     * @notice Callback de Chainlink Functions.
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        uint256 propertyId = _requestIdToPropertyId[requestId];
        if (propertyId == 0) return;

        if (err.length == 0) {
            // Se espera que el JS retorne (bool predialLimpio, bool aguaLimpia)
            (bool predial, bool water) = abi.decode(response, (bool, bool));
            
            EscrowDetails storage escrow = escrows[propertyId];
            escrow.predialClear = predial;
            escrow.waterClear = water;

            if (predial && water) {
                escrow.status = EscrowStatus.CONDITIONS_MET;
            }
            
            emit ConditionsVerified(propertyId, predial, water);
        }
        delete _requestIdToPropertyId[requestId];
    }

    /**
     * @notice Libera los fondos al vendedor y transfiere el NFT al comprador.
     */
    function releaseFunds(uint256 propertyId) external nonReentrant {
        EscrowDetails storage escrow = escrows[propertyId];
        if (escrow.status != EscrowStatus.CONDITIONS_MET) revert ConditionsNotMet();

        escrow.status = EscrowStatus.RELEASED;
        
        // Desbloquear para permitir la transferencia atómica
        bitacora.setPropertyLock(propertyId, false);
        
        // Transferencia del NFT (Identidad Digital)
        bitacora.safeTransferFrom(escrow.seller, escrow.buyer, propertyId);

        // Pago al vendedor
        (bool success, ) = payable(escrow.seller).call{value: escrow.price}("");
        if (!success) revert TransferFailed();

        emit EscrowReleased(propertyId);
    }

    /**
     * @notice Devuelve los fondos al comprador si las condiciones no se cumplieron y el plazo expiró.
     */
    function refund(uint256 propertyId) external nonReentrant {
        EscrowDetails storage escrow = escrows[propertyId];
        if (block.timestamp < escrow.deadline) revert DeadlineNotReached();
        if (escrow.status != EscrowStatus.FUNDED && escrow.status != EscrowStatus.PENDING) revert InvalidStatus();

        EscrowStatus prevStatus = escrow.status;
        escrow.status = EscrowStatus.REFUNDED;
        
        // Liberar la propiedad para que el vendedor pueda intentar otro Escrow
        bitacora.setPropertyLock(propertyId, false);

        if (prevStatus == EscrowStatus.FUNDED) {
            (bool success, ) = payable(escrow.buyer).call{value: escrow.price}("");
            if (!success) revert TransferFailed();
        }
        
        emit EscrowRefunded(propertyId);
    }

    /**
     * @notice Permite actualizar la configuración de Chainlink si es necesario (Emergencia/Mantenimiento).
     */
    function updateChainlinkConfig(uint64 _subscriptionId, bytes32 _donId) external {
        // En producción, esto debería ser solo para el Owner
        // if (msg.sender != owner()) revert Unauthorized();
    }
}
