import { ErrorBoundary } from "@/components/error-boundary";
import { PortalAccess } from "./_components/portal-access";
import { PortalStats } from "./_components/portal-stats";
import { PortalActions } from "./_components/portal-actions";
import { PortfolioSection } from "./_components/portfolio-section";

export default function PortalPage() {
  return (
    <ErrorBoundary>
      <div className="space-y-10">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-8 shadow-xl">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-primary">Live on Arbitrum Sepolia</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              BUIDL Portal
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Access institutional-grade tokenized US Treasuries with zero-knowledge verified compliance.
              Built on Arbitrum Stylus for maximum efficiency.
            </p>
          </div>
        </div>

        {/* Access Check */}
        <PortalAccess />

        {/* Portal Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Market Overview</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              Real-time data
            </div>
          </div>
          <PortalStats />
        </div>

        {/* Portfolio Section */}
        <PortfolioSection />

        {/* Portal Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
          <PortalActions />
        </div>
      </div>
    </ErrorBoundary>
  );
}
