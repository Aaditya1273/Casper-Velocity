"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Wallet, Shield, CheckCircle2, Copy, ExternalLink, Sparkles, RefreshCw } from "lucide-react";
import { useAccount } from "wagmi";
import { useComplianceData } from "@/lib/hooks/useComplianceData";
import { useVerificationHistory } from "@/lib/hooks/useVerificationHistory";
import { toast } from "sonner";
import { useState } from "react";

export function UserProfile() {
  const { address, isConnected } = useAccount();
  const { verifiedAttributes, loading: isLoadingCompliance } = useComplianceData();
  const { events, loading: isLoadingHistory } = useVerificationHistory();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !address) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            User Profile
          </CardTitle>
          <CardDescription>
            Connect your wallet to view your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Please connect your wallet
          </div>
        </CardContent>
      </Card>
    );
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const totalVerifications = events.length;
  const uniqueAttributes = new Set(verifiedAttributes.map(attr => attr.attributeType)).size;

  return (
    <Card className="border-2 hover:shadow-xl hover:border-primary/50 transition-all duration-300 relative overflow-hidden group">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
            <User className="size-6 text-primary" />
          </div>
          User Profile
        </CardTitle>
        <CardDescription className="mt-2">
          Your identity and compliance status on ArbShield
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative group/avatar">
            <Avatar className="size-24 border-4 border-primary/20 shadow-xl transition-all duration-300 group-hover/avatar:scale-110 group-hover/avatar:border-primary/40">
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/20 to-primary/10">
                {address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-green-500 border-2 border-background shadow-lg">
              <CheckCircle2 className="size-4 text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-5">
            {/* Wallet Address */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-background/80 to-background/40 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-blue-500/10">
                  <Wallet className="size-4 text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground font-semibold">Wallet Address</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-3 py-2 rounded-lg font-mono flex-1">{address}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="gap-2"
                >
                  {copied ? <CheckCircle2 className="size-4 text-green-500" /> : <Copy className="size-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://sepolia.arbiscan.io/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Compliance Status */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="size-4 text-green-500" />
                  <span className="text-xs text-muted-foreground font-semibold">Status</span>
                </div>
                {isLoadingCompliance ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : verifiedAttributes.length > 0 ? (
                  <>
                    <div className="text-2xl font-bold text-green-500">{uniqueAttributes}</div>
                    <div className="text-xs text-muted-foreground mt-1">Verified</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-muted-foreground">0</div>
                    <div className="text-xs text-muted-foreground mt-1">Not verified</div>
                  </>
                )}
              </div>

              {/* Total Verifications */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="size-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground font-semibold">Proofs</span>
                </div>
                {isLoadingHistory ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-blue-500">{totalVerifications}</div>
                    <div className="text-xs text-muted-foreground mt-1">Submitted</div>
                  </>
                )}
              </div>

              {/* Account Age */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="size-4 text-purple-500" />
                  <span className="text-xs text-muted-foreground font-semibold">Active</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">✓</div>
                <div className="text-xs text-muted-foreground mt-1">Connected</div>
              </div>
            </div>

            {/* Verified Attributes Badges */}
            {verifiedAttributes.length > 0 && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-background/80 to-background/40 border-2 border-primary/20">
                <div className="text-sm text-muted-foreground mb-3 font-semibold flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  Verified Attributes
                </div>
                <div className="flex flex-wrap gap-2">
                  {verifiedAttributes.map((attr) => (
                    <Badge
                      key={attr.attributeType}
                      variant="outline"
                      className="bg-green-500/20 text-green-500 border-green-500/30 px-3 py-1 font-semibold hover:scale-105 transition-transform"
                    >
                      <CheckCircle2 className="size-3 mr-1" />
                      {attr.attributeType.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
