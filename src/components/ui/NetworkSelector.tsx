"use client";

interface NetworkSelectorProps {
  selectedNetwork: "base" | "base-sepolia";
  onNetworkChange: (network: "base" | "base-sepolia") => void;
}

/**
 * Network selector component for switching between Base and Base Sepolia
 */
export default function NetworkSelector({ selectedNetwork, onNetworkChange }: NetworkSelectorProps) {
  const networks = [
    {
      id: "base-sepolia" as const,
      name: "Base Sepolia",
      description: "Testnet with free paymaster",
      icon: "🧪",
      color: "#0052FF"
    },
    {
      id: "base" as const,
      name: "Base Mainnet",
      description: "Production network",
      icon: "🔵",
      color: "#0052FF"
    }
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">🌐 Network</h3>
      <div className="space-y-2">
        {networks.map((network) => (
          <button
            key={network.id}
            className={`w-full flex items-center gap-2 p-3 text-sm rounded-md transition-colors ${
              selectedNetwork === network.id
                ? "bg-primary-100 text-primary-700 border border-primary-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => onNetworkChange(network.id)}
          >
            <span>{network.icon}</span>
            <div className="flex-1 text-left">
              <div className="font-medium">{network.name}</div>
              <div className="text-xs text-gray-500">{network.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}