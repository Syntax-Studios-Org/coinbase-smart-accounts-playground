# 🚀 CDP Smart Account Playground

A comprehensive demo showcasing the power of Coinbase Developer Platform (CDP) Smart Accounts with gasless transactions, batch operations, and enhanced user experience.

## ✨ Features

### 🔐 CDP Wallet Integration
- **One-click sign-in** with CDP Wallet
- **Automatic Smart Account provisioning** upon login
- **Dual account display** - EOA address and Smart Account address
- **Multi-network support** - Base Mainnet and Base Sepolia

### 📤 Multi-Send Transactions
- **Batch token transfers** to multiple recipients in a single transaction
- **Support for ETH and ERC20 tokens** (USDC, WETH, DAI, etc.)
- **Dynamic recipient management** - add/remove recipients as needed
- **Input validation** with real-time error feedback
- **Gas optimization** through batching

### ⚙️ Custom Call Builder
- **Advanced smart contract interactions** with custom data
- **Batch multiple calls** into a single user operation
- **Preset templates** for common operations:
  - ERC20 transfers
  - Contract approvals
  - Multi-call patterns
- **Hex data input** with validation
- **Value and target address configuration**

### ⛽ Paymaster Integration
- **Gasless transactions** on Base Sepolia (free CDP paymaster)
- **Custom paymaster support** for Base Mainnet
- **Toggle gasless mode** on/off
- **Real-time paymaster configuration**

### 💰 Enhanced Balance Display
- **Multi-token balance tracking** with USD values
- **Real-time balance updates** every 30 seconds
- **Token icons and metadata** display
- **Network-specific token lists**
- **Total portfolio value** calculation

## 🏗️ Architecture

### Smart Account Benefits
- **Account Abstraction (ERC-4337)** implementation
- **Gasless transactions** through paymaster sponsorship
- **Batch operations** for improved efficiency
- **Enhanced security** with programmable validation
- **Better UX** - no gas management required

### Network Configuration
- **Base Sepolia**: Free CDP paymaster (sponsored transactions)
- **Base Mainnet**: Custom paymaster URL required

### Technology Stack
- **Next.js 15** with App Router
- **CDP React SDK** for wallet integration
- **CDP Hooks** for smart account operations
- **Viem** for Ethereum interactions
- **TypeScript** for type safety

## 🚦 Getting Started

### Prerequisites
1. **CDP Project ID** from [CDP Portal](https://portal.cdp.coinbase.com)
2. **CORS whitelist** for your domain in CDP Portal
3. **CDP API credentials** (for balance fetching)

### Environment Setup
```bash
# Copy environment template
cp env.example .env

# Configure your CDP credentials
NEXT_PUBLIC_CDP_PROJECT_ID=your-project-id
NEXT_PUBLIC_CDP_CREATE_ACCOUNT_TYPE=evm-smart
CDP_API_KEY_ID=your-api-key-id
CDP_API_KEY_SECRET=your-api-key-secret
CDP_WALLET_SECRET=your-wallet-secret
```

### Installation & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the playground.

## 🎮 Usage Guide

### 1. Sign In
- Click "Sign In" to authenticate with CDP Wallet
- Smart Account is automatically created upon first login
- View both EOA and Smart Account addresses in the dashboard

### 2. Multi-Send Transactions
- Navigate to the "Multi Send" tab
- Add multiple recipients with addresses and amounts
- Select token type (ETH, USDC, WETH, DAI)
- Execute batch transfer in a single transaction

### 3. Custom Call Builder
- Use "Custom Calls" tab for advanced interactions
- Build custom smart contract calls with:
  - Target contract address
  - Value (in Wei)
  - Hex-encoded data
- Use presets for common patterns
- Execute multiple calls atomically

### 4. Paymaster Configuration
- Toggle gasless mode on/off
- Base Sepolia: Automatic free sponsorship
- Base Mainnet: Enter custom paymaster URL
- View real-time gas sponsorship status

## 🔧 Key Components

### `SmartAccountPlayground.tsx`
Main playground interface with tab navigation and network selection.

### `MultiSendTransaction.tsx`
Batch token transfer functionality with dynamic recipient management.

### `CustomCallBuilder.tsx`
Advanced smart contract interaction builder with preset templates.

### `PaymasterSettings.tsx`
Paymaster configuration and gasless transaction toggle.

### `UserBalance.tsx`
Enhanced balance display with multi-token support and USD values.

## 🌐 Supported Networks

### Base Sepolia (Testnet)
- **Chain ID**: 84532
- **Paymaster**: Free CDP sponsorship
- **Faucet**: [Base Sepolia Faucet](https://portal.cdp.coinbase.com/products/faucet)
- **Explorer**: [Sepolia Basescan](https://sepolia.basescan.org)

### Base Mainnet
- **Chain ID**: 8453
- **Paymaster**: Custom URL required
- **Explorer**: [Basescan](https://basescan.org)

## 💡 Best Practices

### Smart Account Operations
- **Batch related operations** to save gas and improve UX
- **Use paymasters** for better user onboarding
- **Validate inputs** before submitting transactions
- **Handle errors gracefully** with user-friendly messages

### Development Tips
- **Test on Base Sepolia** first with free paymaster
- **Use TypeScript** for better development experience
- **Implement proper error handling** for network issues
- **Cache balance data** to reduce API calls

## 🔒 Security Considerations

- **Input validation** on all user inputs
- **Address verification** before transactions
- **Amount validation** to prevent overflow
- **Network verification** for correct chain operations
- **Paymaster URL validation** for custom paymasters

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set:
- `NEXT_PUBLIC_CDP_PROJECT_ID`
- `NEXT_PUBLIC_CDP_CREATE_ACCOUNT_TYPE=evm-smart`
- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `CDP_WALLET_SECRET`

### Build & Deploy
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📚 Resources

- [CDP Documentation](https://docs.cloud.coinbase.com/cdp/docs)
- [CDP React Components](https://docs.cloud.coinbase.com/cdp/docs/react-components)
- [Smart Accounts Guide](https://docs.cloud.coinbase.com/cdp/docs/smart-accounts)
- [Paymaster Integration](https://docs.cloud.coinbase.com/cdp/docs/paymasters)
- [CDP Portal](https://portal.cdp.coinbase.com)

## 🤝 Contributing

This playground serves as a reference implementation for CDP Smart Account features. Feel free to extend and customize for your specific use cases.

## 📄 License

This project is open source and available under the MIT License.