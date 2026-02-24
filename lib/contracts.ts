/**
 * ArbShield Contract Configuration
 * Deployed and verified contracts on Arbitrum Sepolia
 */

import { env } from "@/env";

export const CONTRACTS = {
  // ZK Verifier (Groth16 wrapper with real verification)
  // Deployed: Feb 19, 2026 - Requires generated Groth16 verifier contract address
  ZK_VERIFIER: (env.NEXT_PUBLIC_ZK_VERIFIER || "0xF2eAdA47EF443Dd5020731c01b1fEa5C2E8521Fd") as `0x${string}`,

  // Groth16 verifier contract (generated from credit_score circuit)
  GROTH16_VERIFIER: (env.NEXT_PUBLIC_GROTH16_VERIFIER || "0x46dcF690A82BbbA1D1f6fDb67EC45a2Fa7A17404") as `0x${string}`,

  // Compliance Registry (stores verified attributes)
  COMPLIANCE_REGISTRY: (env.NEXT_PUBLIC_COMPLIANCE_REGISTRY || "0x464D37393C8D3991b493DBb57F5f3b8c31c7Fa60") as `0x${string}`,

  // Mock RWA Token (for demo BUIDL portal) - Updated with mint/burn for users
  MOCK_BUIDL: (env.NEXT_PUBLIC_MOCK_BUIDL || "0xa835b811a33751e10e8fce4d8091ae55292ce518") as `0x${string}`,

  // Passkey Registry (multi-device passkey management)
  PASSKEY_REGISTRY: (env.NEXT_PUBLIC_PASSKEY_REGISTRY || "0xcc00fc01c0c4749889dc6886a2ea384bba962638") as `0x${string}`,

  // Passkey Verifier (RIP-7212 precompile)
  PASSKEY_VERIFIER: "0x0000000000000000000000000000000000000100" as `0x${string}`,
} as const;

/**
 * Compliance Attribute Types
 */
export const COMPLIANCE_ATTRIBUTES = {
  CREDIT_SCORE: "credit_score",
  ACCREDITED_INVESTOR: "accredited_investor",
  KYC_VERIFIED: "kyc_verified",
  US_PERSON: "us_person",
  AGE_VERIFICATION: "age_verification",
} as const;

/**
 * Arbitrum Sepolia Chain Configuration for Wagmi/Viem
 */
const PUBLIC_ARBITRUM_SEPOLIA_RPCS = [
  "https://arb-sepolia.g.alchemy.com/v2/demo",
  "https://arbitrum-sepolia-rpc.publicnode.com",
  "https://sepolia-rollup.arbitrum.io/rpc",
];

const alchemyRpcUrl = env.NEXT_PUBLIC_ALCHEMY_API_KEY && env.NEXT_PUBLIC_ALCHEMY_API_KEY.length > 20
  ? `https://arb-sepolia.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  : undefined;

export const ARBITRUM_SEPOLIA = {
  id: 421614,
  name: "Arbitrum Sepolia",
  network: "arbitrum-sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: alchemyRpcUrl
        ? [alchemyRpcUrl, ...PUBLIC_ARBITRUM_SEPOLIA_RPCS]
        : PUBLIC_ARBITRUM_SEPOLIA_RPCS
    },
    public: {
      http: alchemyRpcUrl
        ? [alchemyRpcUrl, ...PUBLIC_ARBITRUM_SEPOLIA_RPCS]
        : PUBLIC_ARBITRUM_SEPOLIA_RPCS
    },
  },
  blockExplorers: {
    default: {
      name: "Arbiscan",
      url: "https://sepolia.arbiscan.io",
    },
  },
  testnet: true,
} as const;
