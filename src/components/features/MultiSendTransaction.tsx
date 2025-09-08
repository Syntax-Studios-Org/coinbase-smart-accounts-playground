"use client";

import { useState } from "react";
import { ChevronsRight, Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { useCurrentUser, useSendUserOperation } from "@coinbase/cdp-hooks";
import { parseUnits, isAddress, formatUnits, encodeFunctionData } from "viem";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import ScreenHeader from "@/components/ui/ScreenHeader";

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
  const [collapsedRecipients, setCollapsedRecipients] = useState<boolean[]>([false]);
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
    setCollapsedRecipients([...collapsedRecipients, false]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
      setCollapsedRecipients(collapsedRecipients.filter((_, i) => i !== index));
    }
  };

  const toggleRecipientCollapse = (index: number) => {
    const newCollapsed = [...collapsedRecipients];
    newCollapsed[index] = !newCollapsed[index];
    setCollapsedRecipients(newCollapsed);
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

  const handleMultiSend = async () => {
    if (!smartAccount) {
      setErrorMessage("Smart account not found");
      return;
    }

    // Validate all recipients
    const hasErrors = recipients.some((recipient, index) => {
      if (!recipient.address || !isAddress(recipient.address)) {
        setErrorMessage(`Invalid address for recipient ${index + 1}`);
        return true;
      }
      if (!recipient.amount || parseFloat(recipient.amount) <= 0) {
        setErrorMessage(`Invalid amount for recipient ${index + 1}`);
        return true;
      }
      return false;
    });

    if (hasErrors) return;

    try {
      setErrorMessage("");

      // Build calls for multi-send
      const calls = recipients.map((recipient) => {
        const token = tokens[recipient.token];
        const amount = parseUnits(recipient.amount, token.decimals);

        if (recipient.token === "ETH") {
          // Native ETH transfer
          return {
            to: recipient.address as `0x${string}`,
            value: amount,
            data: "0x" as const,
          };
        } else {
          // ERC-20 transfer
          const transferData = encodeFunctionData({
            abi: [
              {
                name: "transfer",
                type: "function",
                inputs: [
                  { name: "to", type: "address" },
                  { name: "amount", type: "uint256" },
                ],
                outputs: [{ name: "", type: "bool" }],
              },
            ],
            functionName: "transfer",
            args: [recipient.address as `0x${string}`, amount],
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
    setCollapsedRecipients([false]);
    setErrorMessage("");
    setAddressErrors({});
    setShowSuccess(false);
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Send Successful!</h3>
        <p className="text-gray-600 mb-4">
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
    <div className="flex flex-col h-full">
      <ScreenHeader
        icon={ChevronsRight}
        title="MultiSend"
        description="Send tokens to multiple recipients in a single transaction. Save on gas and improve efficiency with batch operations."
      />

      <div className="flex-1 mx-[20%] px-6 pb-6">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-red-500">❌</span>
              <span className="text-red-800">{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {recipients.map((recipient, index) => {
            const isCollapsed = collapsedRecipients[index];
            const tokenBalance = tokenBalances?.find(tb => tb.token.symbol === recipient.token);

            return (
              <div key={index} className="bg-[#FAFAFA] rounded-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-4 py-2">
                  <span className="font-medium text-gray-900">Recipient {index + 1}</span>
                  <div className="flex items-center">
                    {recipients.length > 1 && (
                      <>
                        <button
                          onClick={() => removeRecipient(index)}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-2" />
                      </>
                    )}
                    <button
                      onClick={() => toggleRecipientCollapse(index)}
                      className="text-gray-500 hover:text-gray-700 p-2 transition-colors"
                      type="button"
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Content */}
                {!isCollapsed && (
                  <div className="px-4 pb-4">
                    <div className="bg-white rounded-lg p-4">
                      {/* Top Half */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Wallet Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            Wallet Address
                          </label>
                          <input
                            type="text"
                            value={recipient.address}
                            onChange={(e) => updateRecipient(index, "address", e.target.value)}
                            placeholder="0x..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter the address</p>
                          {addressErrors[index] && (
                            <p className="text-xs text-red-500 mt-1">{addressErrors[index]}</p>
                          )}
                        </div>

                        {/* Token Selector */}
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            Select a token
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                              {tokens[recipient.token].logoUrl && (
                                <img
                                  src={tokens[recipient.token].logoUrl}
                                  alt={recipient.token}
                                  className="w-4 h-4 rounded-full"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                            </div>
                            <select
                              value={recipient.token}
                              onChange={(e) => updateRecipient(index, "token", e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                            >
                              {Object.entries(tokens).map(([symbol, token]) => (
                                <option key={symbol} value={symbol}>
                                  {token.name} | ${symbol}
                                </option>
                              ))}
                            </select>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Make sure you select the correct token</p>
                        </div>
                      </div>

                      {/* Bottom Half */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-900">
                            Transfer Amount
                          </label>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Bal: {tokenBalance?.formattedBalance || "0"}</span>
                            <button
                              onClick={() => {
                                if (tokenBalance) {
                                  updateRecipient(index, "amount", tokenBalance.formattedBalance);
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                              type="button"
                            >
                              MAX
                            </button>
                          </div>
                        </div>
                        <input
                          type="number"
                          value={recipient.amount}
                          onChange={(e) => updateRecipient(index, "amount", e.target.value)}
                          placeholder="0.0"
                          step="any"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Amount of tokens you want to send</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add New Recipient - Full Width */}
        <div className="bg-[#FAFAFA] rounded-lg p-4 py-2 mb-6">
          <button
            onClick={addRecipient}
            disabled={isLoading}
            className="w-full text-center text-gray-700 hover:text-gray-900 transition-colors flex items-center justify-center space-x-4"
          >
            Add a new recipient <span><Plus size={16} /></span>
          </button>
        </div>


        {usePaymaster && (
          <div className="bg-[#0ED0651A] border-none rounded-lg p-2 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[#0ED065] text-sm">No Gas Fees Required</span>
              <span className="bg-[#0ED065] text-white text-xs font-medium px-3 py-1 rounded-lg">Gasless</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Always at Bottom */}
      <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {recipients.length} Recipient{recipients.length > 1 ? "s" : ""}
        </span>

        <button
          onClick={handleMultiSend}
          disabled={isLoading || !smartAccount}
          className="bg-[#0075FF] text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending Transaction...
            </div>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}
