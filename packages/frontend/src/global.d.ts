interface Window {
  ethereum?: {
    request: (request: { method: string; params?: Array<any> }) => Promise<any>;
    on?: (event: string, callback: (...args: any[]) => void) => void;
    removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  };
}