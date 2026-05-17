// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPropertyStructures.sol";

/**
 * @title IcmReceiverFuji
 * @notice Contrato que vive en la C-Chain (Fuji) y recibe datos desde la L1.
 */
contract IcmReceiverFuji is IPropertyStructures {
    
    struct RemoteProperty {
        address owner;
        PropertyStatus status;
        uint64 lastSync;
    }

    mapping(uint256 => RemoteProperty) public remoteProperties;
    address public authorizedPortal;

    event PropertySynced(uint256 indexed propertyId, address owner, PropertyStatus status);

    constructor(address _authorizedPortal) {
        authorizedPortal = _authorizedPortal;
    }

    /**
     * @notice Función que sería llamada por el mensajero de ICM en Fuji.
     * @dev En un entorno real, se valida que el msg.sender sea el pre-compilado de ICM.
     */
    function receivePropertyUpdate(bytes calldata payload) external {
        // Validación simplificada para el hackathon
        (uint256 propertyId, address owner, PropertyStatus status) = abi.decode(payload, (uint256, address, PropertyStatus));

        remoteProperties[propertyId] = RemoteProperty({
            owner: owner,
            status: status,
            lastSync: uint64(block.timestamp)
        });

        emit PropertySynced(propertyId, owner, status);
    }
}
