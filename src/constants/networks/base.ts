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
  "Base Sepolia": {
    name: "Base Sepolia",
    logoUrl: "/icons/base.svg",
    explorerUrl: "https://sepolia.basescan.org",
  },
} as const;
