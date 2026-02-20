import { ErrorBoundary } from "@/components/error-boundary";
import { NetworkStats } from "./_components/network-stats";
import { GasComparison } from "./_components/gas-comparison";
import { TechStack } from "./_components/tech-stack";
import { VerificationChart } from "./_components/verification-chart";

export default function AnalyticsPage() {
  return (
    <ErrorBoundary>
      <div className="space-y-10">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-8 shadow-xl">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-semibold text-primary">Real-time Analytics</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Analytics & Performance
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Network-wide statistics, gas efficiency benchmarks, and technical proof of Arbitrum Stylus superiority.
              All data is fetched directly from the blockchain.
            </p>
          </div>
        </div>

        {/* Network Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Network Statistics</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              Live data
            </div>
          </div>
          <NetworkStats />
        </div>

        {/* Verification Chart */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Verification Activity</h2>
          <VerificationChart />
        </div>

        {/* Gas Comparison */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Gas Efficiency Analysis</h2>
          <GasComparison />
        </div>

        {/* Tech Stack */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Technology Stack</h2>
          <TechStack />
        </div>
      </div>
    </ErrorBoundary>
  );
}
