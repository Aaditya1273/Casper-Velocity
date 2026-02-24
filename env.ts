import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1).optional().default("demo"),
    NEXT_PUBLIC_CHAIN_ID: z.string().default("421614"),
    NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
    NEXT_PUBLIC_ZK_VERIFIER: z.string().optional(),
    NEXT_PUBLIC_GROTH16_VERIFIER: z.string().optional(),
    NEXT_PUBLIC_COMPLIANCE_REGISTRY: z.string().optional(),
    NEXT_PUBLIC_MOCK_BUIDL: z.string().optional(),
    NEXT_PUBLIC_PASSKEY_REGISTRY: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_ZK_VERIFIER: process.env.NEXT_PUBLIC_ZK_VERIFIER,
    NEXT_PUBLIC_GROTH16_VERIFIER: process.env.NEXT_PUBLIC_GROTH16_VERIFIER,
    NEXT_PUBLIC_COMPLIANCE_REGISTRY: process.env.NEXT_PUBLIC_COMPLIANCE_REGISTRY,
    NEXT_PUBLIC_MOCK_BUIDL: process.env.NEXT_PUBLIC_MOCK_BUIDL,
    NEXT_PUBLIC_PASSKEY_REGISTRY: process.env.NEXT_PUBLIC_PASSKEY_REGISTRY,
  },
});
