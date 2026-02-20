"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Shield, ArrowRight } from "lucide-react";
import { useIsCompliant } from "@/lib/hooks/useComplianceData";
import { useAccount } from "wagmi";
import Link from "next/link";

export function PortalAccess() {
  const { address } = useAccount();
  const { isCompliant: hasKYC } = useIsCompliant("kyc_verified");
  const { isCompliant: isAccredited } = useIsCompliant("accredited_investor");

  const requirements = [
    {
      name: "KYC Verification",
      required: true,
      met: hasKYC,
      attributeType: "kyc_verified",
    },
    {
      name: "Accredited Investor",
      required: true,
      met: isAccredited,
      attributeType: "accredited_investor",
    },
  ];

  const allRequirementsMet = requirements.every((req) => req.met);

  return (
    <Card className="transition-all duration-300 hover:shadow-xl hover:border-primary/50 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        allRequirementsMet
          ? 'bg-gradient-to-br from-green-500/5 via-transparent to-transparent'
          : 'bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent'
      }`} />

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                allRequirementsMet ? 'bg-green-500/10' : 'bg-yellow-500/10'
              }`}>
                <Shield className={`size-5 ${
                  allRequirementsMet ? 'text-green-500' : 'text-yellow-500'
                }`} />
              </div>
              Portal Access Requirements
            </CardTitle>
            <CardDescription className="mt-2">
              Verify compliance attributes to access institutional RWA products
            </CardDescription>
          </div>
          {allRequirementsMet ? (
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 transition-all duration-300 hover:scale-110 animate-pulse">
              <CheckCircle2 className="size-3 mr-1" />
              Access Granted
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 transition-all duration-300 hover:scale-110">
              Verification Required
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-3">
          {requirements.map((req, index) => (
            <div
              key={req.name}
              className="flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-primary/50 group"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full transition-all duration-300 group-hover:scale-110 ${
                  req.met ? 'bg-green-500/10' : 'bg-muted'
                }`}>
                  {req.met ? (
                    <CheckCircle2 className="size-5 text-green-500" />
                  ) : (
                    <XCircle className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {req.name}
                    {req.required && (
                      <span className="text-xs text-red-500">*</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <span className={`size-1.5 rounded-full ${req.required ? 'bg-red-500' : 'bg-blue-500'}`} />
                    {req.required ? "Required" : "Optional"}
                  </div>
                </div>
              </div>
              {req.met ? (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 transition-all duration-300 hover:scale-105">
                  <CheckCircle2 className="size-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Link href="/verify">
                  <Button size="sm" variant="outline" className="transition-all duration-300 hover:scale-105 hover:border-primary">
                    Verify Now
                    <ArrowRight className="size-4 ml-2 transition-all duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
            </div>
          ))}

          {!allRequirementsMet && (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-3">
                <Shield className="size-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-500">
                    Action Required
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Complete all required verifications to access the BUIDL Portal and interact with institutional RWA products.
                  </p>
                </div>
              </div>
            </div>
          )}

          {allRequirementsMet && (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-500">
                    All Requirements Met
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You have full access to the BUIDL Portal. You can now mint, redeem, and transfer BUIDL tokens.
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
