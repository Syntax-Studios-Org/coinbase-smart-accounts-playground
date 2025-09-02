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
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">⛽ Paymaster</h3>
      
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={usePaymaster}
            onChange={(e) => onTogglePaymaster(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          />
          <span className="text-sm font-medium text-gray-900">
            {usePaymaster ? "Gasless Enabled" : "Gas Required"}
          </span>
        </label>
      </div>

      {usePaymaster && (
        <div className="mt-3">
          {isTestnet ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-xs">✅</span>
                <span className="text-xs font-medium text-green-800">Free CDP Paymaster</span>
              </div>
              <p className="text-green-700 text-xs mt-1">
                Sponsored by CDP
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <span className="text-orange-600 text-xs">⚙️</span>
                <span className="text-xs font-medium text-orange-800">Configure in Paymaster tab</span>
              </div>
              <p className="text-orange-700 text-xs mt-1">
                Set paymaster URL in the Paymaster tab
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}