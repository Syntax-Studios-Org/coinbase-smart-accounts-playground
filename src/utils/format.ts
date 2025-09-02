/**
 * Format an address to show first 6 and last 4 characters
 */
export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format a transaction hash for display
 */
export const formatTxHash = (hash: string): string => {
  if (!hash) return "";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

/**
 * Format a number to a specific number of decimal places
 */
export const formatNumber = (num: number, decimals: number = 6): string => {
  return num.toFixed(decimals);
};

/**
 * Format USD value
 */
export const formatUSD = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

/**
 * Get explorer URL for a transaction
 */
export const getExplorerUrl = (
  txHash: string,
  network: "base" | "base-sepolia"
): string => {
  const baseUrl = network === "base-sepolia" 
    ? "https://sepolia.basescan.org" 
    : "https://basescan.org";
  return `${baseUrl}/tx/${txHash}`;
};