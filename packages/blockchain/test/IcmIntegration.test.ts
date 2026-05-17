import { expect } from "chai";
import { ethers } from "hardhat";
import { 
  BitacoraInmueble, 
  IcmPropertyPortal, 
  IcmReceiverFuji, 
  MockIcmMessenger 
} from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Avalanche ICM - Sincronización Cross-Chain", function () {
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  
  let bitacora: BitacoraInmueble;
  let messenger: MockIcmMessenger;
  let portal: IcmPropertyPortal;
  let receiver: IcmReceiverFuji;

  const PROPERTY_ID = 1;
  const FUJI_CHAIN_ID = ethers.encodeBytes32String("fuji-c-chain");

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const BitacoraFactory = await ethers.getContractFactory("BitacoraInmueble");
    bitacora = await BitacoraFactory.deploy();

    const MessengerFactory = await ethers.getContractFactory("MockIcmMessenger");
    messenger = await MessengerFactory.deploy();

    const PortalFactory = await ethers.getContractFactory("IcmPropertyPortal");
    portal = await PortalFactory.deploy(await messenger.getAddress());

    const ReceiverFactory = await ethers.getContractFactory("IcmReceiverFuji");
    receiver = await ReceiverFactory.deploy(await portal.getAddress());

    await portal.setDestination(await receiver.getAddress(), FUJI_CHAIN_ID);
    await bitacora.setPropertyPortal(await portal.getAddress());

    await bitacora.setDeveloperStatus(owner.address, true);
    await bitacora.mintProperty(user.address, 100, "CATASTRO-ICM-001", "ipfs://test");
  });

  it("Debería disparar un mensaje ICM automáticamente al bloquear una propiedad", async function () {
    // Capturamos el evento MockMessageSent emitido por el Messenger
    await expect(bitacora.setPropertyLock(PROPERTY_ID, true))
      .to.emit(messenger, "MockMessageSent");
  });

  it("Debería permitir al Receptor en Fuji procesar el payload del ICM", async function () {
    const ownerAddr = user.address;
    const status = 1; // EN_ESCROW
    const payload = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address", "uint8"],
        [PROPERTY_ID, ownerAddr, status]
    );

    await expect(receiver.receivePropertyUpdate(payload))
      .to.emit(receiver, "PropertySynced")
      .withArgs(PROPERTY_ID, ownerAddr, status);

    const remoteProp = await receiver.remoteProperties(PROPERTY_ID);
    expect(remoteProp.owner).to.equal(ownerAddr);
    expect(remoteProp.status).to.equal(status);
  });

  it("No debería sincronizar si el portal no está configurado", async function () {
    await bitacora.setPropertyPortal(ethers.ZeroAddress);
    
    await expect(bitacora.setPropertyLock(PROPERTY_ID, true))
      .to.not.emit(messenger, "MockMessageSent");
  });
});
