"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Shield, ArrowRight, RefreshCw } from "lucide-react";
import { useIsCompliant } from "@/lib/hooks/useComplianceData";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useState } from "react";

export function PortalAccess() {
  const { address } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);
  const { isCompliant: hasKYC, isLoading: loadingKYC } = useIsCompliant("kyc_verified");
  const { isCompliant: isAccredited, isLoading: loadingAccredited } = useIsCompliant("accredited_investor");

  const isLoading = loadingKYC || loadingAccredited;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Force page reload to refresh all data
    window.location.reload();
  };

  const requirements = [
    {
      name: "KYC Verification",
      required: true,
      met: hasKYC,
      attributeType: "kyc_verified",
      loading: loadingKYC,
    },
    {
      name: "Accredited Investor",
      required: true,
      met: isAccredited,
      attributeType: "accredited_investor",
      loading: loadingAccredited,
    },
  ];

  const allRequirementsMet = requirements.every((req) => req.met);

  return (
    <Card className="transition-all duration-300 hover:shadow-xl hover:border-primary/50 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${allRequirementsMet
          ? 'bg-gradient-to-br from-green-500/5 via-transparent to-transparent'
          : 'bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent'
        }`} />

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-lg transition-all duration-300 ${allRequirementsMet ? 'bg-green-500/10' : 'bg-yellow-500/10'
                }`}>
                <Shield className={`size-5 ${allRequirementsMet ? 'text-green-500' : 'text-yellow-500'
                  }`} />
              </div>
              Portal Access Requirements
            </CardTitle>
            <CardDescription className="mt-2">
              Verify compliance attributes to access institutional RWA products
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {allRequirementsMet ? (
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 transition-all duration-300 hover:scale-110 animate-pulse">
                <CheckCircle2 className="size-3 mr-1" />
                Access Granted
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 transition-all duration-300 hover:scale-110">
                {isLoading ? 'Checking...' : 'Verification Required'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 px-8 pb-8">
        <div className="space-y-6">
          {requirements.map((req, index) => (
            <div
              key={req.name}
              className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group/item ${req.loading ? 'bg-blue-500/5 border-blue-500/10' :
                  req.met ? 'bg-green-500/5 border-green-500/20 shadow-[0_8px_32px_rgba(34,197,94,0.05)]' :
                    'bg-red-500/5 border-red-500/20 shadow-[0_8px_32px_rgba(239,68,68,0.05)]'
                }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl transition-all duration-500 group-hover/item:scale-110 group-hover/item:rotate-6 shadow-xl border border-white/5 ${req.loading ? 'bg-blue-500/20 text-blue-500' :
                    req.met ? 'bg-green-500/20 text-green-500' :
                      'bg-red-500/20 text-red-500'
                  }`}>
                  {req.loading ? (
                    <RefreshCw className="size-6 text-blue-500 animate-spin" />
                  ) : req.met ? (
                    <CheckCircle2 className="size-6 text-green-500" />
                  ) : (
                    <XCircle className="size-6 text-red-500" />
                  )}
                </div>
                <div>
                  <div className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
                    {req.name}
                    {req.required && (
                      <Badge variant="destructive" className="bg-red-500 text-[10px] px-1.5 py-0 h-4 font-black">MANDATORY</Badge>
                    )}
                  </div>
                  <div className={`text-xs font-bold mt-1 flex items-center gap-2 ${req.loading ? "text-blue-500/80" :
                      req.met ? "text-green-500/80" :
                        "text-red-500/80"
                    }`}>
                    <span className={`size-1.5 rounded-full ${req.loading ? 'bg-blue-500 animate-pulse' :
                        req.met ? 'bg-green-500' :
                          'bg-red-500'
                      }`} />
                    {req.loading ? "Checking blockchain..." : req.met ? "Verification active" : "Verification missing"}
                  </div>
                </div>
              </div>

              {req.loading ? (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-1.5 font-black rounded-xl">
                  PENDING
                </Badge>
              ) : req.met ? (
                <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30 px-4 py-1.5 font-black rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  VERIFIED
                </Badge>
              ) : (
                <Link href="/verify">
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-5 rounded-xl shadow-xl hover:shadow-red-500/30 hover:scale-105 transition-all duration-300 gap-2 overflow-hidden relative group/btn">
                    <span className="relative z-10 flex items-center gap-2">
                      Verify Now
                      <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  </Button>
                </Link>
              )}
            </div>
          ))}

          {!allRequirementsMet && !isLoading && (
            <div className="mt-8 p-8 rounded-[2rem] bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border-2 border-yellow-500/20 shadow-2xl relative overflow-hidden group/warning">
              <div className="absolute inset-0 bg-grid-white/5 opacity-10" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="p-3 rounded-2xl bg-yellow-500/20 border border-yellow-500/30">
                  <Shield className="size-6 text-yellow-500" />
                </div>
                <div className="space-y-3">
                  <div className="font-black text-yellow-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    Access Restricted
                  </div>
                  <p className="text-sm font-semibold text-yellow-700/80 leading-relaxed">
                    Institutional verification is required to interact with BUIDL products. Complete all mandatory steps to unlock full portal capabilities.
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-yellow-500/5 rounded-2xl border border-yellow-500/10">
                    <span className="text-xs text-yellow-600/80 font-bold italic">
                      💡 Verified just now? The blockchain can take 10-15 seconds to index. Refresh the status if needed.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {allRequirementsMet && (
            <div className="mt-8 p-8 rounded-[2rem] bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border-2 border-green-500/20 shadow-2xl relative overflow-hidden group/success animate-in fade-in zoom-in duration-500">
              <div className="absolute inset-0 bg-grid-white/5 opacity-10" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 rounded-2xl bg-green-500/20 shadow-xl border border-green-500/30 group-hover/success:scale-110 group-hover/success:rotate-6 transition-all duration-500">
                  <CheckCircle2 className="size-8 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-black text-green-600 italic tracking-tight uppercase">Access Granted</div>
                  <p className="text-sm font-bold text-green-700/80 tracking-wide mt-1">
                    Your institutional identity is fully verified. You now have unlimited access to BUIDL minting and redemption.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
