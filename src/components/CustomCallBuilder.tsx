"use client";

import { useState } from "react";
import { useCurrentUser, useSendUserOperation } from "@coinbase/cdp-hooks";
import { Button } from "@coinbase/cdp-react/components/ui/Button";
import { LoadingSkeleton } from "@coinbase/cdp-react/components/ui/LoadingSkeleton";
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
      <div className="transaction-success">
        <h3 className="card-title">✅ Custom Calls Executed!</h3>
        <p>Successfully executed {calls.length} call(s) in a single transaction</p>
        <p>
          Transaction:{" "}
          <a
            href={`https://${network === "base-sepolia" ? "sepolia." : ""}basescan.org/tx/${data.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            {data.transactionHash?.slice(0, 6)}...{data.transactionHash?.slice(-4)}
          </a>
        </p>
        <Button onClick={handleReset} variant="secondary" className="tx-button">
          Build More Calls
        </Button>
      </div>
    );
  }

  return (
    <div className="custom-call-container">
      <h3 className="card-title">⚙️ Custom Call Builder</h3>
      <p className="feature-description">
        Build and execute custom smart contract calls. Batch multiple operations into a single transaction for maximum efficiency.
      </p>

      {errorMessage && (
        <div className="error-message">
          <span className="error-icon">❌</span>
          {errorMessage}
        </div>
      )}

      <div className="preset-buttons">
        <h4>Quick Presets:</h4>
        <div className="preset-row">
          <Button
            onClick={() => loadPreset("erc20-transfer")}
            variant="secondary"
            size="sm"
          >
            ERC20 Transfer
          </Button>
          <Button
            onClick={() => loadPreset("multi-call")}
            variant="secondary"
            size="sm"
          >
            Multi-Call
          </Button>
          <Button
            onClick={() => loadPreset("contract-interaction")}
            variant="secondary"
            size="sm"
          >
            Contract Call
          </Button>
        </div>
      </div>

      <div className="calls-container">
        {calls.map((call, index) => (
          <div key={index} className="call-row">
            <div className="call-header">
              <span className="call-label">Call {index + 1}</span>
              {calls.length > 1 && (
                <button
                  onClick={() => removeCall(index)}
                  className="remove-call"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="call-inputs">
              <div className="input-group">
                <label className="input-label">To (Contract Address)</label>
                <input
                  type="text"
                  value={call.to}
                  onChange={(e) => updateCall(index, "to", e.target.value)}
                  placeholder="0x..."
                  className="address-input"
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Value (Wei)</label>
                <input
                  type="text"
                  value={call.value}
                  onChange={(e) => updateCall(index, "value", e.target.value)}
                  placeholder="0"
                  className="value-input"
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Data (Hex)</label>
                <textarea
                  value={call.data}
                  onChange={(e) => updateCall(index, "data", e.target.value)}
                  placeholder="0x..."
                  className="data-input"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="custom-call-actions">
        <Button
          onClick={addCall}
          variant="secondary"
          className="add-call-btn"
          disabled={isLoading}
        >
          + Add Call
        </Button>
        
        <Button
          onClick={handleExecuteCalls}
          disabled={isLoading || !smartAccount}
          className="tx-button"
        >
          {isLoading ? (
            <>
              <LoadingSkeleton className="loading--btn-text" />
              Executing...
            </>
          ) : (
            `Execute ${calls.length} Call${calls.length > 1 ? "s" : ""}`
          )}
        </Button>
      </div>

      {usePaymaster && (
        <div className="gasless-info">
          <span className="gasless-badge">⛽ Gasless Transaction</span>
          <span className="gasless-text">No gas fees required</span>
        </div>
      )}

      <div className="call-info">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Use the presets to get started quickly</li>
          <li>Value should be in Wei (1 ETH = 1000000000000000000 Wei)</li>
          <li>Data should be valid hex starting with 0x</li>
          <li>All calls execute atomically - if one fails, all fail</li>
        </ul>
      </div>
    </div>
  );
}