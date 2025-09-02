export const BASE_CHAIN = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.base.org"] },
    public: { http: ["https://mainnet.base.org"] },
  },
} as const;

export const BASE_SEPOLIA_CHAIN = {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] },
    public: { http: ["https://sepolia.base.org"] },
  },
} as const;

export const NETWORKS = {
  Base: {
    name: "Base",
    logoUrl: "/icons/base.svg",
    explorerUrl: "https://basescan.org",
  },
  "Base Sepolia": {
    name: "Base Sepolia",
    logoUrl: "/icons/base.svg",
    explorerUrl: "https://sepolia.basescan.org",
  },
} as const;