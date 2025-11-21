// Contract addresses (update after deployment)
export const IDENTITY_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS as `0x${string}`;

// Chain configuration
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111');

// Network names
export const NETWORK_NAMES: Record<number, string> = {
  11155111: 'Sepolia',
  8009: 'Zama Devnet',
  31337: 'Localhost',
};

// Block explorers
export const BLOCK_EXPLORERS: Record<number, string> = {
  11155111: 'https://sepolia.etherscan.io',
  8009: 'https://explorer.zama.com',
  31337: 'http://localhost:8545',
};

// Get current network name
export function getNetworkName(): string {
  return NETWORK_NAMES[CHAIN_ID] || `Chain ${CHAIN_ID}`;
}

// Get block explorer URL
export function getBlockExplorerUrl(): string {
  return BLOCK_EXPLORERS[CHAIN_ID] || '';
}

// Get transaction URL
export function getTxUrl(txHash: string): string {
  const explorer = getBlockExplorerUrl();
  return explorer ? `${explorer}/tx/${txHash}` : '';
}

// Get address URL
export function getAddressUrl(address: string): string {
  const explorer = getBlockExplorerUrl();
  return explorer ? `${explorer}/address/${address}` : '';
}
