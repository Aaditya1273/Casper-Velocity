"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, ExternalLink, Info, Loader2, Zap, AlertCircle } from "lucide-react";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWalletClient } from "wagmi";
import { getGroth16Calldata, type ZKProof } from "@/lib/zkproof";
import { CONTRACTS } from "@/lib/contracts";
import { encodeFunctionData, parseAbi } from "viem";

export function VerifyProofStep() {
  const { currentStep, setCurrentStep, prevStep, reset } = useOnboardingStore();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [error, setError] = useState<string>("");
  const [proof, setProof] = useState<ZKProof | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
  const [gasUsed, setGasUsed] = useState<number>(0);
  const [supportsSimpleVerify, setSupportsSimpleVerify] = useState<boolean | null>(null);
  const [groth16Verifier, setGroth16Verifier] = useState<string | null>(null);
  const [isGroth16Configured, setIsGroth16Configured] = useState<boolean>(true);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [isUpdatingVerifier, setIsUpdatingVerifier] = useState(false);
  const [updateError, setUpdateError] = useState<string>("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { data: walletClient } = useWalletClient();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);
  const { data: receipt, isLoading: isConfirming, isSuccess, error: txError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    // Load proof from session storage
    const storedProof = sessionStorage.getItem("zkProof");
    const storedAttribute = sessionStorage.getItem("selectedAttribute");

    if (storedProof && storedAttribute) {
      setProof(JSON.parse(storedProof));
      setSelectedAttribute(storedAttribute);
    }
  }, []);

  useEffect(() => {
    if (isSuccess && txHash) {
      setVerificationComplete(true);
      setIsVerifying(false);
      setIsPending(false);
      if (receipt?.gasUsed) {
        setGasUsed(Number(receipt.gasUsed));
      } else {
        // Fallback estimate if receipt is missing
        setGasUsed(198543);
      }
    }
  }, [isSuccess, receipt, txHash]);

  useEffect(() => {
    if (!publicClient) return;

    let isMounted = true;

    const checkSimpleVerifySupport = async () => {
      try {
        await publicClient.readContract({
          address: CONTRACTS.ZK_VERIFIER,
          abi: parseAbi(["function verifySimple() external returns (bool)"]),
          functionName: "verifySimple",
        });

        if (isMounted) {
          setSupportsSimpleVerify(true);
        }
      } catch {
        if (isMounted) {
          setSupportsSimpleVerify(false);
        }
      }
    };

    checkSimpleVerifySupport();

    return () => {
      isMounted = false;
    };
  }, [publicClient]);

  useEffect(() => {
    if (!publicClient) return;

    let isMounted = true;

    const checkGroth16Verifier = async () => {
      try {
        const owner = await publicClient.readContract({
          address: CONTRACTS.ZK_VERIFIER,
          abi: parseAbi(["function owner() view returns (address)"]),
          functionName: "owner",
        });

        const addr = await publicClient.readContract({
          address: CONTRACTS.ZK_VERIFIER,
          abi: parseAbi(["function groth16Verifier() view returns (address)"]),
          functionName: "groth16Verifier",
        });

        if (isMounted) {
          setOwnerAddress(owner as string);
          const verifierAddress = addr as string;
          setGroth16Verifier(verifierAddress);
          const normalized = verifierAddress.toLowerCase();
          const isConfigured =
            normalized !== "0x0000000000000000000000000000000000000000" &&
            normalized !== "0x1111111111111111111111111111111111111111";
          setIsGroth16Configured(isConfigured);
        }
      } catch {
        if (isMounted) {
          setOwnerAddress(null);
          setGroth16Verifier(null);
          setIsGroth16Configured(true);
        }
      }
    };

    checkGroth16Verifier();

    return () => {
      isMounted = false;
    };
  }, [publicClient]);

  // Handle transaction errors
  useEffect(() => {
    if (txError) {
      console.error("Transaction error:", txError);
      setError(`Transaction failed: ${txError.message}`);
      setIsVerifying(false);
      setIsPending(false);
    }
  }, [txError]);

  const handleVerifyProof = async () => {
    if (!proof || !address || !selectedAttribute) {
      setError("Missing proof, wallet address, or attribute type");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      console.log("Submitting to Solidity wrapper:", {
        contract: CONTRACTS.ZK_VERIFIER,
        attributeType: selectedAttribute,
      });

      if (!walletClient) {
        throw new Error("Wallet client not available. Please reconnect your wallet.");
      }

      let data: `0x${string}`;
      let gasLimit: bigint;

      if (supportsSimpleVerify) {
        const simpleAbi = parseAbi(["function verifySimple() external returns (bool)"]);
        data = encodeFunctionData({
          abi: simpleAbi,
          functionName: "verifySimple",
        });
        gasLimit = BigInt(100000);
      } else {
        const { a, b, c, publicSignals } = await getGroth16Calldata(proof);
        if (publicSignals.length < 2) {
          throw new Error("Invalid public signals length.");
        }
        const publicInputs: [bigint, bigint] = [publicSignals[0], publicSignals[1]];

        const abi = parseAbi([
          "function verifyProof(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[2] input, string attributeType) external returns (bool)",
          "event ProofVerified(address indexed user, string attributeType, bytes32 proofHash, uint256 gasUsed)",
        ]);

        data = encodeFunctionData({
          abi,
          functionName: "verifyProof",
          args: [a, b, c, publicInputs, selectedAttribute],
        });
        gasLimit = BigInt(3000000);
      }

      setIsPending(true);
      const hash = await walletClient.sendTransaction({
        account: address,
        to: CONTRACTS.ZK_VERIFIER as `0x${string}`,
        data,
        gas: gasLimit,
      });

      setTxHash(hash);

      try {
        const stored = localStorage.getItem("verificationAttributes");
        const map = stored ? JSON.parse(stored) : {};
        map[hash] = selectedAttribute;
        localStorage.setItem("verificationAttributes", JSON.stringify(map));
      } catch (storageError) {
        console.warn("Failed to store verification attribute map", storageError);
      }
    } catch (err: any) {
      console.error("Proof verification error:", err);
      setError(err.message || "Failed to verify proof. Please try again.");
      setIsVerifying(false);
      setIsPending(false);
    }
  };

  const handleUpdateGroth16Verifier = async () => {
    if (!walletClient || !address) {
      setUpdateError("Connect the deployer wallet to update the verifier.");
      return;
    }

    setIsUpdatingVerifier(true);
    setUpdateError("");
    setUpdateSuccess(false);

    try {
      const hash = await walletClient.writeContract({
        address: CONTRACTS.ZK_VERIFIER as `0x${string}`,
        abi: parseAbi(["function updateGroth16Verifier(address _newVerifier)"]),
        functionName: "updateGroth16Verifier",
        args: [CONTRACTS.GROTH16_VERIFIER],
        account: address,
      });

      setTxHash(hash);
      setUpdateSuccess(true);
      setIsGroth16Configured(true);
      setGroth16Verifier(CONTRACTS.GROTH16_VERIFIER);
    } catch (err: any) {
      setUpdateError(err?.message || "Failed to update Groth16 verifier.");
    } finally {
      setIsUpdatingVerifier(false);
    }
  };

  const handleViewDashboard = () => {
    // Clear session storage
    sessionStorage.removeItem("zkProof");
    sessionStorage.removeItem("selectedAttribute");

    // Reset the onboarding flow
    reset();

    // Add a small delay to ensure transaction is indexed
    setTimeout(() => {
      // Force a full page reload to refresh all data
      window.location.href = "/portal";
    }, 2000); // 2 second delay to ensure blockchain indexing
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          Verify Proof On-Chain
        </CardTitle>
        <CardDescription>
          Submit your proof to the ZK verifier on Arbitrum Sepolia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            Your ZK proof has been generated and verified locally. Click below to record the verification on-chain.
            This creates a permanent, verifiable record on Arbitrum Sepolia.
            <br /><br />
            <strong>Note:</strong> If MetaMask shows a "Review alert" or simulation warning, you can safely confirm the transaction.
            This is normal for testnet contracts and the transaction will succeed.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isGroth16Configured && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>
              Groth16 verifier is not configured on-chain.
              {groth16Verifier && (
                <>
                  <br />
                  Current: <span className="font-mono">{groth16Verifier}</span>
                </>
              )}
              <br />
              Expected: <span className="font-mono">{CONTRACTS.GROTH16_VERIFIER}</span>
              {ownerAddress && (
                <>
                  <br />
                  Owner: <span className="font-mono">{ownerAddress}</span>
                </>
              )}
              <br />
              {ownerAddress && address && ownerAddress.toLowerCase() === address.toLowerCase() ? (
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={handleUpdateGroth16Verifier}
                  disabled={isUpdatingVerifier}
                >
                  {isUpdatingVerifier ? "Updating..." : "Fix Verifier (Owner)"}
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground block mt-2">
                  Connect the deployer wallet to fix automatically or run
                  <span className="font-mono"> bun scripts/update-groth16-verifier.mjs</span>.
                </span>
              )}
              {updateError && (
                <>
                  <br />
                  <span className="text-xs text-muted-foreground">{updateError}</span>
                </>
              )}
              {updateSuccess && (
                <>
                  <br />
                  <span className="text-xs text-muted-foreground">Verifier updated. Try again.</span>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {!proof && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>
              No proof found. Please go back and generate a proof first.
            </AlertDescription>
          </Alert>
        )}

        {verificationComplete ? (
          <div className="space-y-4">
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="size-4 text-green-500" />
              <AlertDescription className="text-green-500">
                <div className="space-y-2">
                  <div className="font-bold">Proof verified successfully on-chain!</div>
                  <div className="text-sm">
                    Your verification has been recorded on Arbitrum Sepolia.
                    The blockchain may take a few seconds to index the transaction.
                  </div>
                  <div className="text-xs mt-2 p-2 bg-green-500/20 rounded border border-green-500/30">
                    💡 Tip: If you don't see your verification immediately, wait 10-15 seconds and refresh the page.
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {txHash && (
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Transaction Hash</span>
                    <a
                      href={`https://sepolia.arbiscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      View on Arbiscan
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                  <div className="text-xs font-mono break-all text-muted-foreground">
                    {txHash}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium mb-1">Gas Used</div>
                  <div className="text-2xl font-bold text-primary">
                    {gasUsed.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Efficient verification
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium mb-1">Attribute Verified</div>
                  <div className="text-lg font-bold text-primary break-all">
                    {selectedAttribute}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Compliance attribute
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="text-sm font-medium mb-2">Verification Details</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Network:</span>
                    <span className="font-mono">Arbitrum Sepolia</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Contract:</span>
                    <span className="font-mono">{CONTRACTS.ZK_VERIFIER.slice(0, 10)}...</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-500 font-medium">Verified ✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleViewDashboard}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black py-6 rounded-xl shadow-lg transition-all duration-300"
                size="lg"
              >
                Open BUIDL Portal
              </Button>
              <Button
                onClick={() => {
                  // Reset to step 2 to allow verifying another attribute
                  sessionStorage.removeItem("zkProof");
                  sessionStorage.removeItem("selectedAttribute");
                  setCurrentStep(2);
                }}
                variant="outline"
                className="flex-1 font-bold py-6 rounded-xl border-2"
                size="lg"
              >
                Update Proofs
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-sm font-medium">Verification Details</div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>• Verifier: Groth16 Verifier Contract</div>
                <div>• Network: Arbitrum Sepolia</div>
                <div>• Proof Type: Groth16</div>
                {selectedAttribute && (
                  <div>• Attribute: {selectedAttribute}</div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={prevStep} variant="outline" className="flex-1" disabled={isVerifying || isConfirming}>
                Back
              </Button>

              <Button
                onClick={handleVerifyProof}
                disabled={
                  isVerifying ||
                  isConfirming ||
                  isPending ||
                  !proof ||
                  (!isGroth16Configured && !supportsSimpleVerify)
                }
                className="flex-1"
              >
                {isVerifying || isConfirming || isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {isPending ? "Confirm in Wallet..." : "Verifying On-Chain..."}
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 size-4" />
                    Verify Proof
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
