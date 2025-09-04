"use client";

import { useState } from "react";
import { useCurrentUser, useSendUserOperation } from "@coinbase/cdp-hooks";
import { parseUnits, isAddress, formatUnits, encodeFunctionData } from "viem";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import { useTokenBalances } from "@/hooks/useTokenBalances";

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
  const [addressErrors, setAddressErrors] = useState<Record<number, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const smartAccount = currentUser?.evmSmartAccounts?.[0];
  const tokens = SUPPORTED_NETWORKS[network];
  const isLoading = status === "pending";
  const isSuccess = status === "success" && data && showSuccess;

  // Get token balances for max button functionality
  const { data: tokenBalances } = useTokenBalances(network, Object.values(tokens));

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

    // Validate address in real-time
    if (field === "address") {
      const newAddressErrors = { ...addressErrors };
      if (value && !isAddress(value)) {
        newAddressErrors[index] = "Invalid address format";
      } else {
        delete newAddressErrors[index];
      }
      setAddressErrors(newAddressErrors);
    }
  };

  const setMaxAmount = (index: number, tokenSymbol: string) => {
    const token = tokens[tokenSymbol];
    const tokenBalance = tokenBalances?.find(tb => tb.token.symbol === tokenSymbol);

    if (tokenBalance && tokenBalance.balance > 0n) {
      const maxAmount = formatUnits(tokenBalance.balance, token.decimals);
      updateRecipient(index, "amount", maxAmount);
    }
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

    // Check for address errors
    if (Object.keys(addressErrors).length > 0) {
      setErrorMessage("Please fix address validation errors");
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
          // ERC20 transfer using proper ABI encoding
          const transferData = encodeFunctionData({
            abi: [
              {
                name: 'transfer',
                type: 'function',
                inputs: [
                  { name: 'to', type: 'address' },
                  { name: 'amount', type: 'uint256' }
                ],
                outputs: [{ name: '', type: 'bool' }],
                stateMutability: 'nonpayable'
              }
            ],
            functionName: 'transfer',
            args: [recipient.address as `0x${string}`, amount]
          });

          return {
            to: token.address,
            value: 0n,
            data: transferData,
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

      // Show success state only after successful transaction
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const handleReset = () => {
    setRecipients([{ address: "", amount: "", token: "ETH" }]);
    setErrorMessage("");
    setAddressErrors({});
    setShowSuccess(false); // Hide success state to return to form
  };

  if (isSuccess && data) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Multi-Send Complete!</h3>
        <p className="text-gray-600 mb-4">Successfully sent tokens to {recipients.length} recipient(s)</p>
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
          Send Another Multi-Send
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">📤 Multi Send Tokens</h3>
      <p className="text-gray-600 mb-6">
        Send tokens to multiple recipients in a single transaction. Save on gas and improve efficiency with batch operations.
      </p>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-red-500">❌</span>
            <span className="text-red-800">{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {recipients.map((recipient, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-900">Recipient {index + 1}</span>
              {recipients.length > 1 && (
                <button
                  onClick={() => removeRecipient(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={recipient.address}
                  onChange={(e) => updateRecipient(index, "address", e.target.value)}
                  placeholder="0x..."
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    addressErrors[index] ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {addressErrors[index] && (
                  <p className="text-red-500 text-xs mt-1">{addressErrors[index]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={recipient.amount}
                    onChange={(e) => updateRecipient(index, "amount", e.target.value)}
                    placeholder="0.0"
                    step="any"
                    min="0"
                    className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setMaxAmount(index, recipient.token)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
                <select
                  value={recipient.token}
                  onChange={(e) => updateRecipient(index, "token", e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={addRecipient}
          disabled={isLoading}
          className="btn-secondary"
        >
          + Add Recipient
        </button>

        <button
          onClick={handleMultiSend}
          disabled={isLoading || !smartAccount}
          className="btn-primary"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending Transaction...
            </div>
          ) : (
            `Send to ${recipients.length} Recipient${recipients.length > 1 ? "s" : ""}`
          )}
        </button>
      </div>

      {usePaymaster && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">⛽ Gasless</span>
            <span className="text-green-700 text-sm">No gas fees required</span>
          </div>
        </div>
      )}
    </div>
  );
}
