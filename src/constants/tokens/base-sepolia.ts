import type { Token } from "@/types/swap";

// ===== Base Sepolia Testnet Tokens =====
export const BASE_SEPOLIA_TOKENS: Record<string, Token> = {
  ETH: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoUrl: "/icons/eth.svg",
    coingeckoTokenId: "ethereum"
  },
  USDC: {
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoUrl: "/icons/usdc.svg",
    coingeckoTokenId: "usd-coin"
  },
  WETH: {
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoUrl: "/icons/weth.svg",
    coingeckoTokenId: "weth"
  },
  DAI: {
    address: "0x7683022d84f726a96c4a6611cd31dbf5409c0ac9",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logoUrl: "/icons/dai.svg",
    coingeckoTokenId: "dai"
  },
};