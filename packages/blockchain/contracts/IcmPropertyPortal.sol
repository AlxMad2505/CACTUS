// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IIcmMessenger.sol";
import "./interfaces/IPropertyStructures.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IcmPropertyPortal
 * @notice Capa de comunicación cross-chain para Propiedad Digital.
 * Envía el estado de las propiedades desde la L1 hacia la C-Chain (Fuji).
 */
contract IcmPropertyPortal is Ownable, IPropertyStructures {
    
    // El mensajero nativo de Avalanche (Pre-compilado en L1s)
    IIcmMessenger public immutable messenger;
    
    // Dirección del contrato receptor en la C-Chain (Fuji)
    address public destinationContract;
    bytes32 public destinationChainId; // Blockchain ID de Fuji

    event MessageSent(uint256 indexed nonce, uint256 propertyId);

    constructor(address _messenger) Ownable(msg.sender) {
        messenger = IIcmMessenger(_messenger);
    }

    function setDestination(address _contract, bytes32 _chainId) external onlyOwner {
        destinationContract = _contract;
        destinationChainId = _chainId;
    }

    /**
     * @notice Envía el estado de una propiedad hacia otra cadena.
     * @param propertyId ID del inmueble.
     * @param owner Dueño actual.
     * @param status Estado en el ciclo de vida.
     */
    function syncPropertyState(
        uint256 propertyId,
        address owner,
        PropertyStatus status
    ) external returns (uint256 nonce) {
        // En un entorno real, solo la BitacoraInmueble llamaría aquí.
        
        // Empaquetamos los datos para el ICM
        bytes memory payload = abi.encode(propertyId, owner, status);

        // Enviamos el mensaje cross-chain nativo de Avalanche
        nonce = messenger.sendInterchainMessage(
            destinationChainId,
            destinationContract,
            payload
        );

        emit MessageSent(nonce, propertyId);
    }
}
