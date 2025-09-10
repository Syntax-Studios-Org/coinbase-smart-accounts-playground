"use client";

import { useState, useEffect } from "react";
import {
  FileCode2,
  Hammer,
  Fuel,
  Globe,
  Zap,
  ChevronsRight,
} from "lucide-react";
import MultiSendTransaction from "@/components/features/MultiSendTransaction";
import CustomCallBuilder from "@/components/features/CustomCallBuilder";
import PaymasterTab from "@/components/features/PaymasterTab";
import UserBalance from "@/components/features/UserBalance";
import AddressDropdown from "@/components/ui/AddressDropdown";
import Link from "next/link";

type PlaygroundTab = "multi-send" | "custom-calls" | "paymaster";

/**
 * Smart Account Playground - Main component showcasing CDP Smart Account features
 */
export default function SmartAccountPlayground() {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("multi-send");
  const [selectedNetwork, setSelectedNetwork] = useState<
    "base" | "base-sepolia"
  >("base-sepolia");
  const [usePaymaster, setUsePaymaster] = useState(true);
  const [paymasterUrl, setPaymasterUrl] = useState("");

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    const savedPaymasterUrl = localStorage.getItem("cdp-paymaster-url");
    const savedNetwork = localStorage.getItem("cdp-selected-network") as "base" | "base-sepolia";
    const savedUsePaymaster = localStorage.getItem("cdp-use-paymaster");

    if (savedPaymasterUrl) {
      setPaymasterUrl(savedPaymasterUrl);
    }
    if (savedNetwork && (savedNetwork === "base" || savedNetwork === "base-sepolia")) {
      setSelectedNetwork(savedNetwork);
    }
    if (savedUsePaymaster !== null) {
      setUsePaymaster(savedUsePaymaster === "true");
    }
  }, []);

  // Save paymaster URL to localStorage whenever it changes
  const handlePaymasterUrlChange = (url: string) => {
    setPaymasterUrl(url);
    if (url.trim()) {
      localStorage.setItem("cdp-paymaster-url", url);
    } else {
      localStorage.removeItem("cdp-paymaster-url");
    }
  };

  // Save network selection to localStorage
  const handleNetworkChange = (network: "base" | "base-sepolia") => {
    setSelectedNetwork(network);
    localStorage.setItem("cdp-selected-network", network);
  };

  // Save paymaster toggle state to localStorage
  const handlePaymasterToggle = (enabled: boolean) => {
    setUsePaymaster(enabled);
    localStorage.setItem("cdp-use-paymaster", enabled.toString());
  };

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
    },
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
                  className={`w-full flex items-center gap-3 px-0 py-3 text-left transition-colors cursor-pointer ${
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
          <h3 className="text-xs font-medium text-gray-400 mb-3">Network</h3>
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
                    <span className="text-sm text-gray-900">
                      {network.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNetworkChange(network.id)}
                    className={`p-1 py-0.5 rounded-sm text-[11px] font-medium cursor-pointer ${
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
          <h3 className="text-xs font-medium text-gray-400 mb-3">
            Configure Gas
          </h3>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-900">Gasless Transaction</div>
                <div className="text-xs text-gray-500">
                  sponsored by{" "}
                  <Link
                    href={"https://portal.cdp.coinbase.com/products/paymaster/configuration"}
                    target="_blank"
                    className="text-blue-600 font-medium"
                  >
                    CDP
                  </Link>
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={usePaymaster}
                onChange={(e) => handlePaymasterToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0075FF]"></div>
            </label>
          </div>
        </div>

        {/* Balances Section */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 mb-3">Balances</h3>
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
            onPaymasterUrlChange={handlePaymasterUrlChange}
          />
        )}
      </div>
    </div>
  );
}
