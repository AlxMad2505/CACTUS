import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // 1. Desplegar LadrilloBrick (Token ERC-20 para un inmueble específico)
  // Nota: propertyNFTContract y propertyId son ficticios para esta prueba local
  const nftContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const propertyId = 1;
  const initialSupply = 1000; // 1000 ladrillos

  console.log("Desplegando LadrilloBrick...");
  const LadrilloBrick = await ethers.getContractFactory("LadrilloBrick");
  const ladrillo = await LadrilloBrick.deploy(
    "Ladrillo Residencial Reforma",
    "LRR",
    nftContractAddress,
    propertyId,
    initialSupply,
    deployer.address
  );
  await ladrillo.waitForDeployment();
  const ladrilloAddress = await ladrillo.getAddress();
  console.log("LadrilloBrick desplegado en:", ladrilloAddress);

  // 2. Desplegar FibraManager
  console.log("Desplegando FibraManager...");
  const FibraManager = await ethers.getContractFactory("FibraManager");
  const fibraManager = await FibraManager.deploy();
  await fibraManager.waitForDeployment();
  const fibraManagerAddress = await fibraManager.getAddress();
  console.log("FibraManager desplegado en:", fibraManagerAddress);

  // 3. Crear una FIBRA y agrupar el Ladrillo
  console.log("Configurando FIBRA inicial...");
  const createTx = await fibraManager.createFibra(
    "Fondo CDMX Centro",
    [ladrilloAddress],
    5000 // Supply de la FIBRA
  );
  await createTx.wait();
  console.log("FIBRA 'Fondo CDMX Centro' creada exitosamente.");

  console.log("\n--- Resumen de Despliegue ---");
  console.log("LadrilloBrick:", ladrilloAddress);
  console.log("FibraManager:", fibraManagerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
