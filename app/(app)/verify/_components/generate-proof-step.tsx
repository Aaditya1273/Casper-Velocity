"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield, Info, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { COMPLIANCE_ATTRIBUTES } from "@/lib/contracts";
import {
  generateZKProof,
  verifyZKProofLocally,
  getCircuitInfo,
  estimateVerificationGas,
  type ZKProof,
} from "@/lib/zkproof";

const ATTRIBUTE_CONFIGS = {
  [COMPLIANCE_ATTRIBUTES.CREDIT_SCORE]: {
    label: "Credit Score Threshold",
    description: "Prove credit score ≥ threshold without revealing exact score",
    privateLabel: "Credit Score (private)",
    publicLabel: "Threshold (public)",
    privateHelp: undefined,
    publicHelp: undefined,
    defaults: { creditScore: "750", threshold: "700" },
  },
  [COMPLIANCE_ATTRIBUTES.ACCREDITED_INVESTOR]: {
    label: "Accredited Investor Status",
    description: "Prove accredited investor status with a public requirement",
    privateLabel: "Accreditation Status (private)",
    publicLabel: "Required (public)",
    privateHelp: "Use 1 for true, 0 for false",
    publicHelp: "Use 1 to require accredited status",
    defaults: { creditScore: "1", threshold: "1" },
  },
  [COMPLIANCE_ATTRIBUTES.KYC_VERIFIED]: {
    label: "KYC Verified Status",
    description: "Prove KYC status with a public requirement",
    privateLabel: "KYC Status (private)",
    publicLabel: "Required (public)",
    privateHelp: "Use 1 for true, 0 for false",
    publicHelp: "Use 1 to require KYC",
    defaults: { creditScore: "1", threshold: "1" },
  },
  [COMPLIANCE_ATTRIBUTES.US_PERSON]: {
    label: "US Person Status",
    description: "Prove US person status with a public requirement",
    privateLabel: "US Person Status (private)",
    publicLabel: "Required (public)",
    privateHelp: "Use 1 for true, 0 for false",
    publicHelp: "Use 1 to require US person",
    defaults: { creditScore: "1", threshold: "1" },
  },
  [COMPLIANCE_ATTRIBUTES.AGE_VERIFICATION]: {
    label: "Age Verification",
    description: "Prove age ≥ minimum without revealing the exact age",
    privateLabel: "Age (private)",
    publicLabel: "Minimum Age (public)",
    privateHelp: undefined,
    publicHelp: undefined,
    defaults: { creditScore: "21", threshold: "18" },
  },
} as const;

const attributeOptions = Object.entries(ATTRIBUTE_CONFIGS).map(([value, config]) => ({
  value,
  label: config.label,
  description: config.description,
  enabled: true,
}));

export function GenerateProofStep() {
  const { nextStep, prevStep } = useOnboardingStore();
  const [selectedAttribute, setSelectedAttribute] = useState<string>(COMPLIANCE_ATTRIBUTES.CREDIT_SCORE);
  const [creditScore, setCreditScore] = useState<string>(ATTRIBUTE_CONFIGS[COMPLIANCE_ATTRIBUTES.CREDIT_SCORE].defaults.creditScore);
  const [threshold, setThreshold] = useState<string>(ATTRIBUTE_CONFIGS[COMPLIANCE_ATTRIBUTES.CREDIT_SCORE].defaults.threshold);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [proof, setProof] = useState<ZKProof | null>(null);
  const [error, setError] = useState<string>("");
  const [estimatedGas, setEstimatedGas] = useState<number>(0);

  const handleGenerateProof = async () => {
    setIsGenerating(true);
    setError("");
    
    try {
      const creditScoreValue = Number(creditScore);
      const thresholdValue = Number(threshold);

      if (!Number.isFinite(creditScoreValue) || !Number.isFinite(thresholdValue)) {
        throw new Error("Please enter valid numeric values.");
      }

      if (creditScoreValue < 0 || thresholdValue < 0) {
        throw new Error("Values must be positive.");
      }

      // Generate ZK proof using snarkjs (generic threshold circuit)
      const generatedProof = await generateZKProof({
        attributeType: selectedAttribute,
        creditScore: creditScoreValue,
        threshold: thresholdValue,
      });

      // Verify proof locally before proceeding
      const isValid = await verifyZKProofLocally(generatedProof);
      
      if (!isValid) {
        throw new Error("Local proof verification failed");
      }

      // Estimate gas for on-chain verification
      const gas = estimateVerificationGas(generatedProof);
      setEstimatedGas(gas);

      setProof(generatedProof);
      setProofGenerated(true);

      // Store proof in session storage for next step
      sessionStorage.setItem("zkProof", JSON.stringify(generatedProof));
      sessionStorage.setItem("selectedAttribute", selectedAttribute);
      sessionStorage.setItem("creditScore", creditScoreValue.toString());
      sessionStorage.setItem("threshold", thresholdValue.toString());
    } catch (err: any) {
      console.error("Proof generation error:", err);
      setError(err.message || "Failed to generate proof. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="size-5 text-primary" />
          Generate ZK Proof
        </CardTitle>
        <CardDescription>
          Select an attribute to prove and generate a zero-knowledge proof
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            Zero-knowledge proofs allow you to prove compliance without revealing sensitive data.
            The proof is generated locally using snarkjs and only the verification happens on-chain.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Label>Select Compliance Attribute</Label>
          <RadioGroup 
            value={selectedAttribute} 
            onValueChange={(value) => {
              setSelectedAttribute(value);
              const defaults = ATTRIBUTE_CONFIGS[value as keyof typeof ATTRIBUTE_CONFIGS]?.defaults;
              if (defaults) {
                setCreditScore(defaults.creditScore);
                setThreshold(defaults.threshold);
              }
            }}
            disabled={proofGenerated}
          >
            {attributeOptions.map((option) => {
              const circuitInfo = getCircuitInfo(option.value);
              return (
                <div key={option.value} className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value={option.value} id={option.value} disabled={!option.enabled} />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor={option.value} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Circuit: {circuitInfo.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="creditScore">
              {ATTRIBUTE_CONFIGS[selectedAttribute as keyof typeof ATTRIBUTE_CONFIGS]?.privateLabel}
            </Label>
            <Input
              id="creditScore"
              type="number"
              min="0"
              step="1"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              disabled={proofGenerated}
            />
            {ATTRIBUTE_CONFIGS[selectedAttribute as keyof typeof ATTRIBUTE_CONFIGS]?.privateHelp && (
              <p className="text-xs text-muted-foreground">
                {ATTRIBUTE_CONFIGS[selectedAttribute as keyof typeof ATTRIBUTE_CONFIGS]?.privateHelp}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="threshold">
              {ATTRIBUTE_CONFIGS[selectedAttribute as keyof typeof ATTRIBUTE_CONFIGS]?.publicLabel}
            </Label>
            <Input
              id="threshold"
              type="number"
              min="0"
              step="1"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              disabled={proofGenerated}
            />
            {ATTRIBUTE_CONFIGS[selectedAttribute as keyof typeof ATTRIBUTE_CONFIGS]?.publicHelp && (
              <p className="text-xs text-muted-foreground">
                {ATTRIBUTE_CONFIGS[selectedAttribute as keyof typeof ATTRIBUTE_CONFIGS]?.publicHelp}
              </p>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {proofGenerated && proof && (
          <div className="space-y-2">
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="size-4 text-green-500" />
              <AlertDescription className="text-green-500">
                Proof generated and verified locally!
              </AlertDescription>
            </Alert>
            
            <div className="rounded-lg border p-4 space-y-3">
              <div className="text-sm font-medium">Generated Proof (Groth16)</div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">pi_a:</div>
                  <div className="text-xs font-mono text-muted-foreground break-all bg-muted/50 p-2 rounded">
                    [{proof.proof.pi_a.slice(0, 2).join(", ")}]
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Public Signals:</div>
                  <div className="text-xs font-mono text-muted-foreground break-all bg-muted/50 p-2 rounded">
                    [{proof.publicSignals.join(", ")}]
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                <div>
                  <span className="text-muted-foreground">Protocol:</span>{" "}
                  <span className="font-mono">{proof.proof.protocol}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Curve:</span>{" "}
                  <span className="font-mono">{proof.proof.curve}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Attribute:</span>{" "}
                  <span className="font-mono">{selectedAttribute}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Gas:</span>{" "}
                  <span className="font-mono text-green-500">~{estimatedGas.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={prevStep} variant="outline" className="flex-1">
            Back
          </Button>
          
          {!proofGenerated ? (
            <Button
              onClick={handleGenerateProof}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Generating Proof...
                </>
              ) : (
                "Generate Proof"
              )}
            </Button>
          ) : (
            <Button onClick={nextStep} className="flex-1">
              Continue to Verification
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
