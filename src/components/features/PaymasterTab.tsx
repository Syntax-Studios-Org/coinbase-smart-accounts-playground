"use client";

import { Fuel, Zap, Shield, Users, Coins, Info, AlertTriangle } from "lucide-react";
import ScreenHeader from "@/components/ui/ScreenHeader";

interface PaymasterTabProps {
  selectedNetwork: "base" | "base-sepolia";
  usePaymaster: boolean;
  paymasterUrl: string;
  onPaymasterUrlChange: (url: string) => void;
}

/**
 * Dedicated Paymaster configuration tab
 */
export default function PaymasterTab({
  selectedNetwork,
  usePaymaster,
  paymasterUrl,
  onPaymasterUrlChange,
}: PaymasterTabProps) {
  const isTestnet = selectedNetwork === "base-sepolia";

  const benefits = [
    {
      icon: Zap,
      title: "Gasless Transactions",
      description: "Users don't need to hold ETH for gas fees, making onboarding seamless for new users."
    },
    {
      icon: Shield,
      title: "Better UX",
      description: "Eliminates the complexity of managing gas fees and native tokens for end users."
    },
    {
      icon: Users,
      title: "Mass Adoption", 
      description: "Removes barriers to entry, enabling mainstream adoption of blockchain applications."
    },
    {
      icon: Coins,
      title: "Cost Predictability",
      description: "Applications can sponsor transactions and provide predictable costs to users."
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader 
        icon={Fuel} 
        title="Paymaster" 
        description="Paymasters enable gasless transactions by sponsoring gas fees for users. This dramatically improves user experience by removing the need to hold native tokens for gas."
      />
      
      <div className="flex-1 mx-[20%] px-6 pb-6">
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-500 mb-3">Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div key={benefit.title} className="bg-[#FAFAFA] rounded-md p-4">
                <IconComponent className="w-5 h-5 text-gray-600 mb-3" />
                <p className="text-gray-600 text-[13px] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network-specific Configuration */}
      {isTestnet ? (
        /* Base Sepolia Configuration */
        <div className="mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 text-sm">
                Free CDP Paymaster (sponsored by default)
              </span>
              <Info className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      ) : (
        /* Base Mainnet Configuration */
        <div className="mb-6">
          {usePaymaster && (
            <div className="bg-[#FAFAFA] rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Paymaster Service URL
              </label>
              <input
                type="url"
                value={paymasterUrl}
                onChange={(e) => onPaymasterUrlChange(e.target.value)}
                placeholder="https://"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the URL of your paymaster service that will sponsor gas fees for transactions on Base Mainnet.
              </p>
            </div>
          )}
          
          <div className="bg-orange-50 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-orange-700 text-sm">
                Custom paymaster URL required for Base Mainnet
              </span>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}