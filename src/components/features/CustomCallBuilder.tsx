"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Code,
  Coins,
  Zap,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  FileCode2,
} from "lucide-react";
import { useCurrentUser, useSendUserOperation } from "@coinbase/cdp-hooks";
import {
  isAddress,
  isHex,
  encodeFunctionData,
  createPublicClient,
  http,
} from "viem";
import { base, baseSepolia } from "viem/chains";
import {
  getSimpleStorageContract,
  SIMPLE_STORAGE_ABI,
} from "@/constants/contracts";
import ScreenHeader from "@/components/ui/ScreenHeader";

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
  const { sendUserOperation, data, status } = useSendUserOperation();

  const [calls, setCalls] = useState<CustomCall[]>([
    { to: "", value: "0", data: "0x" },
  ]);
  const [collapsedCalls, setCollapsedCalls] = useState<boolean[]>([false]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [storageValue, setStorageValue] = useState<string | null>(null);
  const [loadingStorage, setLoadingStorage] = useState(false);
  const [showStorageContract, setShowStorageContract] = useState(false);
  const [storageInputValue, setStorageInputValue] = useState("42");
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const smartAccount = currentUser?.evmSmartAccounts?.[0];
  const isLoading = status === "pending" || isLocalLoading;
  const isSuccess = status === "success" && data && showSuccess;

  // Read storage value from contract
  const readStorageValue = async () => {
    setLoadingStorage(true);
    try {
      const storageContract = getSimpleStorageContract(network);
      const client = createPublicClient({
        chain: network === "base-sepolia" ? baseSepolia : base,
        transport: http(),
      });

      const result = await client.readContract({
        address: storageContract.address as `0x${string}`,
        abi: SIMPLE_STORAGE_ABI,
        functionName: "get",
      });

      setStorageValue(result?.toString() || "0");
    } catch (error) {
      console.error("Error reading storage:", error);
      setStorageValue("Error reading value");
    } finally {
      setLoadingStorage(false);
    }
  };

  useEffect(() => {
    if (showStorageContract) {
      readStorageValue();
    }
  }, [showStorageContract, network]);

  const addCall = () => {
    setCalls([...calls, { to: "", value: "0", data: "0x" }]);
    setCollapsedCalls([...collapsedCalls, false]);
  };

  const removeCall = (index: number) => {
    if (calls.length > 1) {
      setCalls(calls.filter((_, i) => i !== index));
      setCollapsedCalls(collapsedCalls.filter((_, i) => i !== index));
    }
  };

  const toggleCallCollapse = (index: number) => {
    const newCollapsed = [...collapsedCalls];
    newCollapsed[index] = !newCollapsed[index];
    setCollapsedCalls(newCollapsed);
  };

  const updateCall = (
    index: number,
    field: keyof CustomCall,
    value: string,
  ) => {
    const updated = [...calls];
    updated[index] = { ...updated[index], [field]: value };
    setCalls(updated);
  };

  const presetCalls = [
    {
      name: "Set Value",
      icon: Code,
      action: () => {
        setShowStorageContract(true);
        const storageContract = getSimpleStorageContract(network);
        const setValue = encodeFunctionData({
          abi: SIMPLE_STORAGE_ABI,
          functionName: "set",
          args: [BigInt(storageInputValue || "42")],
        });

        setCalls([{ to: storageContract.address, value: "0", data: setValue }]);
        setCollapsedCalls([false]);
      },
    },
    {
      name: "ERC-20 Transfer",
      icon: Coins,
      action: () => {
        setShowStorageContract(false);
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
              stateMutability: "nonpayable",
            },
          ],
          functionName: "transfer",
          args: [
            "0x742d35cc6634c0532925a3b8d0c9e3e0c0e61e64" as `0x${string}`,
            BigInt("1000000"),
          ],
        });
        setCalls([
          {
            to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            value: "0",
            data: transferData,
          },
        ]);
        setCollapsedCalls([false]);
      },
    },
    {
      name: "Multi-call",
      icon: Zap,
      action: () => {
        setShowStorageContract(false);
        const storageContract = getSimpleStorageContract(network);
        const setValue123 = encodeFunctionData({
          abi: SIMPLE_STORAGE_ABI,
          functionName: "set",
          args: [BigInt(123)],
        });
        const setValue456 = encodeFunctionData({
          abi: SIMPLE_STORAGE_ABI,
          functionName: "set",
          args: [BigInt(456)],
        });

        setCalls([
          { to: storageContract.address, value: "0", data: setValue123 },
          { to: storageContract.address, value: "0", data: setValue456 },
        ]);
        setCollapsedCalls([false, false]);
      },
    },
  ];

  const handleExecute = async () => {
    if (!smartAccount) {
      setErrorMessage("Smart account not found");
      return;
    }

    // Validate all calls
    const hasErrors = calls.some((call, index) => {
      if (!call.to || !isAddress(call.to)) {
        setErrorMessage(`Invalid address for call ${index + 1}`);
        return true;
      }
      if (!call.data || !isHex(call.data)) {
        setErrorMessage(`Invalid data for call ${index + 1}`);
        return true;
      }
      return false;
    });

    if (hasErrors) return;

    try {
      setIsLocalLoading(true);
      setErrorMessage("");

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

      setShowSuccess(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Transaction failed",
      );
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleReset = () => {
    setCalls([{ to: "", value: "0", data: "0x" }]);
    setCollapsedCalls([false]);
    setErrorMessage("");
    setShowSuccess(false);
    setShowStorageContract(false);
    setStorageValue(null);
    setIsLocalLoading(false);
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Custom Calls Executed!
        </h3>
        <p className="text-gray-600 mb-4">
          Successfully executed {calls.length} call(s) in a single transaction
        </p>
        <p className="text-gray-600 mb-4">
          Transaction:{" "}
          <a
            href={`https://${network === "base-sepolia" ? "sepolia." : ""}basescan.org/tx/${data.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-500 font-mono"
          >
            {data.transactionHash?.slice(0, 6)}...
            {data.transactionHash?.slice(-4)}
          </a>
        </p>
        <button onClick={handleReset} className="btn-secondary">
          Send Another Custom Call
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader
        icon={FileCode2}
        title="Custom Calls"
        description="Build and execute custom smart contract calls. Batch multiple operations into a single transaction for maximum efficiency."
      />

      <div className="flex-1 mx-[20%] px-6 pb-6">
        {errorMessage && (
          <div className="bg-red-50 border-none rounded-lg p-4 py-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-red-500">❌</span>
              <span className="text-red-800">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Preset Buttons */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">
            Quick Presets
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {presetCalls.map((preset) => {
              const IconComponent = preset.icon;
              return (
                <button
                  key={preset.name}
                  onClick={preset.action}
                  className="bg-[#FAFAFA] rounded-lg p-3 text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">{preset.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Storage Contract Details */}
        {showStorageContract && (
          <div className="bg-[#FAFAFA] rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Simple Storage Contract
            </h4>

            {/* Set New Value Section */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Set New Value
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={storageInputValue}
                  onChange={(e) => setStorageInputValue(e.target.value)}
                  placeholder="Enter number"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    const storageContract = getSimpleStorageContract(network);
                    const setValue = encodeFunctionData({
                      abi: SIMPLE_STORAGE_ABI,
                      functionName: "set",
                      args: [BigInt(storageInputValue || "42")],
                    });
                    setCalls([
                      {
                        to: storageContract.address,
                        value: "0",
                        data: setValue,
                      },
                    ]);
                    setCollapsedCalls([false]);
                  }}
                  className="px-4 py-2 bg-[#0075FF] text-white rounded-md hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
                >
                  Update Call
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter a number to store in the contract</p>
            </div>

            {/* Current Value Section */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Current Value in Contract
              </label>
              <div className="flex gap-3">
                <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-mono">
                  {loadingStorage
                    ? "Loading..."
                    : storageValue || "Not loaded"}
                </div>
                <button
                  onClick={readStorageValue}
                  disabled={loadingStorage}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm disabled:opacity-50 whitespace-nowrap"
                >
                  Refresh
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Current value stored in the contract</p>
            </div>

            {/* Contract Info */}
            <div className="text-xs text-gray-600 bg-white rounded-lg p-3">
              <span className="font-medium">Contract Address:</span>{" "}
              <span className="font-mono">{getSimpleStorageContract(network).address}</span>
            </div>
          </div>
        )}

        {/* Custom Calls */}
        <div className="space-y-4 mb-6">
          {calls.map((call, index) => {
            const isCollapsed = collapsedCalls[index];

            return (
              <div key={index} className="bg-[#FAFAFA] rounded-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                  <span className="font-medium text-gray-900">
                    Call {index + 1}
                  </span>
                  <div className="flex items-center">
                    {calls.length > 1 && (
                      <>
                        <button
                          onClick={() => removeCall(index)}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-2" />
                      </>
                    )}
                    <button
                      onClick={() => toggleCallCollapse(index)}
                      className="text-gray-500 hover:text-gray-700 p-2 transition-colors"
                      type="button"
                    >
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                {!isCollapsed && (
                  <div className="px-4 pb-4">
                    <div className="bg-white rounded-lg p-4 space-y-4">
                      {/* Contract Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Contract Address
                        </label>
                        <input
                          type="text"
                          value={call.to}
                          onChange={(e) =>
                            updateCall(index, "to", e.target.value)
                          }
                          placeholder="0x..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter the contract address
                        </p>
                      </div>

                      {/* Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Value (ETH)
                        </label>
                        <input
                          type="text"
                          value={call.value}
                          onChange={(e) =>
                            updateCall(index, "value", e.target.value)
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Amount of ETH to send (usually 0)
                        </p>
                      </div>

                      {/* Call Data */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Call Data
                        </label>
                        <textarea
                          value={call.data}
                          onChange={(e) =>
                            updateCall(index, "data", e.target.value)
                          }
                          placeholder="0x..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Encoded function call data
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[#FAFAFA] rounded-lg p-4 py-2 mb-6">
          <button
            onClick={addCall}
            disabled={isLoading}
            className="w-full text-center text-gray-700 hover:text-gray-900 transition-colors flex items-center justify-center space-x-4"
          >
            Add a new recipient <span><Plus size={16} /></span>
          </button>
        </div>

        {usePaymaster && (
          <div className="bg-[#0ED0651A] border-none rounded-lg p-2 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[#0ED065] text-sm">
                No Gas Fees Required
              </span>
              <span className="bg-[#0ED065] text-white text-xs font-medium px-3 py-1 rounded-lg">
                Gasless
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Always at Bottom */}
      <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {calls.length} Call{calls.length > 1 ? "s" : ""}
        </span>

        <button
          onClick={handleExecute}
          disabled={isLoading || !smartAccount}
          className="bg-[#0075FF] text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Executing...
            </div>
          ) : (
            "Execute"
          )}
        </button>
      </div>
    </div>
  );
}
