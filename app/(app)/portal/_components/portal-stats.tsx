"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Percent, Users } from "lucide-react";
import { useReadContract, useAccount } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { formatUnits } from "viem";

const MOCK_BUIDL_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function PortalStats() {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: CONTRACTS.MOCK_BUIDL,
    abi: MOCK_BUIDL_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACTS.MOCK_BUIDL,
    abi: MOCK_BUIDL_ABI,
    functionName: 'totalSupply',
  });

  const userBalance = balance ? Number(formatUnits(balance as bigint, 6)) : 0;
  const supply = totalSupply ? Number(formatUnits(totalSupply as bigint, 6)) : 0;

  const stats = [
    {
      title: "Your BUIDL Balance",
      value: `$${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "Tokenized US Treasuries",
      icon: DollarSign,
      color: "text-green-500",
      bgGradient: "from-green-500/10",
    },
    {
      title: "Current APY",
      value: "5.24%",
      change: "Institutional yield",
      icon: TrendingUp,
      color: "text-blue-500",
      bgGradient: "from-blue-500/10",
    },
    {
      title: "Total Supply",
      value: `$${supply.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: "BUIDL tokens",
      icon: Percent,
      color: "text-purple-500",
      bgGradient: "from-purple-500/10",
    },
    {
      title: "Your Position",
      value: supply > 0 ? `${((userBalance / supply) * 100).toFixed(4)}%` : "0%",
      change: "Of total supply",
      icon: Users,
      color: "text-orange-500",
      bgGradient: "from-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-primary/60 group relative overflow-hidden border-2"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Animated gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2.5 rounded-xl ${stat.color.replace('text-', 'bg-')}/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
              <stat.icon className={`size-5 ${stat.color} transition-all duration-300`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold transition-all duration-300 group-hover:scale-105 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2 font-medium">
              <span className={`size-2 rounded-full ${stat.color.replace('text-', 'bg-')} animate-pulse shadow-lg`} />
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
