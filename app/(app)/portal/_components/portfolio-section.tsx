"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, TrendingDown, Clock, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, ExternalLink } from "lucide-react";
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
    isLoadingTxs
  } = usePortfolioData();

  if (!address) {
    return (
      <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/30">
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
      <Card className="transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="size-5" />
            My Portfolio
          </CardTitle>
          <CardDescription>Your BUIDL token holdings and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Current Balance */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Wallet className="size-4" />
                Current Balance
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-3xl font-bold">${balance.toLocaleString()}</div>
              )}
              <div className="text-xs text-muted-foreground">BUIDL Tokens</div>
            </div>

            {/* Total Minted */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <ArrowDownToLine className="size-4 text-green-500" />
                Total Minted
              </div>
              {isLoadingTxs ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-3xl font-bold text-green-500">
                  ${totalMinted.toLocaleString()}
                </div>
              )}
              <div className="text-xs text-muted-foreground">Lifetime mints</div>
            </div>

            {/* Total Redeemed */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <ArrowUpFromLine className="size-4 text-red-500" />
                Total Redeemed
              </div>
              {isLoadingTxs ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-3xl font-bold text-red-500">
                  ${totalRedeemed.toLocaleString()}
                </div>
              )}
              <div className="text-xs text-muted-foreground">Lifetime redemptions</div>
            </div>
          </div>

          {/* Net Position */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-dashed">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Net Position</div>
                <div className="text-xl font-bold">
                  ${Math.abs(portfolioChange).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {portfolioChange >= 0 ? (
                  <>
                    <TrendingUp className="size-5 text-green-500" />
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      +{portfolioChange.toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <>
                    <TrendingDown className="size-5 text-red-500" />
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                      {portfolioChange.toLocaleString()}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5" />
                Transaction History
              </CardTitle>
              <CardDescription>Your recent BUIDL transactions</CardDescription>
            </div>
            <Badge variant="outline">
              {transactions.length} transactions
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTxs ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="size-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">No transactions yet</p>
              <p className="text-xs text-muted-foreground mt-2">
                Start minting or redeeming BUIDL tokens to see your transaction history
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-primary/50 group"
                >
                  <div className="flex items-center gap-4">
                    {/* Transaction Icon */}
                    <div className={`p-2 rounded-full transition-all duration-300 group-hover:scale-110 ${
                      tx.type === 'mint'
                        ? 'bg-green-500/10 text-green-500'
                        : tx.type === 'redeem'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {tx.type === 'mint' ? (
                        <ArrowDownToLine className="size-4" />
                      ) : tx.type === 'redeem' ? (
                        <ArrowUpFromLine className="size-4" />
                      ) : (
                        <ArrowLeftRight className="size-4" />
                      )}
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{tx.type}</span>
                        <Badge
                          variant="outline"
                          className={
                            tx.type === 'mint'
                              ? 'bg-green-500/10 text-green-500 border-green-500/20'
                              : tx.type === 'redeem'
                              ? 'bg-red-500/10 text-red-500 border-red-500/20'
                              : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }
                        >
                          ${Number(tx.amount).toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                    className="text-primary hover:underline flex items-center gap-1 transition-all duration-300 hover:gap-2"
                  >
                    <span className="text-xs">View</span>
                    <ExternalLink className="size-3" />
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
