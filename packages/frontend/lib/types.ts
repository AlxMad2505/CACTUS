export interface PropertyRecord {
  id: string;
  tokenId: string;
  title: string;
  location: string;
  area: number;
  cadastralKey: string;
  price: number;
  priceUSD: number;
  image: string;
  contractHash: string;
  registrationDate: string;
  status: "certified" | "presale" | "escrow-active" | "debts-validated";
  type: "apartment" | "house" | "penthouse" | "commercial" | "villa";
  logEntries: LogEntry[];
}

export interface LogEntry {
  date: string;
  action: string;
  txHash: string;
}

export interface FibraPortfolio {
  id: string;
  name: string;
  symbol: string;
  apy: number;
  funded: number;
  target: number;
  pricePerToken: number;
  properties: string[];
  propertyCount: number;
  description: string;
  status: "active" | "funding" | "closed";
}

export interface WalletState {
  connected: boolean;
  address: string;
  balanceAVAX: number;
  balanceLadrillos: number;
  fibraParticipations: number;
  recentTx: Transaction[];
}

export interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
  timestamp: string;
}

export type EscrowStatus = "PENDING" | "FUNDED" | "CONDITIONS_MET" | "RELEASED" | "REFUNDED";

export interface EscrowState {
  status: EscrowStatus;
  buyer: string;
  seller: string;
  amount: number;
  propertyId: string;
  oracleVerified: boolean;
}
