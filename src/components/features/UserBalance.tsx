"use client";
import { useCurrentUser } from "@coinbase/cdp-hooks";
import { useMemo, useState } from "react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import { LoadingSkeleton } from "@coinbase/cdp-react/components/ui/LoadingSkeleton";

interface Props {
  network?: "base" | "base-sepolia";
}

/**
 * A component that displays the user's balance and smart account info.
 */
export default function UserBalance(props: Props) {
  const { network = "base-sepolia" } = props;
  const { currentUser } = useCurrentUser();
  const [copied, setCopied] = useState(false);

  const tokens = useMemo(
    () => Object.values(SUPPORTED_NETWORKS[network]),
    [network],
  );
  const { data: tokenBalances, isLoading } = useTokenBalances(network, tokens);

  const smartAccount = currentUser?.evmSmartAccounts?.[0];
  const userEmail = currentUser?.authenticationMethods?.email?.email;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        💰 Account Overview
      </h2>

      {/* Account Info */}
      <div className="space-y-4 mb-8">
        {userEmail && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Connected Email:
            </span>
            <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
              {userEmail || "Connected"}
            </span>
          </div>
        )}

        {smartAccount && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Smart Account:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(smartAccount)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded font-mono transition-colors group"
                title="Click to copy full address"
              >
                <span>{`${smartAccount.slice(0, 6)}...${smartAccount.slice(-4)}`}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied ? "✅" : "📋"}
                </span>
              </button>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                ✨ Smart
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Network:</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {network === "base-sepolia" ? "🧪 Base Sepolia" : "🔵 Base Mainnet"}
          </span>
        </div>
      </div>

      {/* Token Balances */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Token Balances
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            <LoadingSkeleton className="h-16 w-full rounded-lg" />
            <LoadingSkeleton className="h-16 w-full rounded-lg" />
            <LoadingSkeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : (
          <div className="space-y-3">
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
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {tokenBalance.token.logoUrl && (
                      <img
                        src={tokenBalance.token.logoUrl}
                        alt={tokenBalance.token.symbol}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {tokenBalance.token.symbol}
                      </div>
                      <div className="text-sm text-gray-500">
                        {tokenBalance.token.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {tokenBalance.formattedBalance}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Get testnet ETH from{" "}
        <a
          href="https://portal.cdp.coinbase.com/products/faucet"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-500 text-blue-400 underline"
        >
          Base Sepolia Faucet
        </a>
      </p>
    </div>
  );
}
