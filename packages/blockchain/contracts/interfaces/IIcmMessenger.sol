// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IIcmMessenger
 * @notice Interfaz para la mensajería nativa de Avalanche (Interchain Messaging)
 * @dev Esta interfaz permitirá a la L1 propia comunicarse con la C-Chain de Fuji.
 */
interface IIcmMessenger {
    
    /**
     * @notice Envía un mensaje a otra subred.
     * @param destinationBlockchainID El ID de la blockchain de destino (e.g. Fuji C-Chain).
     * @param destinationAddress La dirección del contrato receptor en la cadena de destino.
     * @param message El payload del mensaje codificado en bytes.
     */
    function sendInterchainMessage(
        bytes32 destinationBlockchainID,
        address destinationAddress,
        bytes calldata message
    ) external returns (uint256 messageNonce);

    /**
     * @notice Recibe y procesa un mensaje proveniente de otra subred.
     * @dev Esta función suele ser llamada por el contrato de mensajería del sistema.
     * @param sourceBlockchainID ID de la blockchain de origen.
     * @param sourceAddress Dirección del contrato emisor.
     * @param message Payload del mensaje.
     */
    function receiveInterchainMessage(
        bytes32 sourceBlockchainID,
        address sourceAddress,
        bytes calldata message
    ) external;

    event InterchainMessageSent(
        bytes32 indexed destinationBlockchainID,
        address indexed destinationAddress,
        uint256 nonce,
        bytes message
    ) ;

    event InterchainMessageReceived(
        bytes32 indexed sourceBlockchainID,
        address indexed sourceAddress,
        bytes message
    );
}