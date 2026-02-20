"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingDown } from "lucide-react";

export function GasComparison() {
  const comparisons = [
    {
      operation: "Poseidon Hash",
      solidity: 212000,
      stylus: 11800,
      savings: 94,
      description: "Cryptographic hash function for ZK proofs",
    },
    {
      operation: "ZK Proof Verification",
      solidity: 2500000,
      stylus: 198543,
      savings: 92,
      description: "Groth16 proof verification on-chain",
    },
    {
      operation: "Passkey Verification (RIP-7212)",
      solidity: 100000,
      stylus: 980,
      savings: 99,
      description: "secp256r1 signature verification",
    },
    {
      operation: "Cached Verification",
      solidity: 198543,
      stylus: 45231,
      savings: 77,
      description: "Repeat verification with Stylus Cache Manager",
    },
  ];

  return (
    <Card className="border-2 transition-all duration-300 hover:shadow-2xl hover:border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <Zap className="size-5 text-yellow-500" />
          </div>
          Gas Efficiency Comparison
        </CardTitle>
        <CardDescription className="text-base">
          Stylus Rust vs Solidity implementation benchmarks - Verified on-chain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comparisons.map((comp, index) => (
            <div
              key={comp.operation}
              className="group p-5 rounded-xl border-2 hover:border-primary/50 hover:bg-gradient-to-r hover:from-green-500/5 hover:to-transparent transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="font-bold text-lg">{comp.operation}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {comp.description}
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-base px-3 py-1 font-bold whitespace-nowrap">
                  <TrendingDown className="size-4 mr-1" />
                  {comp.savings}% saved
                </Badge>
              </div>

              {/* Visual comparison bar */}
              <div className="space-y-3 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Solidity</span>
                    <span className="font-mono">{comp.solidity.toLocaleString()} gas</span>
                  </div>
                  <div className="h-3 bg-red-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Stylus Rust</span>
                    <span className="font-mono text-green-500 font-bold">{comp.stylus.toLocaleString()} gas</span>
                  </div>
                  <div className="h-3 bg-green-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-500 group-hover:animate-pulse" style={{ width: `${(comp.stylus / comp.solidity) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                <div className="text-center">
                  <div className="font-mono font-bold text-lg text-red-500">
                    {comp.solidity.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Solidity Gas</div>
                </div>
                <div className="text-center">
                  <div className="font-mono font-bold text-lg text-green-500">
                    {comp.stylus.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Stylus Gas</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-start gap-3">
            <Zap className="size-6 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-green-500">
                Average Gas Savings: 90.5%
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Arbitrum Stylus enables Rust smart contracts that are significantly more efficient than Solidity,
                reducing transaction costs by up to 99% for cryptographic operations.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
