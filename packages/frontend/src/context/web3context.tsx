import { ethers } from "ethers";

async function conectarWalletReal() {
  // Forzamos a TypeScript a tratar window como 'any' para saltar la validación
  const { ethereum } = window as any;

  if (ethereum) {
    try {
      // Usamos la variable destructurada
      const cuentas = await ethereum.request({ method: "eth_requestAccounts" });
      const direccionUsuario = cuentas[0];
      
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      
      console.log("Sesión iniciada con la wallet real:", direccionUsuario);
      return { provider, signer, direccionUsuario };
      
    } catch (error) {
      console.error("El usuario rechazó la conexión a la wallet real", error);
    }
  } else {
    alert("Por favor, instala Core Wallet o MetaMask.");
  }
}