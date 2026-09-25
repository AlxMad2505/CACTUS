import BitacoraInmueble from "./abis/BitacoraInmueble.sol/BitacoraInmueble.json";
import MockIcmMessenger from "./abis/mocks/MockIcmMessenger.sol/MockIcmMessenger.json";
import IcmPropertyPortal from "./abis/IcmPropertyPortal.sol/IcmPropertyPortal.json";

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
