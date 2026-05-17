import { BrowserProvider, ContractFactory, Contract } from "ethers";
import { ABIs, Bytecodes } from "./contracts";

export interface SetupProgress {
  step: number;
  message: string;
  hashes: string[];
  addresses: Record<string, string>;
}

export async function runSystemSetup(onProgress: (progress: SetupProgress) => void) {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No ethereum provider found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const hashes: string[] = [];
  const addresses: Record<string, string> = {};

  try {
    // Step 1: Deploy BitacoraInmueble
    onProgress({ step: 1, message: "Desplegando BitacoraInmueble...", hashes, addresses });
    const BitacoraFactory = new ContractFactory(
      ABIs.BitacoraInmueble,
      Bytecodes.BitacoraInmueble,
      signer
    );
    const bitacora = await BitacoraFactory.deploy();
    hashes.push(bitacora.deploymentTransaction()?.hash || "");
    onProgress({ step: 1, message: "Esperando confirmación de BitacoraInmueble...", hashes, addresses });
    await bitacora.waitForDeployment();
    addresses.BitacoraInmueble = await bitacora.getAddress();

    // Step 2: Deploy MockIcmMessenger
    onProgress({ step: 2, message: "Desplegando MockIcmMessenger...", hashes, addresses });
    const MessengerFactory = new ContractFactory(
      ABIs.MockIcmMessenger,
      Bytecodes.MockIcmMessenger,
      signer
    );
    const messenger = await MessengerFactory.deploy();
    hashes.push(messenger.deploymentTransaction()?.hash || "");
    onProgress({ step: 2, message: "Esperando confirmación de MockIcmMessenger...", hashes, addresses });
    await messenger.waitForDeployment();
    addresses.MockIcmMessenger = await messenger.getAddress();

    // Step 3: Deploy IcmPropertyPortal
    onProgress({ step: 3, message: "Desplegando IcmPropertyPortal...", hashes, addresses });
    const PortalFactory = new ContractFactory(
      ABIs.IcmPropertyPortal,
      Bytecodes.IcmPropertyPortal,
      signer
    );
    const portal = await PortalFactory.deploy(addresses.MockIcmMessenger);
    hashes.push(portal.deploymentTransaction()?.hash || "");
    onProgress({ step: 3, message: "Esperando confirmación de IcmPropertyPortal...", hashes, addresses });
    await portal.waitForDeployment();
    addresses.IcmPropertyPortal = await portal.getAddress();

    // Step 4: Link Portal to Bitacora
    onProgress({ step: 4, message: "Vinculando Portal en BitacoraInmueble...", hashes, addresses });
    const bitacoraContract = new Contract(addresses.BitacoraInmueble, ABIs.BitacoraInmueble, signer);
    const tx = await bitacoraContract.setPropertyPortal(addresses.IcmPropertyPortal);
    hashes.push(tx.hash);
    onProgress({ step: 4, message: "Esperando confirmación de vinculación...", hashes, addresses });
    await tx.wait();

    onProgress({ step: 5, message: "¡Sistema configurado exitosamente!", hashes, addresses });
    return { addresses, hashes };
  } catch (error) {
    console.error("Error during system setup:", error);
    throw error;
  }
}
