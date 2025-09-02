"use client";

interface PaymasterTabProps {
  selectedNetwork: "base" | "base-sepolia";
  usePaymaster: boolean;
  paymasterUrl: string;
  onPaymasterUrlChange: (url: string) => void;
}

/**
 * Dedicated Paymaster configuration tab
 */
export default function PaymasterTab({
  selectedNetwork,
  usePaymaster,
  paymasterUrl,
  onPaymasterUrlChange,
}: PaymasterTabProps) {
  const isTestnet = selectedNetwork === "base-sepolia";

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">⛽ Paymaster Configuration</h3>
      <p className="text-gray-600 mb-6">
        Paymasters enable gasless transactions by sponsoring gas fees for users.
        This dramatically improves user experience by removing the need to hold native tokens for gas.
      </p>
      
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Benefits:</h4>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            No gas fees for users
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            Improved onboarding experience
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            Reduced transaction friction
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            Better conversion rates
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Network Configuration:</h4>
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <strong className="text-blue-900">Base Sepolia:</strong>
            <span className="text-blue-700 ml-2">Free CDP Paymaster (sponsored by default)</span>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <strong className="text-orange-900">Base Mainnet:</strong>
            <span className="text-orange-700 ml-2">Custom paymaster URL required</span>
          </div>
        </div>
      </div>

      {/* Paymaster URL Configuration for Mainnet */}
      {!isTestnet && usePaymaster && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Configure Paymaster for Base Mainnet</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="paymaster-url" className="block text-sm font-medium text-gray-700 mb-2">
                Paymaster Service URL
              </label>
              <input
                id="paymaster-url"
                type="url"
                value={paymasterUrl}
                onChange={(e) => onPaymasterUrlChange(e.target.value)}
                placeholder="https://your-paymaster-service.com/api/v1/paymaster"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter the URL of your paymaster service that will sponsor gas fees for transactions on Base Mainnet.
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">⚠️</span>
                <div>
                  <h5 className="text-yellow-800 font-medium">Important Notes:</h5>
                  <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                    <li>• Ensure your paymaster service is properly configured</li>
                    <li>• Test the URL endpoint before using in production</li>
                    <li>• Monitor your paymaster balance to avoid transaction failures</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Current Status:</h4>
        <div className="flex items-center gap-2">
          {usePaymaster ? (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-700 text-sm font-medium">
                Gasless transactions enabled
                {isTestnet ? " (Free CDP Paymaster)" : paymasterUrl ? " (Custom Paymaster)" : " (URL Required)"}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="text-gray-600 text-sm">Gas fees required for transactions</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}