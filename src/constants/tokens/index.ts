import { BASE_TOKENS } from "./base";
import { BASE_SEPOLIA_TOKENS } from "./base-sepolia";

export const SUPPORTED_NETWORKS = {
  base: BASE_TOKENS,
  "base-sepolia": BASE_SEPOLIA_TOKENS,
} as const;

export type SupportedNetwork = keyof typeof SUPPORTED_NETWORKS;

export { BASE_TOKENS, BASE_SEPOLIA_TOKENS };