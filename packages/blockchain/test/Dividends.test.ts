import { expect } from "chai";
import { ethers } from "hardhat";
import { LadrilloBrick, FibraManager } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Inversión y Dividendos (Fase 4)", function () {
  let ladrillo: LadrilloBrick;
  let fibraManager: FibraManager;
  let owner: HardhatEthersSigner;
  let investor1: HardhatEthersSigner;
  let investor2: HardhatEthersSigner;

  const INITIAL_SUPPLY = 1000;

  beforeEach(async function () {
    [owner, investor1, investor2] = await ethers.getSigners();

    // Desplegar Ladrillo
    const LadrilloFactory = await ethers.getContractFactory("LadrilloBrick");
    ladrillo = await LadrilloFactory.deploy(
      "Test Ladrillo",
      "TLD",
      owner.address, // NFT dummy
      1,
      INITIAL_SUPPLY,
      owner.address
    );

    // Desplegar FibraManager
    const FibraFactory = await ethers.getContractFactory("FibraManager");
    fibraManager = await FibraFactory.deploy();

    // Distribuir algunos ladrillos a los inversores
    // 60% al investor1, 40% al investor2
    const decimals = await ladrillo.decimals();
    await ladrillo.transfer(investor1.address, ethers.parseUnits("600", decimals));
    await ladrillo.transfer(investor2.address, ethers.parseUnits("400", decimals));
  });

  it("Debería distribuir dividendos proporcionalmente en LadrilloBrick", async function () {
    const dividendAmount = ethers.parseEther("10"); // 10 AVAX de renta

    // Guardar balances iniciales
    const initialBalance1 = await ethers.provider.getBalance(investor1.address);
    const initialBalance2 = await ethers.provider.getBalance(investor2.address);

    // Ejecutar distribución (enviando AVAX al contrato)
    const tx = await ladrillo.release({ value: dividendAmount });
    await tx.wait();

    // Verificar balances finales
    const finalBalance1 = await ethers.provider.getBalance(investor1.address);
    const finalBalance2 = await ethers.provider.getBalance(investor2.address);

    // Investor 1 debería recibir el 60% (6 AVAX)
    expect(finalBalance1 - initialBalance1).to.equal(ethers.parseEther("6"));
    // Investor 2 debería recibir el 40% (4 AVAX)
    expect(finalBalance2 - initialBalance2).to.equal(ethers.parseEther("4"));
  });

  it("Debería distribuir dividendos desde FibraManager a múltiples Ladrillos", async function () {
    // Creamos una FIBRA con el ladrillo existente
    await fibraManager.createFibra("Fondo Test", [await ladrillo.getAddress()], 100);
    
    const fibraDividend = ethers.parseEther("10");

    const initialBalance1 = await ethers.provider.getBalance(investor1.address);
    
    // Distribuir a través del manager
    await fibraManager.distributeFibraDividends(0, { value: fibraDividend });

    const finalBalance1 = await ethers.provider.getBalance(investor1.address);
    
    // Debería haber recibido su 60% de los 10 AVAX que llegaron al ladrillo
    expect(finalBalance1 - initialBalance1).to.equal(ethers.parseEther("6"));
  });
});
