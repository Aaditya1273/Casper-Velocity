import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { fallback, http } from "wagmi";
import { env } from "@/env";
import { ARBITRUM_SEPOLIA } from "@/lib/contracts";

// RainbowKit configuration for Arbitrum
const rpcUrls = ARBITRUM_SEPOLIA.rpcUrls.default.http;

export const wagmiConfig = getDefaultConfig({
  appName: "ArbShield",
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [ARBITRUM_SEPOLIA],
  transports: {
    [ARBITRUM_SEPOLIA.id]: fallback(rpcUrls.map((url) => http(url))),
  },
  ssr: true,
});

// Chain configuration
export const chains = [ARBITRUM_SEPOLIA];
export const supportedChains = [ARBITRUM_SEPOLIA];

export const getDefaultChain = () => {
  return ARBITRUM_SEPOLIA;
};
