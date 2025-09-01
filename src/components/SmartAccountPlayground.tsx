"use client";

import { useState } from "react";
import { useCurrentUser } from "@coinbase/cdp-hooks";
import Header from "@/components/Header";
import UserBalance from "@/components/UserBalance";
import MultiSendTransaction from "@/components/MultiSendTransaction";
import CustomCallBuilder from "@/components/CustomCallBuilder";
import PaymasterSettings from "@/components/PaymasterSettings";
import NetworkSelector from "@/components/NetworkSelector";

type PlaygroundTab = "multi-send" | "custom-calls" | "paymaster";

/**
 * Smart Account Playground - Main component showcasing CDP Smart Account features
 */
export default function SmartAccountPlayground() {
  const { currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("multi-send");
  const [selectedNetwork, setSelectedNetwork] = useState<"base" | "base-sepolia">("base-sepolia");
  const [usePaymaster, setUsePaymaster] = useState(true);
  const [paymasterUrl, setPaymasterUrl] = useState("");

  const smartAccount = currentUser?.evmSmartAccounts?.[0];

  const tabs = [
    { id: "multi-send" as const, label: "Multi Send", icon: "📤" },
    { id: "custom-calls" as const, label: "Custom Calls", icon: "⚙️" },
    { id: "paymaster" as const, label: "Paymaster", icon: "⛽" },
  ];

  return (
    <>
      <Header />
      <main className="main flex-col-container flex-grow">
        <div className="playground-container">
          {/* Header Section */}
          <div className="playground-header">
            <h1 className="playground-title">
              🚀 Smart Account Playground
            </h1>
            <p className="playground-subtitle">
              Explore the power of CDP Smart Accounts with gasless transactions, batch operations, and enhanced UX
            </p>
            
            {smartAccount && (
              <div className="smart-account-badge">
                <span className="smart-badge">✨ Smart Account Active</span>
                <code className="address-display">
                  {smartAccount.slice(0, 6)}...{smartAccount.slice(-4)}
                </code>
              </div>
            )}
          </div>

          {/* Network & Settings */}
          <div className="playground-controls">
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

          {/* Balance Display */}
          <div className="card card--balance">
            <UserBalance network={selectedNetwork} />
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "multi-send" && (
              <div className="card card--feature">
                <MultiSendTransaction
                  network={selectedNetwork}
                  usePaymaster={usePaymaster}
                  paymasterUrl={paymasterUrl}
                />
              </div>
            )}

            {activeTab === "custom-calls" && (
              <div className="card card--feature">
                <CustomCallBuilder
                  network={selectedNetwork}
                  usePaymaster={usePaymaster}
                  paymasterUrl={paymasterUrl}
                />
              </div>
            )}

            {activeTab === "paymaster" && (
              <div className="card card--feature">
                <div className="paymaster-info">
                  <h3>⛽ Paymaster Configuration</h3>
                  <p>
                    Paymasters enable gasless transactions by sponsoring gas fees for users.
                    This dramatically improves user experience by removing the need to hold native tokens for gas.
                  </p>
                  
                  <div className="paymaster-benefits">
                    <h4>Benefits:</h4>
                    <ul>
                      <li>✅ No gas fees for users</li>
                      <li>✅ Improved onboarding experience</li>
                      <li>✅ Reduced transaction friction</li>
                      <li>✅ Better conversion rates</li>
                    </ul>
                  </div>

                  <div className="network-info">
                    <h4>Network Configuration:</h4>
                    <div className="network-config">
                      <div className="network-item">
                        <strong>Base Sepolia:</strong> Free CDP Paymaster (sponsored by default)
                      </div>
                      <div className="network-item">
                        <strong>Base Mainnet:</strong> Custom paymaster URL required
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}