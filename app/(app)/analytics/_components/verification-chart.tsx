"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        const fromBlock = currentBlock > BigInt(1000) ? currentBlock - BigInt(1000) : BigInt(0);

        // Fetch all ProofVerified events
        const logs = await publicClient.getLogs({
          address: CONTRACTS.ZK_VERIFIER,
          event: parseAbiItem('event ProofVerified(address indexed user, string attributeType, bytes32 proofHash, uint256 gasUsed)'),
          fromBlock,
          toBlock: 'latest',
        });

        // Get timestamps for each event
        const eventsWithTime = await Promise.all(
          logs.map(async (log) => {
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
    <Card className="border-2 transition-all duration-300 hover:shadow-2xl hover:border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <TrendingUp className="size-5 text-blue-500" />
          </div>
          Verification Activity
        </CardTitle>
        <CardDescription className="text-base">
          Daily verification count over the past week - Real blockchain data from Arbitrum Sepolia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Enhanced bar chart */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border">
            <div className="flex items-end justify-between gap-3 h-64">
              {data.map((item, index) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-blue-500 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-purple-500 relative group-hover:shadow-lg"
                      style={{
                        height: `${maxValue > 0 ? (item.verifications / maxValue) * 100 : 0}%`,
                        minHeight: item.verifications > 0 ? '8px' : '0',
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Value tooltip on hover */}
                      {item.verifications > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                          {item.verifications}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{item.day}</div>
                  <div className="text-xs font-bold text-primary">{item.verifications}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-2 hover:border-primary/50 transition-all hover:shadow-lg text-center bg-gradient-to-br from-blue-500/5 to-transparent">
              <div className="text-3xl font-bold text-blue-500">{totalThisWeek}</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">Total This Week</div>
            </div>
            <div className="p-4 rounded-xl border-2 hover:border-primary/50 transition-all hover:shadow-lg text-center bg-gradient-to-br from-green-500/5 to-transparent">
              <div className="text-3xl font-bold text-green-500">{dailyAverage}</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">Daily Average</div>
            </div>
            <div className="p-4 rounded-xl border-2 border-primary/30 hover:border-primary/50 transition-all hover:shadow-lg text-center bg-gradient-to-br from-primary/5 to-transparent">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Live</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium flex items-center justify-center gap-1">
                <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                From Blockchain
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
