// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IIcmMessenger.sol";

/**
 * @title MockIcmMessenger
 * @notice Simula el contrato pre-compilado de Avalanche ICM para pruebas locales.
 */
contract MockIcmMessenger is IIcmMessenger {
    uint256 private _nonce;

    event MockMessageSent(bytes32 destinationChainId, address destinationAddress, bytes payload);

    function sendInterchainMessage(
        bytes32 destinationBlockchainID,
        address destinationAddress,
        bytes calldata message
    ) external override returns (uint256) {
        uint256 currentNonce = _nonce++;
        emit MockMessageSent(destinationBlockchainID, destinationAddress, message);
        return currentNonce;
    }

    function receiveInterchainMessage(
        bytes32 sourceBlockchainID,
        address sourceAddress,
        bytes calldata message
    ) external override {
        // Mock no hace nada en recepción por ahora
    }
}
