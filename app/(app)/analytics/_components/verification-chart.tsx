"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACTS } from "@/lib/contracts";
import { parseAbiItem } from "viem";

interface DayData {
  day: string;
  verifications: number;
}

export function VerificationChart() {
  const publicClient = usePublicClient();
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerificationData = async () => {
      if (!publicClient) return;

      try {
        // Get current block and lookback range
        const currentBlock = await publicClient.getBlockNumber();
        const MAX_LOOKBACK = BigInt(2000000); // 2M blocks
        const fromBlock = currentBlock > MAX_LOOKBACK ? currentBlock - MAX_LOOKBACK : BigInt(0);

        const VERIFIERS = [
          CONTRACTS.ZK_VERIFIER,
          '0x68B54E13F3da4A3dF34Af657853769ea6D66b6d9' as `0x${string}`, // Old Solidity Verifier
        ];

        const SOLIDITY_TOPIC = '0x142aa142a01bf97efeee299c6a83e0d42ce1319d41aefadc0c2f274429b53acc';
        const STYLUS_TOPIC = '0xff14866850fcba3f56f5227c442391448b2aa2af39bbf2b0ea071435f07b4c23';

        const allLogs: any[] = [];
        for (const verifierAddress of VERIFIERS) {
          try {
            const logs = await publicClient.getLogs({
              address: verifierAddress,
              fromBlock,
              toBlock: 'latest',
            });
            const filtered = logs.filter(l => l.topics[0] === SOLIDITY_TOPIC || l.topics[0] === STYLUS_TOPIC);
            allLogs.push(...filtered);
          } catch (err) {
            console.warn(`Failed to fetch chart data from ${verifierAddress}`, err);
          }
        }

        // Get timestamps for each event
        const eventsWithTime = await Promise.all(
          allLogs.map(async (log) => {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            return Number(block.timestamp);
          })
        );

        // Group by day of week
        const now = Date.now() / 1000;
        const sevenDaysAgo = now - 7 * 24 * 60 * 60;
        const recentEvents = eventsWithTime.filter((t) => t > sevenDaysAgo);

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayCount: Record<string, number> = {};

        recentEvents.forEach((timestamp) => {
          const date = new Date(timestamp * 1000);
          const dayName = dayNames[date.getDay()];
          dayCount[dayName] = (dayCount[dayName] || 0) + 1;
        });

        // Create data for last 7 days
        const chartData: DayData[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          const dayName = dayNames[date.getDay()];
          chartData.push({
            day: dayName,
            verifications: dayCount[dayName] || 0,
          });
        }

        setData(chartData);
      } catch (error) {
        console.error('Failed to fetch verification data:', error);
        // Fallback to empty data
        setData([
          { day: "Mon", verifications: 0 },
          { day: "Tue", verifications: 0 },
          { day: "Wed", verifications: 0 },
          { day: "Thu", verifications: 0 },
          { day: "Fri", verifications: 0 },
          { day: "Sat", verifications: 0 },
          { day: "Sun", verifications: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationData();
  }, [publicClient]);

  const maxValue = Math.max(...data.map((d) => d.verifications), 1);
  const totalThisWeek = data.reduce((sum, d) => sum + d.verifications, 0);
  const dailyAverage = totalThisWeek > 0 ? Math.round(totalThisWeek / 7) : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            Verification Activity
          </CardTitle>
          <CardDescription>
            Daily verification count over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-2 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(var(--primary),0.2)] hover:border-primary/60 overflow-hidden group">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-3 text-2xl font-black italic tracking-tight">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <TrendingUp className="size-6 text-blue-500" />
              </div>
              Verification Activity
            </CardTitle>
            <CardDescription className="text-sm font-semibold text-muted-foreground/80">
              Daily verification count over the past week - Real blockchain data
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 font-bold">
            Live Epoch
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Enhanced bar chart */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-muted/20 via-muted/5 to-muted/20 border-2 border-primary/5 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 opacity-10" />
            <div className="flex items-end justify-between gap-4 h-64 relative z-10">
              {data.map((item, index) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-4 group/bar">
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl transition-all duration-700 hover:from-blue-400 hover:to-cyan-400 relative hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover/bar:scale-x-110"
                      style={{
                        height: `${maxValue > 0 ? (item.verifications / maxValue) * 100 : 0}%`,
                        minHeight: item.verifications > 0 ? '12px' : '4px',
                        animation: `slideUp 1s ease-out ${index * 0.1}s both`
                      }}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-t-xl" />

                      {/* Value tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 bg-foreground text-background px-3 py-1.5 rounded-xl text-xs font-black shadow-2xl scale-50 group-hover/bar:scale-100">
                        {item.verifications}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-muted-foreground group-hover/bar:text-foreground transition-colors uppercase tracking-widest">{item.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Summary Info */}
          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border-2 border-primary/5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl text-center bg-gradient-to-br from-blue-500/10 via-transparent to-transparent group/stat hover:-translate-y-1">
              <div className="text-4xl font-black text-blue-500 group-hover/stat:scale-110 transition-transform duration-500">{totalThisWeek}</div>
              <div className="text-xs font-black text-muted-foreground mt-2 uppercase tracking-[0.2em]">Weekly Total</div>
            </div>
            <div className="p-6 rounded-3xl border-2 border-primary/5 hover:border-green-500/30 transition-all duration-500 hover:shadow-2xl text-center bg-gradient-to-br from-green-500/10 via-transparent to-transparent group/stat hover:-translate-y-1">
              <div className="text-4xl font-black text-green-500 group-hover/stat:scale-110 transition-transform duration-500">{dailyAverage}</div>
              <div className="text-xs font-black text-muted-foreground mt-2 uppercase tracking-[0.2em]">Daily Average</div>
            </div>
            <div className="p-6 rounded-3xl border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl text-center bg-gradient-to-br from-primary/10 via-transparent to-primary/5 group/stat hover:-translate-y-1">
              <div className="text-4xl font-black bg-gradient-to-r from-primary via-blue-600 to-blue-400 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform duration-500 tracking-tighter">LIVE</div>
              <div className="text-xs font-black text-muted-foreground mt-2 flex items-center justify-center gap-2 uppercase tracking-[0.2em]">
                <span className="size-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                Network Map
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes slideUp {
          from { height: 0; opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Card>
  );
}
