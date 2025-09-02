import type { Token } from "@/types/swap";

// ===== Base Mainnet Tokens =====
export const BASE_TOKENS: Record<string, Token> = {
  ETH: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoUrl: "/icons/eth.svg",
    coingeckoTokenId: "ethereum"
  },
  USDC: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
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
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logoUrl: "/icons/dai.svg",
    coingeckoTokenId: "dai"
  },
  CBBTC: {
     address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
     symbol: "cbBTC",
     name: "Coinbase Wrapped BTC",
     decimals: 8,
     logoUrl: "/icons/cbbtc.webp",
     coingeckoTokenId: "coinbase-wrapped-btc"
   },
   USDT: {
     address: "0xd9AA094a6195E209aA0aE1aA099a5A46eDD4C716",
     symbol: "USDT",
     name: "Tether USD",
     decimals: 6,
     logoUrl: "/icons/usdt.svg",
     coingeckoTokenId: "tether"
   },
};