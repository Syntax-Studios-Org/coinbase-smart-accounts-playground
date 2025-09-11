# 🚀 CDP Smart Account Playground

A comprehensive demo showcasing the power of Coinbase Developer Platform (CDP) Smart Accounts with gasless transactions, batch operations, and enhanced user experience.

## ✨ Features

### 🔐 CDP Wallet Integration
- **One-click sign-in** with CDP Wallet (email/SMS)
- **Automatic Smart Account provisioning** upon login
- **Clean account display** with connected email and Smart Account address
- **Multi-network support** - Base Sepolia testnet

### 📤 Multi-Send Transactions
- **Batch token transfers** to multiple recipients in a single transaction
- **Support for ETH and ERC20 tokens** (USDC, WETH, DAI, etc.)
- **Dynamic recipient management** - add/remove recipients as needed
- **Input validation** with real-time error feedback
- **Gas optimization** through batching

### ⚙️ Custom Call Builder
- **Advanced smart contract interactions** with custom data
- **Batch multiple calls** into a single user operation
- **Preset templates** for common operations (ERC20 transfers, approvals, etc.)
- **Hex data input** with validation
- **Value and target address configuration**

### ⛽ Paymaster Integration
- **Gasless transactions** on Base Sepolia (free CDP paymaster)
- **Toggle gasless mode** on/off in sidebar

### 💰 Enhanced Balance Display
- **Multi-token balance tracking** for Base Sepolia
- **Real-time balance updates** every 30 seconds
- **Token icons and metadata** display
- **Network-specific token lists**

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/balances/            # Token balance API
│   ├── globals.css              # Tailwind CSS + custom styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── components/                   # Organized by concern
│   ├── layout/                  # Page structure components
│   │   ├── Header.tsx           # Main header with auth
│   │   ├── SmartAccountPlayground.tsx # Main playground layout
│   │   ├── SignInScreen.tsx     # Authentication screen
│   │   └── ClientApp.tsx        # Client-side app wrapper
│   │
│   ├── features/                # Business logic components
│   │   ├── MultiSendTransaction.tsx   # Batch token transfers
│   │   ├── CustomCallBuilder.tsx      # Smart contract interactions
│   │   ├── UserBalance.tsx            # Token balance display
│   │   └── PaymasterTab.tsx           # Paymaster configuration
│   │
│   ├── ui/                      # Reusable UI components
│   │   ├── AddressDropdown.tsx  # Address display and actions
│   │   ├── CustomDropdown.tsx   # Generic dropdown component
│   │   ├── ScreenHeader.tsx     # Common screen header
│   │   ├── TransactionCompletionModal.tsx # Transaction success modal
│   │   ├── Loading.tsx          # Loading states
│   │   └── Icons.tsx            # Icon components
│   │
│   ├── Providers.tsx            # CDP React provider setup
│   ├── theme.ts                 # CDP theme configuration
│   └── index.ts                 # Clean component exports
│
├── constants/                   # Application constants
│   ├── networks/               # Network configurations
│   └── tokens/                 # Token definitions by network
│
├── hooks/                      # Custom React hooks
│   └── useTokenBalances.ts     # Optimized balance fetching
│
├── lib/                        # Utility libraries
│   ├── constants.ts            # App-wide constants
│   └── validation.ts           # Input validation
│
├── utils/                      # Helper functions
│   ├── format.ts               # Formatting utilities
│   └── clipboard.ts            # Clipboard utilities and hooks
│
└── types/                      # TypeScript definitions
    └── swap.ts                 # Token & balance types
```

## 🚦 Getting Started

### Prerequisites
1. **CDP Project ID** from [CDP Portal](https://portal.cdp.coinbase.com)
2. **CORS whitelist** for your domain in CDP Portal
3. **CDP API credentials** for balance fetching

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
- View connected email and Smart Account address in the sidebar

### 2. Multi-Send Transactions
- Navigate to the "Multi Send" tab
- Add multiple recipients with addresses and amounts
- Select token type (ETH, USDC, WETH, DAI)
- Execute batch transfer in a single gasless transaction

### 3. Custom Call Builder
- Use "Custom Calls" tab for advanced interactions
- Build custom smart contract calls with target address, value, and data
- Use presets for common patterns (ERC20 transfers, approvals)
- Execute multiple calls atomically

### 4. Paymaster Configuration
- Toggle gasless mode in the left sidebar
- Base Sepolia: Automatic free sponsorship

## 🌐 Supported Networks

### Base Sepolia (Testnet)
- **Chain ID**: 84532
- **Paymaster**: Free CDP sponsorship
- **Faucet**: [Base Sepolia Faucet](https://portal.cdp.coinbase.com/products/faucet)

## 🎯 Key Benefits

- ✅ **Gasless Transactions**: No gas fees for users
- ✅ **Batch Operations**: Multiple actions in one transaction
- ✅ **Enhanced UX**: Simplified blockchain interactions
- ✅ **Developer Friendly**: Clean, organized codebase
- ✅ **Production Ready**: Professional UI and error handling

## 📚 Learn More

- [CDP Documentation](https://docs.cdp.coinbase.com/)
- [CDP React Hooks Documentation](https://docs.cdp.coinbase.com/embedded-wallets/react-hooks)
- [Smart Accounts Guide](https://docs.cdp.coinbase.com/embedded-wallets/smart-accounts)
- [CDP Portal](https://portal.cdp.coinbase.com)
