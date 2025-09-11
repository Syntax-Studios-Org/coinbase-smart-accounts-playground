"use client";
import { useMemo } from "react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import { LoadingSkeleton } from "@coinbase/cdp-react/components/ui/LoadingSkeleton";
import Image from "next/image";
import Link from "next/link";

interface Props {
  network?: "base" | "base-sepolia";
}

/**
 * A component that displays the user's balance and smart account info.
 */
export default function UserBalance(props: Props) {
  const { network = "base-sepolia" } = props;

  const tokens = useMemo(
    () => Object.values(SUPPORTED_NETWORKS[network]),
    [network],
  );
  const {
    data: tokenBalances,
    isLoading,
    isRefetching,
  } = useTokenBalances(network, tokens);

  return (
    <div>
      {isLoading ? (
        <div className="space-y-3">
          <LoadingSkeleton className="h-16 w-full rounded-lg" />
          <LoadingSkeleton className="h-16 w-full rounded-lg" />
          <LoadingSkeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : (
        <div
          className={`space-y-3 ${isRefetching ? "opacity-75 transition-opacity" : ""}`}
        >
          {tokenBalances
            .sort((a, b) => {
              // Sort by balance: non-zero balances first, then zero balances
              const aBalance = parseFloat(a.formattedBalance);
              const bBalance = parseFloat(b.formattedBalance);

              if (aBalance > 0 && bBalance === 0) return -1;
              if (aBalance === 0 && bBalance > 0) return 1;
              if (aBalance > 0 && bBalance > 0) return bBalance - aBalance; // Higher balances first
              return 0; // Both zero, maintain order
            })
            .map((tokenBalance) => (
              <div
                key={tokenBalance.token.symbol}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  {tokenBalance.token.logoUrl && (
                    <Image
                      src={tokenBalance.token.logoUrl}
                      alt={tokenBalance.token.symbol}
                      className="rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      width={24}
                      height={24}
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {tokenBalance.token.symbol}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tokenBalance.token.name}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-normal text-gray-900">
                    {tokenBalance.formattedBalance} {tokenBalance.token.symbol}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {network === "base-sepolia" && (
        <p className="mt-6 text-center text-sm text-gray-500">
          Get testnet tokens from{" "}
          <Link
            href={"https://portal.cdp.coinbase.com/products/faucet"}
            target="_blank"
            className="text-blue-600 font-medium"
          >
            CDP Faucet
          </Link>
        </p>
      )}
    </div>
  );
}
