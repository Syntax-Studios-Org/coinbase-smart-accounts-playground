"use client";

import { useState } from "react";
import { useCurrentUser } from "@coinbase/cdp-hooks";
import Header from "@/components/layout/Header";
import UserBalance from "@/components/features/UserBalance";
import MultiSendTransaction from "@/components/features/MultiSendTransaction";
import CustomCallBuilder from "@/components/features/CustomCallBuilder";
import PaymasterTab from "@/components/features/PaymasterTab";
import { PaymasterSettings, NetworkSelector } from "@/components";

type PlaygroundTab = "multi-send" | "custom-calls" | "paymaster";

/**
 * Smart Account Playground - Main component showcasing CDP Smart Account features
 */
export default function SmartAccountPlayground() {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("multi-send");
  const [selectedNetwork, setSelectedNetwork] = useState<"base" | "base-sepolia">("base-sepolia");
  const [usePaymaster, setUsePaymaster] = useState(true);
  const [paymasterUrl, setPaymasterUrl] = useState("");

  const tabs = [
    { id: "multi-send" as const, label: "Multi Send", icon: "📤" },
    { id: "custom-calls" as const, label: "Custom Calls", icon: "⚙️" },
    { id: "paymaster" as const, label: "Paymaster", icon: "⛽" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Tab Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Network & Paymaster Settings */}
          <div className="mt-8 space-y-4">
            <NetworkSelector
              selectedNetwork={selectedNetwork}
              onNetworkChange={setSelectedNetwork}
            />
            <PaymasterSettings
              usePaymaster={usePaymaster}
              paymasterUrl={paymasterUrl}
              selectedNetwork={selectedNetwork}
              onTogglePaymaster={setUsePaymaster}
              onPaymasterUrlChange={setPaymasterUrl}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 bg-white m-4 rounded-lg shadow-sm border border-gray-200 overflow-auto">
            {activeTab === "multi-send" && (
              <MultiSendTransaction
                network={selectedNetwork}
                usePaymaster={usePaymaster}
                paymasterUrl={paymasterUrl}
              />
            )}

            {activeTab === "custom-calls" && (
              <CustomCallBuilder
                network={selectedNetwork}
                usePaymaster={usePaymaster}
                paymasterUrl={paymasterUrl}
              />
            )}

            {activeTab === "paymaster" && (
              <PaymasterTab
                selectedNetwork={selectedNetwork}
                usePaymaster={usePaymaster}
                paymasterUrl={paymasterUrl}
                onPaymasterUrlChange={setPaymasterUrl}
              />
            )}
          </div>

          {/* Right Sidebar - Balance */}
          <div className="w-80 bg-white border-l border-gray-200 m-4 ml-0 rounded-lg shadow-sm overflow-auto">
            <UserBalance network={selectedNetwork} />
          </div>
        </div>
      </div>
    </div>
  );
}
