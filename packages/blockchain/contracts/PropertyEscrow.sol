// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "./interfaces/IPropertyStructures.sol";

/**
 * @title IBitacoraInmueble
 * @notice Interfaz para interactuar con el contrato de Identidad Inmobiliaria (ERC-721).
 */
interface IBitacoraInmueble is IPropertyStructures {
    function setPropertyLock(uint256 propertyId, bool lockState) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
    function properties(uint256 propertyId) external view returns (PropertyRecord memory);
    function externalLogHistory(uint256 propertyId, string calldata description) external;
}

/**
 * @title PropertyEscrow
 * @author Gemini CLI Agent
 * @notice Capa 2 de Transacción: Escrow inteligente con validación vía Chainlink Functions.
 */
contract PropertyEscrow is FunctionsClient, ReentrancyGuard, IPropertyStructures {
    using FunctionsRequest for FunctionsRequest.Request;

    // Almacenamiento: Maquina de estados innegociable
    enum EscrowStatus { PENDING, FUNDED, CONDITIONS_MET, RELEASED, REFUNDED }

    // Estructura de transaccion empaquetada
    struct EscrowDeal {
        address buyer;
        address seller;
        uint256 propertyId;
        uint256 price;
        uint64 deadline;
        EscrowStatus status;
    }

    // --- VARIABLES DE ESTADO ---
    IBitacoraInmueble public immutable bitacora;
    uint64 public immutable subscriptionId;
    bytes32 public immutable donId;
    address public marketplaceWallet;
    uint256 public constant COMMISSION_BPS = 200;
    uint256 public constant REQUEST_TIMEOUT = 1 hours; // Tiempo de vida de una petición

    struct PendingRequest {
        uint256 propertyId;
        uint64 timestamp;
        bool processed;
    }

    mapping(uint256 => EscrowDeal) public deals;
    mapping(bytes32 => PendingRequest) public pendingRequests;

    // --- EVENTOS ---
    event AuditFailed(bytes32 indexed requestId, uint256 indexed propertyId, bytes reason);
    event RequestExpired(bytes32 indexed requestId, uint256 indexed propertyId);
    
    // --- ERRORES ---
    error RequestNotFound();
    error RequestAlreadyProcessed();
    error RequestNotExpired();

    // ... (constructor y funciones previas iguales)

    /**
     * @notice Funcion 3: Dispara Chainlink Functions para auditoria de adeudos.
     */
    function solicitarAuditoriaDeAdeudos(uint256 propertyId, string calldata source) external returns (bytes32 requestId) {
        EscrowDeal storage deal = deals[propertyId];
        if (deal.status != EscrowStatus.FUNDED) revert InvalidStatus(deal.status, EscrowStatus.FUNDED);

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        
        PropertyRecord memory record = bitacora.properties(propertyId);
        string[] memory args = new string[](1);
        args[0] = record.cadastralKey;
        req.setArgs(args);

        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, 300000, donId);
        
        pendingRequests[requestId] = PendingRequest({
            propertyId: propertyId,
            timestamp: uint64(block.timestamp),
            processed: false
        });
        
        emit AuditRequested(requestId, propertyId);
    }

    /**
     * @notice Funcion 4: Procesa la respuesta del oraculo con validaciones extra.
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        PendingRequest storage request = pendingRequests[requestId];
        
        // 1. Validar que la petición exista y no haya sido procesada
        if (request.propertyId == 0) revert RequestNotFound();
        if (request.processed) revert RequestAlreadyProcessed();
        
        request.processed = true;
        uint256 propertyId = request.propertyId;
        EscrowDeal storage deal = deals[propertyId];

        // 2. Si hay error en el oráculo (API caída o error de script JS)
        if (err.length > 0) {
            emit AuditFailed(requestId, propertyId, err);
            bitacora.externalLogHistory(propertyId, "Error técnico en auditoria Chainlink. Reintento requerido.");
            return;
        }

        // 3. Procesar respuesta exitosa
        try this.decodeAndApply(propertyId, response) {
            // Éxito en la decodificación y aplicación
        } catch {
            emit AuditFailed(requestId, propertyId, "Error decodificando respuesta");
        }
    }

    /**
     * @notice Función auxiliar para permitir el uso de 'try/catch' en la decodificación.
     */
    function decodeAndApply(uint256 propertyId, bytes memory response) external {
        if (msg.sender != address(this)) revert Unauthorized();
        
        bool isClear = abi.decode(response, (bool));
        EscrowDeal storage deal = deals[propertyId];
        
        if (isClear) {
            deal.status = EscrowStatus.CONDITIONS_MET;
            bitacora.externalLogHistory(propertyId, "Certificacion de adeudos: LIMPIA. Condiciones de Escrow cumplidas.");
            emit ConditionsVerified(propertyId, true);
            emit EscrowStatusChanged(propertyId, EscrowStatus.CONDITIONS_MET);
        } else {
            emit ConditionsVerified(propertyId, false);
            bitacora.externalLogHistory(propertyId, "Certificacion de adeudos: FALLIDA. Deudas pendientes detectadas.");
        }
    }

    /**
     * @notice Permite limpiar peticiones que nunca recibieron respuesta (Timeout).
     */
    function cancelarPeticionExpirada(bytes32 requestId) external {
        PendingRequest storage request = pendingRequests[requestId];
        if (request.propertyId == 0) revert RequestNotFound();
        if (request.processed) revert RequestAlreadyProcessed();
        if (block.timestamp < request.timestamp + REQUEST_TIMEOUT) revert RequestNotExpired();

        request.processed = true;
        emit RequestExpired(requestId, request.propertyId);
    }

    /**
     * @notice Funcion 5: Transferencia atomica de propiedad y dinero con comision.
     */
    function liquidarTransaccion(uint256 propertyId) external nonReentrant {
        EscrowDeal storage deal = deals[propertyId];
        if (deal.status != EscrowStatus.CONDITIONS_MET) revert InvalidStatus(deal.status, EscrowStatus.CONDITIONS_MET);

        uint256 commission = (deal.price * COMMISSION_BPS) / 10000;
        uint256 sellerAmount = deal.price - commission;

        deal.status = EscrowStatus.RELEASED;
        
        // Quitar bloqueo para permitir transferencia
        bitacora.setPropertyLock(propertyId, false);
        
        // Transferencia definitiva NFT (Vendedor -> Comprador)
        bitacora.safeTransferFrom(deal.seller, deal.buyer, propertyId);

        // Distribucion de fondos
        (bool successCommission, ) = payable(marketplaceWallet).call{value: commission}("");
        (bool successSeller, ) = payable(deal.seller).call{value: sellerAmount}("");
        
        if (!successCommission || !successSeller) revert TransferFailed();

        emit DealLiquidated(propertyId, sellerAmount, commission);
        emit EscrowStatusChanged(propertyId, EscrowStatus.RELEASED);
    }

    /**
     * @notice Funcion 6: Reembolso al comprador si el plazo expira y las condiciones no se cumplieron.
     */
    function reclamarReembolso(uint256 propertyId) external nonReentrant {
        EscrowDeal storage deal = deals[propertyId];
        if (deal.status != EscrowStatus.FUNDED) revert InvalidStatus(deal.status, EscrowStatus.FUNDED);
        if (block.timestamp <= deal.deadline) revert DeadlineNotReached();
        if (block.timestamp > deal.deadline + 30 days) revert RefundWindowExpired();

        deal.status = EscrowStatus.REFUNDED;
        
        // Liberar propiedad en el NFT
        bitacora.setPropertyLock(propertyId, false);

        // Devolucion 100% al comprador
        (bool success, ) = payable(deal.buyer).call{value: deal.price}("");
        if (!success) revert TransferFailed();

        emit FundsRefunded(propertyId, deal.buyer);
        emit EscrowStatusChanged(propertyId, EscrowStatus.REFUNDED);
    }
}