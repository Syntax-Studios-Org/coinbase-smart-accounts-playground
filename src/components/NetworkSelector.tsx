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
    <div className="network-selector">
      <h3 className="selector-title">🌐 Network</h3>
      <div className="network-options">
        {networks.map((network) => (
          <button
            key={network.id}
            className={`network-option ${selectedNetwork === network.id ? "selected" : ""}`}
            onClick={() => onNetworkChange(network.id)}
          >
            <span className="network-icon">{network.icon}</span>
            <div className="network-info">
              <div className="network-name">{network.name}</div>
              <div className="network-description">{network.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}