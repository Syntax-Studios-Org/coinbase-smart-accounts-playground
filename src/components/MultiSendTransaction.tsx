"use client";

import { useState } from "react";
import { useCurrentUser, useSendUserOperation } from "@coinbase/cdp-hooks";
import { Button } from "@coinbase/cdp-react/components/ui/Button";
import { LoadingSkeleton } from "@coinbase/cdp-react/components/ui/LoadingSkeleton";
import { parseUnits, isAddress } from "viem";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";

interface MultiSendRecipient {
  address: string;
  amount: string;
  token: string;
}

interface MultiSendTransactionProps {
  network: "base" | "base-sepolia";
  usePaymaster: boolean;
  paymasterUrl: string;
}

/**
 * Multi-send transaction component for batch token transfers
 */
export default function MultiSendTransaction({
  network,
  usePaymaster,
  paymasterUrl,
}: MultiSendTransactionProps) {
  const { currentUser } = useCurrentUser();
  const { sendUserOperation, data, error, status } = useSendUserOperation();
  
  const [recipients, setRecipients] = useState<MultiSendRecipient[]>([
    { address: "", amount: "", token: "ETH" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");

  const smartAccount = currentUser?.evmSmartAccounts?.[0];
  const tokens = SUPPORTED_NETWORKS[network];
  const isLoading = status === "pending";
  const isSuccess = status === "success" && data;

  const addRecipient = () => {
    setRecipients([...recipients, { address: "", amount: "", token: "ETH" }]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index: number, field: keyof MultiSendRecipient, value: string) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipients(updated);
  };

  const validateInputs = (): string | null => {
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      
      if (!recipient.address) {
        return `Recipient ${i + 1}: Address is required`;
      }
      
      if (!isAddress(recipient.address)) {
        return `Recipient ${i + 1}: Invalid address format`;
      }
      
      if (!recipient.amount || parseFloat(recipient.amount) <= 0) {
        return `Recipient ${i + 1}: Amount must be greater than 0`;
      }
    }
    
    return null;
  };

  const handleMultiSend = async () => {
    if (!smartAccount) {
      setErrorMessage("No Smart Account found");
      return;
    }

    const validationError = validateInputs();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setErrorMessage("");

      // Build calls for each recipient
      const calls = recipients.map((recipient) => {
        const token = tokens[recipient.token];
        const amount = parseUnits(recipient.amount, token.decimals);

        if (token.symbol === "ETH") {
          // Native ETH transfer
          return {
            to: recipient.address as `0x${string}`,
            value: amount,
            data: "0x" as `0x${string}`,
          };
        } else {
          // ERC20 transfer - using proper ABI encoding
          const transferData = `0xa9059cbb${recipient.address.slice(2).padStart(64, "0")}${amount.toString(16).padStart(64, "0")}`;
          return {
            to: token.address,
            value: 0n,
            data: transferData as `0x${string}`,
          };
        }
      });

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
        calls,
        ...paymasterConfig,
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const handleReset = () => {
    setRecipients([{ address: "", amount: "", token: "ETH" }]);
    setErrorMessage("");
  };

  if (isSuccess && data) {
    return (
      <div className="transaction-success">
        <h3 className="card-title">✅ Multi-Send Complete!</h3>
        <p>Successfully sent tokens to {recipients.length} recipient(s)</p>
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
          Send Another Multi-Send
        </Button>
      </div>
    );
  }

  return (
    <div className="multi-send-container">
      <h3 className="card-title">📤 Multi Send Tokens</h3>
      <p className="feature-description">
        Send tokens to multiple recipients in a single transaction. Save on gas and improve efficiency with batch operations.
      </p>

      {errorMessage && (
        <div className="error-message">
          <span className="error-icon">❌</span>
          {errorMessage}
        </div>
      )}

      <div className="recipients-container">
        {recipients.map((recipient, index) => (
          <div key={index} className="recipient-row">
            <div className="recipient-header">
              <span className="recipient-label">Recipient {index + 1}</span>
              {recipients.length > 1 && (
                <button
                  onClick={() => removeRecipient(index)}
                  className="remove-recipient"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="recipient-inputs">
              <div className="input-group">
                <label className="input-label">Address</label>
                <input
                  type="text"
                  value={recipient.address}
                  onChange={(e) => updateRecipient(index, "address", e.target.value)}
                  placeholder="0x..."
                  className="address-input"
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Amount</label>
                <input
                  type="number"
                  value={recipient.amount}
                  onChange={(e) => updateRecipient(index, "amount", e.target.value)}
                  placeholder="0.0"
                  step="any"
                  min="0"
                  className="amount-input"
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Token</label>
                <select
                  value={recipient.token}
                  onChange={(e) => updateRecipient(index, "token", e.target.value)}
                  className="token-select"
                >
                  {Object.entries(tokens).map(([symbol, token]) => (
                    <option key={symbol} value={symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="multi-send-actions">
        <Button
          onClick={addRecipient}
          variant="secondary"
          className="add-recipient-btn"
          disabled={isLoading}
        >
          + Add Recipient
        </Button>
        
        <Button
          onClick={handleMultiSend}
          disabled={isLoading || !smartAccount}
          className="tx-button"
        >
          {isLoading ? (
            <>
              <LoadingSkeleton className="loading--btn-text" />
              Sending...
            </>
          ) : (
            `Send to ${recipients.length} Recipient${recipients.length > 1 ? "s" : ""}`
          )}
        </Button>
      </div>

      {usePaymaster && (
        <div className="gasless-info">
          <span className="gasless-badge">⛽ Gasless Transaction</span>
          <span className="gasless-text">No gas fees required</span>
        </div>
      )}
    </div>
  );
}