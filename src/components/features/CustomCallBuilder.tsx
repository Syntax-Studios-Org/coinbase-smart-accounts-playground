"use client";

import { useState } from "react";
import { useCurrentUser, useSendUserOperation } from "@coinbase/cdp-hooks";
import { isAddress, isHex } from "viem";

interface CustomCall {
  to: string;
  value: string;
  data: string;
}

interface CustomCallBuilderProps {
  network: "base" | "base-sepolia";
  usePaymaster: boolean;
  paymasterUrl: string;
}

/**
 * Custom call builder for advanced smart contract interactions
 */
export default function CustomCallBuilder({
  network,
  usePaymaster,
  paymasterUrl,
}: CustomCallBuilderProps) {
  const { currentUser } = useCurrentUser();
  const { sendUserOperation, data, error, status } = useSendUserOperation();

  const [calls, setCalls] = useState<CustomCall[]>([
    { to: "", value: "0", data: "0x" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");

  const smartAccount = currentUser?.evmSmartAccounts?.[0];
  const isLoading = status === "pending";
  const isSuccess = status === "success" && data;

  const addCall = () => {
    setCalls([...calls, { to: "", value: "0", data: "0x" }]);
  };

  const removeCall = (index: number) => {
    if (calls.length > 1) {
      setCalls(calls.filter((_, i) => i !== index));
    }
  };

  const updateCall = (index: number, field: keyof CustomCall, value: string) => {
    const updated = [...calls];
    updated[index] = { ...updated[index], [field]: value };
    setCalls(updated);
  };

  const validateCalls = (): string | null => {
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];

      if (!call.to) {
        return `Call ${i + 1}: Target address is required`;
      }

      if (!isAddress(call.to)) {
        return `Call ${i + 1}: Invalid target address format`;
      }

      if (call.value && isNaN(parseFloat(call.value))) {
        return `Call ${i + 1}: Invalid value format`;
      }

      if (call.data && !isHex(call.data)) {
        return `Call ${i + 1}: Data must be valid hex (starting with 0x)`;
      }
    }

    return null;
  };

  const handleExecuteCalls = async () => {
    if (!smartAccount) {
      setErrorMessage("No Smart Account found");
      return;
    }

    const validationError = validateCalls();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setErrorMessage("");

      // Convert calls to the format expected by sendUserOperation
      const formattedCalls = calls.map((call) => ({
        to: call.to as `0x${string}`,
        value: BigInt(call.value || "0"),
        data: call.data as `0x${string}`,
      }));

      const paymasterConfig = usePaymaster
        ? network === "base-sepolia"
          ? { useCdpPaymaster: true }
          : paymasterUrl
          ? { paymasterUrl }
          : {}
        : {};

      await sendUserOperation({
        evmSmartAccount: smartAccount,
        network,
        calls: formattedCalls,
        ...paymasterConfig,
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const handleReset = () => {
    setCalls([{ to: "", value: "0", data: "0x" }]);
    setErrorMessage("");
  };

  const loadPreset = (preset: "erc20-transfer" | "multi-call" | "contract-interaction") => {
    switch (preset) {
      case "erc20-transfer":
        setCalls([{
          to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
          value: "0",
          data: "0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b8d0c9e3e0c0e61e64000000000000000000000000000000000000000000000000000000000000000a" // transfer(address,uint256) - 10 USDC to example address
        }]);
        break;
      case "multi-call":
        setCalls([
          { to: "", value: "1000000000000000", data: "0x" }, // 0.001 ETH transfer
          { to: "", value: "0", data: "0x" }, // Contract call
        ]);
        break;
      case "contract-interaction":
        setCalls([{
          to: "",
          value: "0",
          data: "0x095ea7b3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        }]);
        break;
    }
  };

  if (isSuccess && data) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Custom Calls Executed!</h3>
        <p className="text-gray-600 mb-4">Successfully executed {calls.length} call(s) in a single transaction</p>
        <p className="mb-6">
          Transaction:{" "}
          <a
            href={`https://${network === "base-sepolia" ? "sepolia." : ""}basescan.org/tx/${data.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-500 font-mono"
          >
            {data.transactionHash?.slice(0, 6)}...{data.transactionHash?.slice(-4)}
          </a>
        </p>
        <button onClick={handleReset} className="btn-secondary">
          Build More Calls
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">⚙️ Custom Call Builder</h3>
      <p className="text-gray-600 mb-6">
        Build and execute custom smart contract calls. Batch multiple operations into a single transaction for maximum efficiency.
      </p>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-red-500">❌</span>
            <span className="text-red-800">{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Presets:</h4>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => loadPreset("erc20-transfer")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md text-sm transition-colors"
          >
            ERC20 Transfer
          </button>
          <button
            onClick={() => loadPreset("multi-call")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md text-sm transition-colors"
          >
            Multi-Call
          </button>
          <button
            onClick={() => loadPreset("contract-interaction")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md text-sm transition-colors"
          >
            Contract Call
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {calls.map((call, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-900">Call {index + 1}</span>
              {calls.length > 1 && (
                <button
                  onClick={() => removeCall(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To (Contract Address)</label>
                <input
                  type="text"
                  value={call.to}
                  onChange={(e) => updateCall(index, "to", e.target.value)}
                  placeholder="0x..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value (Wei)</label>
                <input
                  type="text"
                  value={call.value}
                  onChange={(e) => updateCall(index, "value", e.target.value)}
                  placeholder="0"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data (Hex)</label>
                <textarea
                  value={call.data}
                  onChange={(e) => updateCall(index, "data", e.target.value)}
                  placeholder="0x..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={addCall}
          disabled={isLoading}
          className="btn-secondary"
        >
          + Add Call
        </button>

        <button
          onClick={handleExecuteCalls}
          disabled={isLoading || !smartAccount}
          className="btn-primary"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Executing Calls...
            </div>
          ) : (
            `Execute ${calls.length} Call${calls.length > 1 ? "s" : ""}`
          )}
        </button>
      </div>

      {usePaymaster && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">⛽ Gasless</span>
            <span className="text-green-700 text-sm">No gas fees required</span>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use the presets to get started quickly</li>
          <li>• Value should be in Wei (1 ETH = 1000000000000000000 Wei)</li>
          <li>• Data should be valid hex starting with 0x</li>
          <li>• All calls execute atomically - if one fails, all fail</li>
        </ul>
      </div>
    </div>
  );
}
