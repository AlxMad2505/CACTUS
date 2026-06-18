// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IIcmMessenger.sol";

/**
 * @title MockIcmMessenger
 * @notice Contrato simulador para emular Avalanche Interchain Messaging (ICM) en Remix
 */
contract MockIcmMessenger is IIcmMessenger {
    uint256 private _nonceCounter;

    constructor() {
        _nonceCounter = 1;
    }

    /**
     * @notice Simula el envío de un mensaje cross-chain incrementando el nonce
     */
    function sendInterchainMessage(
        bytes32 destinationBlockchainID,
        address destinationAddress,
        bytes calldata message
    ) external override returns (uint256 messageNonce) {
        messageNonce = _nextTokenNonce();
        
        emit InterchainMessageSent(
            destinationBlockchainID,
            destinationAddress,
            messageNonce,
            message
        );
    }

    /**
     * @notice Simula la recepción de un mensaje
     */
    function receiveInterchainMessage(
        bytes32 sourceBlockchainID,
        address sourceAddress,
        bytes calldata message
    ) external override {
        emit InterchainMessageReceived(
            sourceBlockchainID,
            sourceAddress,
            message
        );
    }

    function _nextTokenNonce() internal returns (uint256) {
        return _nonceCounter++;
    }
}