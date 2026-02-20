/**
 * ZK Proof Generation using snarkjs
 * Client-side proof generation for compliance attributes
 */

// @ts-ignore - snarkjs types
import * as snarkjs from 'snarkjs';

export interface ZKProof {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
    curve: string;
  };
  publicSignals: string[];
}

export interface ProofInput {
  attributeType: string;
  creditScore: number;
  threshold: number;
}

export interface Groth16Calldata {
  a: [bigint, bigint];
  b: [[bigint, bigint], [bigint, bigint]];
  c: [bigint, bigint];
  publicSignals: bigint[];
}

const CIRCUIT_BASE = "/zk/credit_score";
const WASM_URL = `${CIRCUIT_BASE}/credit_score.wasm`;
const ZKEY_URL = `${CIRCUIT_BASE}/credit_score.zkey`;
const VK_URL = `${CIRCUIT_BASE}/verification_key.json`;

/**
 * Generate ZK proof for compliance attribute
 * This uses a real Groth16 circuit (credit_score)
 */
export async function generateZKProof(
  input: ProofInput
): Promise<ZKProof> {
  try {
    console.log('Generating ZK proof for:', input.attributeType);

    const wasm = await fetchBinary(WASM_URL);
    const zkey = await fetchBinary(ZKEY_URL);

    const circuitInput = {
      creditScore: input.creditScore,
      threshold: input.threshold,
    };

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      circuitInput,
      wasm,
      zkey
    );

    console.log('ZK proof generated successfully');
    return { proof, publicSignals };
  } catch (error) {
    console.error('ZK proof generation failed:', error);
    throw new Error('Failed to generate ZK proof');
  }
}

/**
 * Verify ZK proof locally before submitting to chain
 */
export async function verifyZKProofLocally(
  proof: ZKProof
): Promise<boolean> {
  try {
    console.log('Verifying ZK proof locally...');

    const vkey = await fetchJson(VK_URL);
    const isValid = await snarkjs.groth16.verify(
      vkey,
      proof.publicSignals,
      proof.proof
    );

    console.log('Local verification result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Local verification failed:', error);
    return false;
  }
}

export async function getGroth16Calldata(
  proof: ZKProof
): Promise<Groth16Calldata> {
  const calldata = await snarkjs.groth16.exportSolidityCallData(
    proof.proof,
    proof.publicSignals
  );

  const parsed = JSON.parse(`[${calldata}]`) as [
    [string, string],
    [[string, string], [string, string]],
    [string, string],
    string[]
  ];

  return {
    a: [toBigInt(parsed[0][0]), toBigInt(parsed[0][1])],
    b: [
      [toBigInt(parsed[1][0][0]), toBigInt(parsed[1][0][1])],
      [toBigInt(parsed[1][1][0]), toBigInt(parsed[1][1][1])],
    ],
    c: [toBigInt(parsed[2][0]), toBigInt(parsed[2][1])],
    publicSignals: parsed[3].map((v) => toBigInt(v)),
  };
}

/**
 * Estimate gas for proof verification
 */
export function estimateVerificationGas(proof: ZKProof): number {
  // Solidity Groth16 verifier: ~2.3M gas (varies by circuit)
  const baseGas = 2300000;
  const signalGas = proof.publicSignals.length * 15000;
  return baseGas + signalGas;
}

/**
 * Get circuit info for attribute type
 */
export function getCircuitInfo(attributeType: string): {
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
} {
  const circuits: Record<string, any> = {
    credit_score: {
      name: 'Credit Score Threshold Proof',
      description: 'Proves credit score is above a public threshold without revealing the score',
      inputs: ['creditScore', 'threshold'],
      outputs: ['isAbove (internal)'],
    },
    accredited_investor: {
      name: 'Accredited Investor Status Proof',
      description: 'Proves accredited investor status meets a public requirement (0/1)',
      inputs: ['status', 'required'],
      outputs: ['isAbove (internal)'],
    },
    kyc_verified: {
      name: 'KYC Verification Status Proof',
      description: 'Proves KYC status meets a public requirement (0/1)',
      inputs: ['status', 'required'],
      outputs: ['isAbove (internal)'],
    },
    us_person: {
      name: 'US Person Status Proof',
      description: 'Proves US person status meets a public requirement (0/1)',
      inputs: ['status', 'required'],
      outputs: ['isAbove (internal)'],
    },
    age_verification: {
      name: 'Age Threshold Proof',
      description: 'Proves age is above a public minimum without revealing the exact age',
      inputs: ['age', 'minAge'],
      outputs: ['isAbove (internal)'],
    },
  };

  return (
    circuits[attributeType] || {
      name: 'Unknown Circuit',
      description: 'Circuit not found',
      inputs: [],
      outputs: [],
    }
  );
}

/**
 * Helper: Hash input for deterministic proof generation
 */
async function fetchBinary(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load artifact: ${url}`);
  }
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load artifact: ${url}`);
  }
  return res.json();
}

function toBigInt(value: string): bigint {
  return BigInt(value);
}

/**
 * Production implementation guide:
 * 
 * 1. Create circuits using circom:
 *    ```circom
 *    template CreditScoreProof() {
 *      signal input creditScore;
 *      signal input threshold;
 *      signal input userSecret;
 *      signal output isAboveThreshold;
 *      signal output commitmentHash;
 *      
 *      isAboveThreshold <== creditScore >= threshold;
 *      commitmentHash <== Poseidon([creditScore, userSecret]);
 *    }
 *    ```
 * 
 * 2. Compile circuits:
 *    ```bash
 *    circom circuit.circom --r1cs --wasm --sym
 *    ```
 * 
 * 3. Generate proving/verification keys:
 *    ```bash
 *    snarkjs groth16 setup circuit.r1cs pot12_final.ptau circuit_0000.zkey
 *    snarkjs zkey export verificationkey circuit_0000.zkey verification_key.json
 *    ```
 * 
 * 4. Use in production:
 *    ```typescript
 *    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
 *      input,
 *      'circuit.wasm',
 *      'circuit_0000.zkey'
 *    );
 *    ```
 */
