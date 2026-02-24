"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { useAccount } from "wagmi";
import { useComplianceData } from "@/lib/hooks/useComplianceData";
import { hasPasskey } from "@/lib/webauthn";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function OnboardingGuide() {
  const router = useRouter();
  const { address } = useAccount();
  const { verifiedAttributes } = useComplianceData();
  const [passkeyRegistered, setPasskeyRegistered] = useState(false);

  useEffect(() => {
    if (address) {
      setPasskeyRegistered(hasPasskey(address));
    }
  }, [address]);

  const steps = [
    {
      title: "Connect Wallet",
      description: "Connect your wallet to Arbitrum Sepolia",
      completed: !!address,
      action: null,
    },
    {
      title: "Register Passkey",
      description: "Set up biometric authentication",
      completed: passkeyRegistered,
      action: null, // Handled in PasskeyManager above
    },
    {
      title: "Verify Compliance",
      description: "Complete your first ZK proof verification",
      completed: verifiedAttributes.length > 0,
      action: () => router.push("/verify"),
    },
    {
      title: "Access BUIDL Portal",
      description: "Start interacting with institutional RWAs",
      completed: verifiedAttributes.length >= 2,
      action: () => router.push("/portal"),
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <Card className="border-2 hover:shadow-xl hover:border-primary/50 transition-all duration-300 relative overflow-hidden group">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl">Getting Started with ArbShield</CardTitle>
        <CardDescription className="text-base">
          Complete these steps to unlock full functionality and access institutional RWAs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {/* Progress Bar */}
        <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-background/80 to-background/40 border-2 border-primary/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-semibold">Your Progress</span>
            <span className="font-bold text-primary">
              {completedSteps} / {steps.length} completed
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-primary/20">
            <div
              className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-700 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground text-center font-medium">
            {progress === 100 ? "🎉 All steps completed!" : `${Math.round(progress)}% complete`}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] ${
                step.completed
                  ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50 hover:shadow-lg'
                  : 'bg-gradient-to-br from-background/80 to-background/40 border-primary/20 hover:border-primary/40 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${
                  step.completed
                    ? 'bg-green-500/20'
                    : 'bg-primary/10'
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="size-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="size-6 text-primary flex-shrink-0" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-base">{step.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              {!step.completed && step.action && (
                <Button size="sm" onClick={step.action} className="gap-2 hover:scale-105 transition-transform">
                  Start
                  <ArrowRight className="size-4" />
                </Button>
              )}
              {step.completed && (
                <div className="text-green-500 font-semibold text-sm">✓ Done</div>
              )}
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {completedSteps === steps.length && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 border-2 border-green-500/30 shadow-xl">
            <div className="flex items-center gap-3 text-green-500 font-bold mb-2 text-lg">
              <CheckCircle2 className="size-6" />
              All Set! 🎉
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You've completed onboarding and can now access all ArbShield features including institutional-grade tokenized US Treasuries.
            </p>
            <Button onClick={() => router.push("/portal")} className="mt-4 w-full" size="lg">
              Go to BUIDL Portal
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
