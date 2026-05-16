import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando contratos en Avalanche Fuji con la cuenta:", deployer.address);

  // --- CONFIGURACIÓN FUJI ---
  // Router de Chainlink Functions en Fuji: https://docs.chain.link/chainlink-functions/supported-networks
  const routerAddress = "0xA9d587a00A31A52Ed70D6026794a8bf5E5033CfA";
  const donId = ethers.encodeBytes32String("fun-avalanche-fuji-1");
  const subscriptionId = 0; // NOTA: El usuario debe configurar esto después o pasar el ID de su suscripción
  const marketplaceWallet = deployer.address; // Usamos al deployer como wallet de marketplace por ahora

  // 1. Desplegar BitacoraInmueble (Identidad NFT)
  console.log("\n1. Desplegando BitacoraInmueble...");
  const BitacoraFactory = await ethers.getContractFactory("BitacoraInmueble");
  const bitacora = await BitacoraFactory.deploy();
  await bitacora.waitForDeployment();
  const bitacoraAddress = await bitacora.getAddress();
  console.log("BitacoraInmueble desplegado en:", bitacoraAddress);

  // 2. Desplegar PropertyEscrow (Transacción)
  console.log("\n2. Desplegando PropertyEscrow...");
  const EscrowFactory = await ethers.getContractFactory("PropertyEscrow");
  const escrow = await EscrowFactory.deploy(
    routerAddress,
    bitacoraAddress,
    subscriptionId,
    donId,
    marketplaceWallet
  );
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("PropertyEscrow desplegado en:", escrowAddress);

  // 3. Configurar Autorización
  console.log("\n3. Configurando autorizaciones...");
  const authTx = await bitacora.setAuthorizedEscrow(escrowAddress);
  await authTx.wait();
  console.log("PropertyEscrow autorizado en BitacoraInmueble.");

  // 4. Desplegar LadrilloBrick y FibraManager (Inversión)
  console.log("\n4. Desplegando contratos de inversión...");
  const LadrilloFactory = await ethers.getContractFactory("LadrilloBrick");
  const ladrillo = await LadrilloFactory.deploy(
    "Ladrillo Residencial Reforma",
    "LRR",
    bitacoraAddress,
    1, // PropertyID inicial
    1000,
    deployer.address
  );
  await ladrillo.waitForDeployment();
  console.log("LadrilloBrick desplegado en:", await ladrillo.getAddress());

  const FibraFactory = await ethers.getContractFactory("FibraManager");
  const fibraManager = await FibraFactory.deploy();
  await fibraManager.waitForDeployment();
  console.log("FibraManager desplegado en:", await fibraManager.getAddress());

  console.log("\n--- RESUMEN DE DESPLIEGUE (FUJI) ---");
  console.log("BitacoraInmueble:", bitacoraAddress);
  console.log("PropertyEscrow:", escrowAddress);
  console.log("LadrilloBrick:", await ladrillo.getAddress());
  console.log("FibraManager:", await fibraManager.getAddress());
  console.log("Marketplace Wallet:", marketplaceWallet);
  console.log("------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
