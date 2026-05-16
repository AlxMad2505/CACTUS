// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPropertyStructures {
    
    enum PropertyStatus { ACTIVA, EN_ESCROW, TOKENIZADA, BLOQUEADA }
    enum ServiceType { PREDIAL, AGUA, LUZ }

    // 1. REGISTRO PRINCIPAL: Garantiza la integridad del activo y sus derivados
    struct PropertyRecord {
        address currentOwner;       // 20 bytes -> Dueño actual
        uint64 constructionDate;    // 8 bytes  -> Timestamp de origen
        PropertyStatus status;      // 1 byte   -> Estado en el ciclo de vida
        bool isLocked;              // 1 byte   -> Bloqueo anti-fraude para el Escrow
        // --- FIN DEL SLOT 1 (30/32 bytes ocupados) ---
        
        uint32 area;                // 4 bytes  -> Metros cuadrados
        address brickTokenAddress;  // 20 bytes -> Dirección del ERC-20 de esta propiedad (0x0 si no está tokenizada)
        // --- FIN DEL SLOT 2 (24/32 bytes ocupados) ---
        
        string cadastralKey;        // Clave catastral única (ID gubernamental)
        string ipfsMetadataHash;    // Planos, escrituras e historial legal pesado en IPFS
    }

    // 2. CERTIFICADO DE ADEUDOS: Modificado para soportar auditorías independientes de servicios
    struct ServiceDebtStatus {
        uint64 lastVerification;    // 8 bytes -> Timestamp de la consulta del oráculo
        bool isClear;               // 1 byte  -> true = Sin adeudo, false = Con adeudo o no verificado
        uint256 amountOwed;         // 32 bytes -> Monto de la deuda (0 si está limpio)
    }

    // 3. LOG HISTÓRICO: El "currículum" auditable de la propiedad
    struct HistoryLog {
        address actor;              // Quién firmó el evento (dueño, perito, oráculo)
        uint64 timestamp;           // Cuándo ocurrió
        string description;         // Ej: "Certificación limpia de predial vía Chainlink"
    }
}