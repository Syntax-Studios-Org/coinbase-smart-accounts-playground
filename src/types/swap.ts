import type { Address } from "viem";

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  coingeckoTokenId: string;
}

export interface TokenBalance {
  token: Token;
  balance: bigint;
  formattedBalance: string;
  usdValue?: number;
}

export interface ApiTokenAmount {
  amount: string;
  decimals: number;
}

export interface ApiTokenInfo {
  contractAddress?: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface ApiTokenBalance {
  token: ApiTokenInfo;
  amount: ApiTokenAmount;
}

export interface TokenBalancesApiResponse {
  balances: ApiTokenBalance[];
}
