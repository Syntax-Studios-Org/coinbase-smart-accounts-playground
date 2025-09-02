import { useState, useEffect, useCallback } from "react";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import { formatUnits } from "viem";
import type {
  Token,
  TokenBalance,
  TokenBalancesApiResponse,
  ApiTokenBalance,
} from "@/types/swap";
import type { SupportedNetwork } from "@/constants/tokens";

export const useTokenBalances = (
  network: SupportedNetwork,
  tokens: Token[],
) => {
  const { evmAddress } = useEvmAddress();
  const [data, setData] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalUsdBalance, setTotalUsdBalance] = useState<number>(0);

  const fetchBalances = useCallback(async (): Promise<void> => {
    if (!evmAddress) {
      setData([]);
      setTotalUsdBalance(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch balances only
      const balancesResponse = await fetch("/api/balances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: evmAddress,
          network,
        }),
      });

      if (!balancesResponse.ok) {
        throw new Error("Failed to fetch balances");
      }

      const balancesResult: TokenBalancesApiResponse =
        await balancesResponse.json();

      const balances: TokenBalance[] = tokens.map((token) => {
        const apiBalance = balancesResult.balances?.find(
          (balance: ApiTokenBalance) =>
            balance.token.contractAddress?.toLowerCase() ===
            token.address.toLowerCase(),
        );

        // Use BigInt for precise token amounts to avoid JavaScript floating point errors
        const balance = apiBalance
          ? BigInt(apiBalance.amount.amount)
          : BigInt(0);
        const decimals = apiBalance
          ? apiBalance.amount.decimals
          : token.decimals;
        const formattedBalance = formatUnits(balance, decimals);
        const numericBalance = parseFloat(formattedBalance);

        return {
          token,
          balance,
          formattedBalance: numericBalance.toFixed(6),
          usdValue: 0, // No USD values needed
        };
      });

      setData(balances);
      setTotalUsdBalance(0);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch balances");
      setError(error);
      console.error("Error fetching token balances:", error);

      // Set fallback data on error
      const fallbackBalances = tokens.map((token) => ({
        token,
        balance: BigInt(0),
        formattedBalance: "0.000000",
        usdValue: 0,
      }));
      setData(fallbackBalances);
    } finally {
      setIsLoading(false);
    }
  }, [evmAddress, network]); // Removed 'tokens' from dependencies

  useEffect(() => {
    fetchBalances();
  }, [evmAddress, network]); // Only re-fetch when address or network changes

  useEffect(() => {
    // Auto-refresh token balances every 30 seconds
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [fetchBalances]);

  return { data, isLoading, error, refetch: fetchBalances, totalUsdBalance };
};
