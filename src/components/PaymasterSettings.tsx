"use client";

interface PaymasterSettingsProps {
  usePaymaster: boolean;
  paymasterUrl: string;
  selectedNetwork: "base" | "base-sepolia";
  onTogglePaymaster: (enabled: boolean) => void;
  onPaymasterUrlChange: (url: string) => void;
}

/**
 * Paymaster configuration component
 */
export default function PaymasterSettings({
  usePaymaster,
  paymasterUrl,
  selectedNetwork,
  onTogglePaymaster,
  onPaymasterUrlChange,
}: PaymasterSettingsProps) {
  const isTestnet = selectedNetwork === "base-sepolia";

  return (
    <div className="paymaster-settings">
      <h3 className="selector-title">⛽ Paymaster</h3>
      
      <div className="paymaster-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={usePaymaster}
            onChange={(e) => onTogglePaymaster(e.target.checked)}
            className="toggle-input"
          />
          <span className="toggle-slider"></span>
          <span className="toggle-text">
            {usePaymaster ? "Gasless Enabled" : "Gas Required"}
          </span>
        </label>
      </div>

      {usePaymaster && (
        <div className="paymaster-config">
          {isTestnet ? (
            <div className="paymaster-info">
              <div className="info-badge success">
                ✅ Free CDP Paymaster Active
              </div>
              <p className="info-text">
                Transactions on Base Sepolia are sponsored by the CDP paymaster
              </p>
            </div>
          ) : (
            <div className="paymaster-url-input">
              <label htmlFor="paymaster-url" className="input-label">
                Paymaster URL (Base Mainnet)
              </label>
              <input
                id="paymaster-url"
                type="url"
                value={paymasterUrl}
                onChange={(e) => onPaymasterUrlChange(e.target.value)}
                placeholder="https://your-paymaster.example.com"
                className="url-input"
              />
              <p className="input-help">
                Enter your paymaster service URL for Base mainnet transactions
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}