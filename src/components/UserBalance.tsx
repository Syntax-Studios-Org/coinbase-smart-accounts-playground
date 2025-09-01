"use client";
import { useEvmAddress, useCurrentUser } from "@coinbase/cdp-hooks";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import { LoadingSkeleton } from "@coinbase/cdp-react/components/ui/LoadingSkeleton";

interface Props {
  balance?: string;
  network?: "base" | "base-sepolia";
}

/**
 * A component that displays the user's balance and smart account info.
 */
export default function UserBalance(props: Props) {
  const { balance, network = "base-sepolia" } = props;
  const { evmAddress } = useEvmAddress();
  const { currentUser } = useCurrentUser();
  
  const tokens = Object.values(SUPPORTED_NETWORKS[network]);
  const { data: tokenBalances, isLoading, totalUsdBalance } = useTokenBalances(network, tokens);
  
  const smartAccount = currentUser?.evmSmartAccounts?.[0];

  return (
    <div className="balance-container">
      <h2 className="card-title">💰 Account Overview</h2>
      
      {/* Account Info */}
      <div className="account-info">
        <div className="account-row">
          <span className="account-label">EOA Address:</span>
          <code className="account-value">
            {evmAddress ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}` : "Not connected"}
          </code>
        </div>
        
        {smartAccount && (
          <div className="account-row">
            <span className="account-label">Smart Account:</span>
            <code className="account-value">
              {`${smartAccount.slice(0, 6)}...${smartAccount.slice(-4)}`}
            </code>
            <span className="smart-badge">✨ Smart</span>
          </div>
        )}
        
        <div className="account-row">
          <span className="account-label">Network:</span>
          <span className="network-badge">
            {network === "base-sepolia" ? "🧪 Base Sepolia" : "🔵 Base Mainnet"}
          </span>
        </div>
      </div>

      {/* Token Balances */}
      <div className="token-balances">
        <h3 className="balance-title">Token Balances</h3>
        
        {isLoading ? (
          <div className="loading-balances">
            <LoadingSkeleton className="loading--balance" />
            <LoadingSkeleton className="loading--balance" />
            <LoadingSkeleton className="loading--balance" />
          </div>
        ) : (
          <>
            {totalUsdBalance > 0 && (
              <div className="total-balance">
                <span className="total-label">Total Value:</span>
                <span className="total-value">${totalUsdBalance.toFixed(2)}</span>
              </div>
            )}
            
            <div className="token-list">
              {tokenBalances.map((tokenBalance) => (
                <div key={tokenBalance.token.symbol} className="token-item">
                  <div className="token-info">
                    {tokenBalance.token.logoUrl && (
                      <img 
                        src={tokenBalance.token.logoUrl} 
                        alt={tokenBalance.token.symbol}
                        className="token-icon"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="token-details">
                      <span className="token-symbol">{tokenBalance.token.symbol}</span>
                      <span className="token-name">{tokenBalance.token.name}</span>
                    </div>
                  </div>
                  
                  <div className="token-amounts">
                    <span className="token-balance">{tokenBalance.formattedBalance}</span>
                    {tokenBalance.usdValue && tokenBalance.usdValue > 0 && (
                      <span className="token-usd">${tokenBalance.usdValue.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <p className="faucet-link">
        Get testnet ETH from{" "}
        <a
          href="https://portal.cdp.coinbase.com/products/faucet"
          target="_blank"
          rel="noopener noreferrer"
        >
          Base Sepolia Faucet
        </a>
      </p>
    </div>
  );
}
