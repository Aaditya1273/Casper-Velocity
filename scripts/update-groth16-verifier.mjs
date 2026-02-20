import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "..", ".env");
const envRaw = fs.readFileSync(envPath, "utf8");
const env = Object.fromEntries(
  envRaw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

const PRIVATE_KEY = env.PRIVATE_KEY;
const RPC_URL = env.ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc";
const ZK_VERIFIER = env.NEXT_PUBLIC_ZK_VERIFIER || "0x68B54E13F3da4A3dF34Af657853769ea6D66b6d9";

const deployedPath = path.resolve(__dirname, "..", "contracts", "deployed-addresses.json");
const deployed = JSON.parse(fs.readFileSync(deployedPath, "utf8"));
const GROTH16_VERIFIER = deployed?.contracts?.Groth16Verifier;

if (!PRIVATE_KEY) {
  throw new Error("Missing PRIVATE_KEY in .env");
}
if (!GROTH16_VERIFIER) {
  throw new Error("Missing Groth16Verifier in contracts/deployed-addresses.json");
}

const account = privateKeyToAccount(
  PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`
);

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(RPC_URL),
});

const walletClient = createWalletClient({
  account,
  chain: arbitrumSepolia,
  transport: http(RPC_URL),
});

const abi = parseAbi([
  "function groth16Verifier() view returns (address)",
  "function updateGroth16Verifier(address _newVerifier)",
]);

console.log("ZKVerifier:", ZK_VERIFIER);
console.log("Target Groth16 verifier:", GROTH16_VERIFIER);

const current = await publicClient.readContract({
  address: ZK_VERIFIER,
  abi,
  functionName: "groth16Verifier",
});

console.log("Current Groth16 verifier:", current);

if (current.toLowerCase() === GROTH16_VERIFIER.toLowerCase()) {
  console.log("✅ Groth16 verifier already set. Nothing to do.");
  process.exit(0);
}

console.log("Sending updateGroth16Verifier tx...");
const hash = await walletClient.writeContract({
  address: ZK_VERIFIER,
  abi,
  functionName: "updateGroth16Verifier",
  args: [GROTH16_VERIFIER],
});

console.log("Tx hash:", hash);
const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("✅ Confirmed in block", receipt.blockNumber?.toString());
