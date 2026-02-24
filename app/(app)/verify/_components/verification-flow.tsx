"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { PasskeyAuthStep } from "./passkey-auth-step";
import { GenerateProofStep } from "./generate-proof-step";
import { VerifyProofStep } from "./verify-proof-step";
import { useComplianceData } from "@/lib/hooks/useComplianceData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function VerificationFlow() {
  const { currentStep, setCurrentStep, reset } = useOnboardingStore();
  const { verifiedAttributes, loading } = useComplianceData();

  // Basic requirements for the portal
  const hasKYC = verifiedAttributes.some(a => a.attributeType === "kyc_verified");
  const isAccredited = verifiedAttributes.some(a => a.attributeType === "accredited_investor");
  const isFullyVerified = hasKYC && isAccredited;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  // If user is already fully verified, show a "Already Verified" screen instead of forcing the flow
  if (isFullyVerified && currentStep === 1) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="border-2 border-green-500/30 bg-green-500/5 overflow-hidden relative group">
          <div className="absolute inset-0 bg-grid-white/5 opacity-10" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto p-4 rounded-3xl bg-green-500/20 w-fit mb-4 shadow-xl border border-green-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Shield className="size-12 text-green-500" />
            </div>
            <CardTitle className="text-4xl font-black italic tracking-tight text-green-600">FULLY VERIFIED</CardTitle>
            <CardDescription className="text-base font-semibold text-green-700/70">
              Your institutional identity is active and compliant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 text-center px-10 pb-10">
            <div className="p-6 rounded-[2rem] bg-background/50 backdrop-blur-sm border-2 border-green-500/10 space-y-4">
              <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                You have already completed all necessary verifications (KYC & Accredited Investor).
                There is no need to perform these steps again.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  KYC VERIFIED
                </div>
                <div className="px-4 py-2 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  ACCREDITED INVESTOR
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  reset();
                  window.location.href = "/portal";
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black py-8 rounded-2xl shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 gap-3"
              >
                Open BUIDL Portal
                <ArrowRight className="size-6" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Move to step 2 (Generate Proof) to allow re-verification
                  setCurrentStep(2);
                }}
                className="font-bold rounded-2xl px-10 h-auto border-2 opacity-50 hover:opacity-100"
              >
                Update Proofs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {currentStep === 1 && <PasskeyAuthStep />}
      {currentStep === 2 && <GenerateProofStep />}
      {currentStep === 3 && <VerifyProofStep />}
    </div>
  );
}
