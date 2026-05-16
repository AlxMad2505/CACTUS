// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LadrilloBrick is ERC20, Ownable, ReentrancyGuard {
    
    // Dirección del contrato NFT que representa las propiedades
    address public immutable propertyNFTContract;
    // ID del inmueble específico en el contrato ERC-721
    uint256 public immutable propertyId;
    
    // Listado de holders para la distribución de dividendos (simplificado para hackathon)
    address[] private _holders;
    mapping(address => bool) private _isHolder;

    event DividendDistributed(uint256 amount, uint256 holdersCount);

    constructor(
        string memory name, 
        string memory symbol, 
        address _nftContract, 
        uint256 _propertyId,
        uint256 _initialSupply,
        address _initialOwner
    ) 
        ERC20(name, symbol) 
        Ownable(_initialOwner) 
    {
        require(_nftContract != address(0), "Direccion de NFT invalida");
        propertyNFTContract = _nftContract;
        propertyId = _propertyId;
        
        // Mintear el supply inicial (fracciones) al creador/dueño original
        _mint(_initialOwner, _initialSupply * 10 ** decimals());
    }

    /**
     * @notice Distribuye dividendos (rentas en AVAX) a los holders proporcionalmente.
     * @dev Implementa el requerimiento de release() vía push payment.
     */
    function release() external payable nonReentrant {
        uint256 totalDividend = msg.value;
        require(totalDividend > 0, "El dividendo debe ser mayor a 0");
        uint256 totalTokens = totalSupply();
        require(totalTokens > 0, "No hay tokens emitidos");

        uint256 distributedCount = 0;

        for (uint256 i = 0; i < _holders.length; i++) {
            address holder = _holders[i];
            uint256 balance = balanceOf(holder);
            
            if (balance > 0) {
                // Cálculo proporcional: (Balance * Dividendo Total) / Total Supply
                uint256 share = (balance * totalDividend) / totalTokens;
                if (share > 0) {
                    (bool success, ) = payable(holder).call{value: share}("");
                    if (success) {
                        distributedCount++;
                    }
                }
            }
        }

        emit DividendDistributed(totalDividend, distributedCount);
    }

    // Sobrescribir transferencia para llevar registro de los holders activos
    function _update(address from, address to, uint256 value) internal override {
        super._update(from, to, value);
        
        if (to != address(0) && balanceOf(to) > 0 && !_isHolder[to]) {
            _isHolder[to] = true;
            _holders.push(to);
        }
        // Nota: En este nivel de hackathon, no eliminamos de _holders para evitar 
        // operaciones de borrado costosas, simplemente validamos balance > 0 en release()
    }

    // Permitir recibir fondos de rentas directamente
    receive() external payable {
        // Ejecuta la distribución automáticamente si entra AVAX directamente al contrato
        if(msg.value > 0) {
            this.release{value: msg.value}();
        }
    }
}