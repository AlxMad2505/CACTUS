// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LadrilloBrick.sol";

contract FibraManager is ERC20, Ownable {

    struct Fibra {
        string name;
        address[] brickTokens; // Ladrillos ERC-20 agrupados en esta FIBRA
        bool isActive;
        uint256 totalSupply;
    }

    // ID de Fibra => Detalle de la FIBRA
    mapping(uint256 => Fibra) public fibras;
    uint256 public fibraCounter;

    event FibraCreated(uint256 indexed fibraId, string name, address[] brickTokens);
    event FibraDividendReceived(uint256 indexed fibraId, uint256 totalAmount);

    constructor() ERC20("Propiedad Digital FIBRA", "PDFIBRA") Ownable(msg.sender) {}

    /**
     * @notice Agrupa múltiples tokens LadrilloBrick para crear un portafolio de inversión (FIBRA).
     * @dev El creador recibe tokens de la FIBRA que representan su participación en el portafolio.
     */
    function createFibra(string memory _name, address[] memory _brickTokens, uint256 _initialSupply) external onlyOwner {
        require(_brickTokens.length > 0, "Debe incluir al menos un token Ladrillo");

        uint256 newFibraId = fibraCounter;
        fibras[newFibraId] = Fibra({
            name: _name,
            brickTokens: _brickTokens,
            isActive: true,
            totalSupply: _initialSupply
        });

        fibraCounter++;

        // Mintear tokens de la FIBRA al owner (representando el portafolio)
        _mint(msg.sender, _initialSupply * 10 ** decimals());

        emit FibraCreated(newFibraId, _name, _brickTokens);
    }

    /**
     * @notice Recibe AVAX de rentas del portafolio entero y lo distribuye equitativamente 
     * entre todos los LadrilloBricks que componen la FIBRA.
     */
    function distributeFibraDividends(uint256 _fibraId) external payable {
        Fibra storage fibra = fibras[_fibraId];
        require(fibra.isActive, "La FIBRA no existe o esta inactiva");
        require(msg.value > 0, "Monto de dividendos debe ser mayor a cero");

        uint256 numBricks = fibra.brickTokens.length;
        uint256 amountPerBrick = msg.value / numBricks; // División equitativa entre inmuebles del fondo

        for (uint256 i = 0; i < numBricks; i++) {
            address brickContract = fibra.brickTokens[i];

            // Invocamos la función release de cada Ladrillo enviando su porción de AVAX
            LadrilloBrick(payable(brickContract)).release{value: amountPerBrick}();
        }

        emit FibraDividendReceived(_fibraId, msg.value);
    }
}