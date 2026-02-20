/**
 * ArbShield Contract Configuration
 * Deployed and verified contracts on Arbitrum Sepolia
 */

import { env } from "@/env";

export const CONTRACTS = {
  // ZK Verifier (Groth16 wrapper with real verification)
  // Deployed: Feb 19, 2026 - Requires generated Groth16 verifier contract address
  ZK_VERIFIER: (env.NEXT_PUBLIC_ZK_VERIFIER || process.env.NEXT_PUBLIC_STYLUS_VERIFIER || "0x68B54E13F3da4A3dF34Af657853769ea6D66b6d9") as `0x${string}`,

  // Groth16 verifier contract (generated from credit_score circuit)
  GROTH16_VERIFIER: (env.NEXT_PUBLIC_GROTH16_VERIFIER || "0x46dcF690A82BbbA1D1f6fDb67EC45a2Fa7A17404") as `0x${string}`,

  // Compliance Registry (stores verified attributes)
  COMPLIANCE_REGISTRY: (process.env.NEXT_PUBLIC_COMPLIANCE_REGISTRY || "0xD39184bd636D5f18604e696C149DdAF770023BEA") as `0x${string}`,

  // Mock RWA Token (for demo BUIDL portal) - Updated with mint/burn for users
  MOCK_BUIDL: (process.env.NEXT_PUBLIC_MOCK_BUIDL || "0x444709c368e2DfeAD2B91C74f81D59Ca897120a4") as `0x${string}`,

  // Passkey Registry (multi-device passkey management)
  PASSKEY_REGISTRY: (process.env.NEXT_PUBLIC_PASSKEY_REGISTRY || "0x8eD61DE37E6246a1aFDaa7fD7bFd8DA2414E4a29") as `0x${string}`,

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

const alchemyRpcUrl = env.NEXT_PUBLIC_ALCHEMY_API_KEY
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
