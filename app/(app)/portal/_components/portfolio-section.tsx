"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, TrendingDown, Clock, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import { usePortfolioData } from "@/lib/hooks/usePortfolioData";
import { useAccount } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistance } from "date-fns";

export function PortfolioSection() {
  const { address } = useAccount();
  const {
    balance,
    portfolioValue,
    portfolioChange,
    totalMinted,
    totalRedeemed,
    transactions,
    isLoading,
    isLoadingTxs,
    refetchBalance,
  } = usePortfolioData();

  if (!address) {
    return (
      <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/30 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="size-5" />
            My Portfolio
          </CardTitle>
          <CardDescription>Connect wallet to view your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Please connect your wallet to view portfolio details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="glass-card transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)] hover:border-primary/60 bg-gradient-to-br from-card via-card/95 to-primary/5 border-2 relative overflow-hidden group">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Decorative corner glow */}
        <div className="absolute -top-24 -right-24 size-48 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors duration-700" />

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-3xl font-bold tracking-tight">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-xl border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                  <Wallet className="size-7 text-primary" />
                </div>
                My Portfolio
              </CardTitle>
              <CardDescription className="mt-2 text-base">Institutional-grade BUIDL token holdings</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchBalance()}
              disabled={isLoading}
              className="gap-2 bg-background/50 backdrop-blur-sm border-2 hover:scale-105 transition-all duration-300"
            >
              <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Current Balance */}
            <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 border-2 border-primary/10 hover:border-primary/40 transition-all duration-500 hover:scale-[1.02] group/card shadow-lg hover:shadow-primary/5">
              <div className="text-sm text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-wider">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Wallet className="size-4 text-blue-500" />
                </div>
                Current Balance
              </div>
              {isLoading ? (
                <Skeleton className="h-12 w-40" />
              ) : (
                <div className="text-5xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent group-hover/card:scale-105 transition-transform duration-500">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              )}
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-semibold">
                <Sparkles className="size-3.5 text-blue-500" />
                BUIDL Tokens (RWA)
              </div>
            </div>

            {/* Total Minted */}
            <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/10 hover:border-green-500/40 transition-all duration-500 hover:scale-[1.02] group/card shadow-lg hover:shadow-green-500/5">
              <div className="text-sm text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-wider">
                <div className="p-2 rounded-xl bg-green-500/20">
                  <ArrowDownToLine className="size-4 text-green-500" />
                </div>
                Total Minted
              </div>
              {isLoadingTxs ? (
                <Skeleton className="h-12 w-40" />
              ) : (
                <div className="text-5xl font-black text-green-500 group-hover/card:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  ${totalMinted.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </div>
              )}
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-semibold">
                <TrendingUp className="size-3.5" />
                Lifetime liquidity added
              </div>
            </div>

            {/* Total Redeemed */}
            <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border-2 border-red-500/10 hover:border-red-500/40 transition-all duration-500 hover:scale-[1.02] group/card shadow-lg hover:shadow-red-500/5">
              <div className="text-sm text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-wider">
                <div className="p-2 rounded-xl bg-red-500/20">
                  <ArrowUpFromLine className="size-4 text-red-500" />
                </div>
                Total Redeemed
              </div>
              {isLoadingTxs ? (
                <Skeleton className="h-12 w-40" />
              ) : (
                <div className="text-5xl font-black text-red-500 group-hover/card:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  ${totalRedeemed.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </div>
              )}
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-semibold">
                <TrendingDown className="size-3.5" />
                Lifetime redemptions
              </div>
            </div>
          </div>

          {/* Net Position */}
          <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl shadow-inner relative overflow-hidden group/net">
            <div className="absolute inset-0 bg-grid-white/5 opacity-20" />
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <Sparkles className="size-4 text-primary animate-pulse" />
                  Net Portfolio Performance
                </div>
                <div className="text-4xl font-extrabold tracking-tight">
                  ${Math.abs(portfolioChange).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {portfolioChange >= 0 ? (
                  <>
                    <div className="p-4 rounded-2xl bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500/30 group-hover/net:scale-110 transition-transform duration-500">
                      <TrendingUp className="size-8 text-green-500" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30 px-6 py-3 text-xl font-black rounded-xl">
                      +${portfolioChange.toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)] border border-red-500/30 group-hover/net:scale-110 transition-transform duration-500">
                      <TrendingDown className="size-8 text-red-500" />
                    </div>
                    <Badge className="bg-red-500/20 text-red-600 border-red-500/30 px-6 py-3 text-xl font-black rounded-xl">
                      -${Math.abs(portfolioChange).toLocaleString()}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="transition-all duration-300 hover:shadow-xl hover:border-primary/40 border-2 relative overflow-hidden group">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                  <Clock className="size-5 text-primary" />
                </div>
                Transaction History
              </CardTitle>
              <CardDescription className="mt-2">Your recent BUIDL transactions on-chain</CardDescription>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-sm font-bold border-2">
              {transactions.length} transactions
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          {isLoadingTxs ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto">
                <Clock className="size-16 text-muted-foreground" />
              </div>
              <div>
                <p className="text-base font-semibold text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start minting or redeeming BUIDL tokens to see your transaction history
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-primary/60 group/tx bg-gradient-to-r from-background to-background/50"
                >
                  <div className="flex items-center gap-4">
                    {/* Transaction Icon */}
                    <div className={`p-3 rounded-xl transition-all duration-300 group-hover/tx:scale-110 shadow-lg ${tx.type === 'mint'
                        ? 'bg-green-500/20 text-green-500'
                        : tx.type === 'redeem'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                      {tx.type === 'mint' ? (
                        <ArrowDownToLine className="size-5" />
                      ) : tx.type === 'redeem' ? (
                        <ArrowUpFromLine className="size-5" />
                      ) : (
                        <ArrowLeftRight className="size-5" />
                      )}
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold capitalize text-base">{tx.type}</span>
                        <Badge
                          variant="outline"
                          className={`px-3 py-1 font-bold ${tx.type === 'mint'
                              ? 'bg-green-500/20 text-green-500 border-green-500/30'
                              : tx.type === 'redeem'
                                ? 'bg-red-500/20 text-red-500 border-red-500/30'
                                : 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                            }`}
                        >
                          ${Number(tx.amount).toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Clock className="size-3" />
                        {formatDistance(new Date(tx.timestamp * 1000), new Date(), { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Link */}
                  <a
                    href={`https://sepolia.arbiscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-2 transition-all duration-300 hover:gap-3 font-semibold"
                  >
                    <span className="text-sm">View</span>
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
