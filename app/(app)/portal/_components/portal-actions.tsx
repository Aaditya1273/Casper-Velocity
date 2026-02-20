"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, ArrowUpFromLine, Coins, ExternalLink } from "lucide-react";
import { useIsCompliant } from "@/lib/hooks/useComplianceData";
import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { parseUnits } from "viem";
import { toast } from "sonner";

const MOCK_BUIDL_ABI = [
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export function PortalActions() {
  const { address } = useAccount();
  const { isCompliant: hasKYC } = useIsCompliant("kyc_verified");
  const { isCompliant: isAccredited } = useIsCompliant("accredited_investor");
  const [mintAmount, setMintAmount] = useState("");
  const [redeemAmount, setRedeemAmount] = useState("");

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const canAccess = hasKYC && isAccredited;

  const handleMint = async () => {
    if (!mintAmount || Number(mintAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!canAccess) {
      toast.error("You must complete KYC and Accredited Investor verification before minting");
      return;
    }

    try {
      writeContract({
        address: CONTRACTS.MOCK_BUIDL,
        abi: MOCK_BUIDL_ABI,
        functionName: 'mint',
        args: [parseUnits(mintAmount, 6)],
      });
      toast.success("Minting BUIDL tokens...");
      setMintAmount("");
    } catch (error: any) {
      console.error("Mint failed:", error);
      const errorMessage = error?.message || error?.toString() || "Unknown error";

      if (errorMessage.includes("User not compliant") || errorMessage.includes("not compliant")) {
        toast.error("You must be verified as an Accredited Investor to mint tokens. Please complete verification first.");
      } else if (errorMessage.includes("rejected") || errorMessage.includes("denied")) {
        toast.error("Transaction was rejected");
      } else {
        toast.error("Failed to mint tokens. Please try again.");
      }
    }
  };

  const handleRedeem = async () => {
    if (!redeemAmount || Number(redeemAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!canAccess) {
      toast.error("You must complete KYC and Accredited Investor verification before redeeming");
      return;
    }

    try {
      writeContract({
        address: CONTRACTS.MOCK_BUIDL,
        abi: MOCK_BUIDL_ABI,
        functionName: 'burn',
        args: [parseUnits(redeemAmount, 6)],
      });
      toast.success("Redeeming BUIDL tokens...");
      setRedeemAmount("");
    } catch (error: any) {
      console.error("Redeem failed:", error);
      const errorMessage = error?.message || error?.toString() || "Unknown error";

      if (errorMessage.includes("insufficient") || errorMessage.includes("balance")) {
        toast.error("Insufficient BUIDL token balance");
      } else if (errorMessage.includes("rejected") || errorMessage.includes("denied")) {
        toast.error("Transaction was rejected");
      } else {
        toast.error("Failed to redeem tokens. Please try again.");
      }
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Mint BUIDL */}
      <Card className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-500/50 group relative overflow-hidden">
        {/* Animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-500/10 transition-all duration-300 group-hover:scale-110">
              <ArrowDownToLine className="size-5 text-green-500 transition-all duration-300 group-hover:translate-y-1" />
            </div>
            Mint BUIDL
          </CardTitle>
          <CardDescription>
            Purchase tokenized US Treasury tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="mint-amount" className="text-sm font-medium">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="mint-amount"
                type="number"
                placeholder="1000"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                disabled={!canAccess}
                className="pl-7 transition-all duration-300 focus:scale-[1.01] focus:border-green-500/50"
              />
            </div>
          </div>
          <Button
            className="w-full transition-all duration-300 hover:scale-105 bg-green-500 hover:bg-green-600"
            onClick={handleMint}
            disabled={!canAccess || isPending || isConfirming}
          >
            {isPending || isConfirming ? (
              <div className="flex items-center gap-2">
                <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <Coins className="size-4 mr-2" />
                Mint BUIDL
              </>
            )}
          </Button>
          {!canAccess && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-500 text-center">
                Complete verification requirements to mint
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Redeem BUIDL */}
      <Card className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-red-500/50 group relative overflow-hidden">
        {/* Animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10 transition-all duration-300 group-hover:scale-110">
              <ArrowUpFromLine className="size-5 text-red-500 transition-all duration-300 group-hover:-translate-y-1" />
            </div>
            Redeem BUIDL
          </CardTitle>
          <CardDescription>
            Redeem tokens for USD (T+1 settlement)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="redeem-amount" className="text-sm font-medium">Amount (BUIDL)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="redeem-amount"
                type="number"
                placeholder="1000"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                disabled={!canAccess}
                className="pl-7 transition-all duration-300 focus:scale-[1.01] focus:border-red-500/50"
              />
            </div>
          </div>
          <Button
            className="w-full transition-all duration-300 hover:scale-105 border-red-500/50 text-red-500 hover:bg-red-500/10"
            variant="outline"
            onClick={handleRedeem}
            disabled={!canAccess || isPending || isConfirming}
          >
            {isPending || isConfirming ? (
              <div className="flex items-center gap-2">
                <div className="size-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <ArrowUpFromLine className="size-4 mr-2" />
                Redeem BUIDL
              </>
            )}
          </Button>
          {!canAccess && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-500 text-center">
                Complete verification requirements to redeem
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="md:col-span-2 transition-all duration-300 hover:shadow-xl hover:border-primary/50 relative overflow-hidden group">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Coins className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle>About BUIDL</CardTitle>
              <CardDescription>
                BlackRock USD Institutional Digital Liquidity Fund
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <p className="text-sm text-muted-foreground leading-relaxed">
            BUIDL is a tokenized money market fund that provides qualified investors with access to US Treasury yields on-chain.
            This is a demo implementation on Arbitrum Sepolia testnet.
          </p>
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/50 border border-dashed">
            <a
              href={`https://sepolia.arbiscan.io/address/${CONTRACTS.MOCK_BUIDL}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1 transition-all duration-300 hover:gap-2 font-medium"
            >
              View Contract
              <ExternalLink className="size-3" />
            </a>
            <span className="text-sm text-muted-foreground">•</span>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Network: Arbitrum Sepolia
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
