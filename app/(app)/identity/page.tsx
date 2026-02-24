import { ErrorBoundary } from "@/components/error-boundary";
import { PasskeyManager } from "./_components/passkey-manager";
import { UserProfile } from "./_components/user-profile";
import { OnboardingGuide } from "./_components/onboarding-guide";

export default function IdentityPage() {
  return (
    <ErrorBoundary>
      <div className="space-y-10 relative">
        {/* Background Decorative Element */}
        <div className="absolute -top-20 right-0 size-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-1/2 -left-20 size-96 bg-blue-500/5 blur-[120px] rounded-full -z-10" />

        <div className="space-y-4">
          <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Identity & Authentication
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Secure your account with world-class biometric authentication (RIP-7212) and manage your institution-grade compliance profile.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Profile & Info */}
          <div className="lg:col-span-12 space-y-10">
            <UserProfile />
            <div className="grid gap-10 md:grid-cols-2">
              <PasskeyManager />
              <OnboardingGuide />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
