export const SIMPLE_STORAGE_ADDRESSES = {
  base: "0x1d1CddD85aF76d4c7d46d19E0Ca3a9cf8B1e699E", // Base Mainnet
  "base-sepolia": "0x9f8e02A43aD5310cf8A9991a9A464920359CaEcB", // Base Sepolia
} as const;

export const SIMPLE_STORAGE_ABI = [
  {
    "inputs": [],
    "name": "get",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x",
        "type": "uint256"
      }
    ],
    "name": "set",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const getSimpleStorageContract = (network: "base" | "base-sepolia") => ({
  address: SIMPLE_STORAGE_ADDRESSES[network],
  abi: SIMPLE_STORAGE_ABI,
});

export const CONTRACT_PRESETS = {
  SIMPLE_STORAGE: getSimpleStorageContract,
} as const;