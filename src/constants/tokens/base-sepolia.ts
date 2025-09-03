import type { Token } from "@/types/swap";

// ===== Base Sepolia Testnet Tokens =====
export const BASE_SEPOLIA_TOKENS: Record<string, Token> = {
  ETH: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoUrl: "/icons/eth.svg"
  },
  USDC: {
    address: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoUrl: "/icons/usdc.svg",
  },
  CBBTC: {
     address: "0xcbb7c0006f23900c38eb856149f799620fcb8a4a",
     symbol: "cbBTC",
     name: "Coinbase Wrapped BTC",
     decimals: 8,
     logoUrl: "/icons/cbbtc.webp",
   },
   EURC: {
     address: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
     symbol: "EURC",
     name: "EURO Coin",
     decimals: 6,
     logoUrl: "/icons/eurc.svg",
   },
};
