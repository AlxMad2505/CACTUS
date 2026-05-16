/**
 * @title checkDebts.js
 * @notice Script de Chainlink Functions para validar adeudos de Predial y Agua.
 * @author Gemini CLI Agent
 * 
 * Este script se ejecuta off-chain en el DON (Decentralized Oracle Network).
 * Recibe la clave catastral como argumento y consulta una API externa.
 */

// 1. Obtener argumentos (pasados desde el contrato inteligente)
const cadastralKey = args[0];

// 2. Definir la URL de la API (Mock para el Hackathon)
// En producción, esto sería una API gubernamental o de servicios.
const apiBaseUrl = "https://mock-api.propiedad-digital.xyz/v1/debts";
const url = `${apiBaseUrl}?cadastralKey=${cadastralKey}`;

console.log(`Consultando adeudos para la clave: ${cadastralKey}`);

// 3. Realizar la petición HTTP
const debtRequest = Functions.makeHttpRequest({
  url: url,
  method: "GET",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  }
});

// 4. Procesar la respuesta
const response = await debtRequest;

if (response.error) {
  console.error("Error en la petición API:", response.error);
  throw Error("Fallo en la consulta de adeudos externos");
}

const { data } = response;

/**
 * Lógica de Negocio:
 * La API devuelve un objeto: { predial: 0, agua: 0, status: "clear" }
 * Consideramos "limpia" si ambos adeudos son 0.
 */
const isClear = (data.predial === 0 && data.agua === 0);

console.log(`Resultado de auditoría: ${isClear ? "LIMPIA" : "CON ADEUDO"}`);

// 5. Retornar el resultado codificado
// Retornamos un booleano que el contrato decodificará con abi.decode(response, (bool))
// Nota: Functions.encodeUint256(1) es equivalente a true en el decoding de Solidity
return Functions.encodeUint256(isClear ? 1 : 0);
