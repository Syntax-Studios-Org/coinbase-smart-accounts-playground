export const APP_CONFIG = {
  name: "CDP Smart Account Playground",
  description: "Explore the power of CDP Smart Accounts with gasless transactions, batch operations, and enhanced UX",
  version: "1.0.0",
  author: "Coinbase Developer Platform",
} as const;

export const API_CONFIG = {
  retryAttempts: 3,
  timeout: 10000,
  staleTime: 60 * 1000, // 1 minute
} as const;

export const TRANSACTION_CONFIG = {
  confirmationTimeout: 60000, // 60 seconds
  balanceRefreshInterval: 30000, // 30 seconds
} as const;

export const VALIDATION_CONFIG = {
  otpLength: 6,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;