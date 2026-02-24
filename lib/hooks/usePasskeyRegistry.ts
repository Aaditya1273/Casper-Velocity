/**
 * Hook for interacting with PasskeyRegistry contract
 */

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { parseAbi, keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import { useState } from 'react';

const PASSKEY_REGISTRY_ABI = parseAbi([
  'function registerPasskey(bytes32 credentialId, bytes publicKey, string deviceName) external',
  'function revokePasskey(bytes32 credentialId) external',
  'function recordPasskeyUsage(bytes32 credentialId) external',
  'function getUserPasskeys(address user) external view returns (bytes32[] credentialIds, string[] deviceNames, uint256[] lastUsed)',
  'function hasActivePasskey(address user) external view returns (bool)',
  'function getPasskeyPublicKey(address user, bytes32 credentialId) external view returns (bytes)',
]);

export interface Passkey {
  credentialId: string; // The hex-encoded bytes32 hash
  deviceName: string;
  lastUsed: number;
  isActive: boolean;
}

export function useUserPasskeys() {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.PASSKEY_REGISTRY,
    abi: PASSKEY_REGISTRY_ABI,
    functionName: 'getUserPasskeys',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const passkeys: Passkey[] = [];

  if (data && Array.isArray(data) && data.length === 3) {
    const [ids, names, times] = data as [string[], string[], bigint[]];
    for (let i = 0; i < ids.length; i++) {
      passkeys.push({
        credentialId: ids[i],
        deviceName: names[i],
        lastUsed: Number(times[i]),
        isActive: true, // If it's returned by getUserPasskeys, it's active in the contract logic
      });
    }
  }

  return {
    passkeys,
    isLoading,
    refetch,
  };
}

export function useRegisterPasskey() {
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);

  const registerPasskey = async (
    credentialId: string,
    publicKey: string,
    deviceName: string
  ) => {
    setIsPending(true);
    try {
      // Hash the credentialId string to a bytes32
      const hashedId = keccak256(encodeAbiParameters(parseAbiParameters('string'), [credentialId])) as `0x${string}`;

      const hash = await writeContractAsync({
        address: CONTRACTS.PASSKEY_REGISTRY,
        abi: PASSKEY_REGISTRY_ABI,
        functionName: 'registerPasskey',
        args: [hashedId, publicKey as `0x${string}`, deviceName],
      });
      return hash;
    } finally {
      setIsPending(false);
    }
  };

  return {
    registerPasskey,
    isPending,
  };
}

export function useRevokePasskey() {
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);

  const revokePasskey = async (credentialId: string) => {
    setIsPending(true);
    try {
      // If the credentialId is already a hex hash (from getUserPasskeys), use it directly
      // Otherwise hash it
      const hashedId = credentialId.startsWith('0x') && credentialId.length === 66
        ? credentialId as `0x${string}`
        : keccak256(encodeAbiParameters(parseAbiParameters('string'), [credentialId])) as `0x${string}`;

      const hash = await writeContractAsync({
        address: CONTRACTS.PASSKEY_REGISTRY,
        abi: PASSKEY_REGISTRY_ABI,
        functionName: 'revokePasskey',
        args: [hashedId],
      });
      return hash;
    } finally {
      setIsPending(false);
    }
  };

  return {
    revokePasskey,
    isPending,
  };
}
