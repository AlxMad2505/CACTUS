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

    const LadrilloFactory = await ethers.getContractFactory("LadrilloBrick");
    ladrillo = await LadrilloFactory.deploy(
      "Test Ladrillo",
      "TLD",
      owner.address,
      1,
      INITIAL_SUPPLY,
      owner.address
    );

    const FibraFactory = await ethers.getContractFactory("FibraManager");
    fibraManager = await FibraFactory.deploy();

    const decimals = await ladrillo.decimals();
    await ladrillo.transfer(investor1.address, ethers.parseUnits("600", decimals));
    await ladrillo.transfer(investor2.address, ethers.parseUnits("400", decimals));
  });

  describe("LadrilloBrick Core", function () {
    it("Debería distribuir dividendos proporcionalmente", async function () {
      const dividendAmount = ethers.parseEther("10");
      const initialBalance1 = await ethers.provider.getBalance(investor1.address);
      const initialBalance2 = await ethers.provider.getBalance(investor2.address);

      await ladrillo.release({ value: dividendAmount });

      expect(await ethers.provider.getBalance(investor1.address)).to.equal(initialBalance1 + ethers.parseEther("6"));
      expect(await ethers.provider.getBalance(investor2.address)).to.equal(initialBalance2 + ethers.parseEther("4"));
    });

    it("Debería fallar si el dividendo es cero", async function () {
      await expect(ladrillo.release({ value: 0 })).to.be.revertedWith("El dividendo debe ser mayor a 0");
    });

    it("Debería recibir AVAX directamente y distribuirlo", async function () {
      const initialBalance1 = await ethers.provider.getBalance(investor1.address);
      
      // Simular transferencia directa de AVAX (triggers receive())
      await owner.sendTransaction({
        to: await ladrillo.getAddress(),
        value: ethers.parseEther("1")
      });

      expect(await ethers.provider.getBalance(investor1.address)).to.equal(initialBalance1 + ethers.parseUnits("0.6", "ether"));
    });
  });

  describe("FibraManager Core", function () {
    it("Solo el owner debería crear FIBRAs", async function () {
      await expect(
        fibraManager.connect(investor1).createFibra("Hack", [await ladrillo.getAddress()], 100)
      ).to.be.revertedWithCustomError(fibraManager, "OwnableUnauthorizedAccount");
    });

    it("Debería distribuir dividendos a múltiples ladrillos en una FIBRA", async function () {
      // Crear un segundo ladrillo
      const LadrilloFactory = await ethers.getContractFactory("LadrilloBrick");
      const ladrillo2 = await LadrilloFactory.deploy("Ladrillo 2", "L2", owner.address, 2, 1000, owner.address);
      
      // Darle el 100% de ladrillo2 al investor1
      await ladrillo2.transfer(investor1.address, ethers.parseUnits("1000", 18));

      // Crear FIBRA con ambos
      await fibraManager.createFibra("Fondo Dual", [await ladrillo.getAddress(), await ladrillo2.getAddress()], 500);

      const initialBalance1 = await ethers.provider.getBalance(investor1.address);
      
      // 10 AVAX a la FIBRA -> 5 AVAX a cada ladrillo.
      // Del ladrillo1 (60%): recibe 3 AVAX.
      // Del ladrillo2 (100%): recibe 5 AVAX.
      // Total esperado: 8 AVAX.
      await fibraManager.distributeFibraDividends(0, { value: ethers.parseEther("10") });

      expect(await ethers.provider.getBalance(investor1.address)).to.equal(initialBalance1 + ethers.parseEther("8"));
    });

    it("Debería emitir tokens de portafolio al crear la FIBRA", async function () {
      await fibraManager.createFibra("Portfolio", [await ladrillo.getAddress()], 1000);
      const balance = await fibraManager.balanceOf(owner.address);
      expect(ethers.formatEther(balance)).to.equal("1000.0");
    });
  });
});
