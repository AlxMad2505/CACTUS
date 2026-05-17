import BitacoraInmueble from "../../blockchain/artifacts/contracts/BitacoraInmueble.sol/BitacoraInmueble.json";
import MockIcmMessenger from "../../blockchain/artifacts/contracts/mocks/MockIcmMessenger.sol/MockIcmMessenger.json";
import IcmPropertyPortal from "../../blockchain/artifacts/contracts/IcmPropertyPortal.sol/IcmPropertyPortal.json";

export const ABIs = {
  BitacoraInmueble: BitacoraInmueble.abi,
  MockIcmMessenger: MockIcmMessenger.abi,
  IcmPropertyPortal: IcmPropertyPortal.abi,
};

export const Bytecodes = {
  BitacoraInmueble: BitacoraInmueble.bytecode,
  MockIcmMessenger: MockIcmMessenger.bytecode,
  IcmPropertyPortal: IcmPropertyPortal.bytecode,
};
