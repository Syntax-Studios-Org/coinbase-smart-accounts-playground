"use client";

import { useState } from "react";
import { FileCode2, Hammer, Fuel, Globe, Zap, ChevronsRight } from "lucide-react";
import MultiSendTransaction from "@/components/features/MultiSendTransaction";
import CustomCallBuilder from "@/components/features/CustomCallBuilder";
import PaymasterTab from "@/components/features/PaymasterTab";
import UserBalance from "@/components/features/UserBalance";
import AddressDropdown from "@/components/ui/AddressDropdown";

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
    { id: "multi-send" as const, label: "MultiSend", icon: ChevronsRight },
    { id: "custom-calls" as const, label: "Custom Calls", icon: FileCode2 },
    { id: "paymaster" as const, label: "Paymaster", icon: Fuel },
  ];

  const networks = [
    {
      id: "base" as const,
      name: "Base Mainnet",
      icon: Globe,
    },
    {
      id: "base-sepolia" as const,
      name: "Base Sepolia",
      icon: Hammer,
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-[#F5F5F5] p-6">
        {/* Address Dropdown */}
        <div className="mb-8">
          <AddressDropdown selectedNetwork={selectedNetwork} />
        </div>

        {/* Navigation Tabs */}
        <nav className="mb-8">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`w-full flex items-center gap-3 px-0 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? "text-[#0075FF]"
                      : "text-[#404040] hover:text-[#0075FF]"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Network Section */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Network</h3>
          <div className="space-y-2">
            {networks.map((network) => {
              const IconComponent = network.icon;
              const isActive = selectedNetwork === network.id;
              return (
                <div
                  key={network.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{network.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedNetwork(network.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-[#0075FF] text-white"
                        : "bg-[#E5E5E5] text-[#737373] hover:bg-gray-300"
                    }`}
                  >
                    {isActive ? "ACTIVE" : "SWITCH"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configure Gas Section */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Configure Gas</h3>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-900">Gasless Transaction</div>
                <div className="text-xs text-gray-500">sponsored by CDP</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={usePaymaster}
                onChange={(e) => setUsePaymaster(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0075FF]"></div>
            </label>
          </div>
        </div>

        {/* Balances Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Balances</h3>
          <UserBalance network={selectedNetwork} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white m-6 ml-3 rounded-md overflow-auto">
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
    </div>
  );
}
