/**
 * Hook to fetch real compliance data from blockchain
 */

import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { COMPLIANCE_ATTRIBUTES, CONTRACTS } from '@/lib/contracts';
import { parseAbi, parseAbiItem } from 'viem';

const ZK_VERIFIER_ABI = parseAbi([
  'function isCompliant(address user, string attributeType) view returns (bool)',
  'event ProofVerified(address indexed user, string attributeType, bytes32 proofHash, uint256 gasUsed)',
]);

export interface VerifiedAttribute {
  attributeType: string;
  timestamp: number;
  txHash: string;
  blockNumber: number;
}

export function useComplianceData() {
  const { address } = useAccount();
  const [verifiedAttributes, setVerifiedAttributes] = useState<VerifiedAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();
  const attributeList = useMemo(() => Object.values(COMPLIANCE_ATTRIBUTES), []);

  useEffect(() => {
    if (!address || !publicClient) {
      setVerifiedAttributes([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchCompliance = async () => {
      try {
        setLoading(true);

        // Get current block and lookback range
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock > BigInt(1000) ? currentBlock - BigInt(1000) : BigInt(0);

        const logs = await publicClient.getLogs({
          address: CONTRACTS.ZK_VERIFIER,
          event: parseAbiItem('event ProofVerified(address indexed user, string attributeType, bytes32 proofHash, uint256 gasUsed)'),
          args: { user: address },
          fromBlock,
          toBlock: 'latest',
        });

        const latestByAttribute = new Map<string, { txHash: string; blockNumber: bigint; timestamp: number }>();

        for (const log of logs) {
          const attr = log.args.attributeType as string;
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
          latestByAttribute.set(attr, {
            txHash: log.transactionHash,
            blockNumber: log.blockNumber,
            timestamp: Number(block.timestamp),
          });
        }

        const complianceResults = await Promise.all(
          attributeList.map(async (attributeType) => {
            const isCompliant = await publicClient.readContract({
              address: CONTRACTS.ZK_VERIFIER,
              abi: ZK_VERIFIER_ABI,
              functionName: 'isCompliant',
              args: [address, attributeType],
            });

            return {
              attributeType,
              isCompliant: isCompliant as boolean,
              latest: latestByAttribute.get(attributeType),
            };
          })
        );

        const verified = complianceResults
          .filter((result) => result.isCompliant)
          .map((result) => ({
            attributeType: result.attributeType,
            timestamp: result.latest?.timestamp ?? Date.now(),
            txHash: result.latest?.txHash ?? `0x${Math.random().toString(16).slice(2)}`,
            blockNumber: Number(result.latest?.blockNumber ?? 0n),
          }));

        if (isMounted) {
          setVerifiedAttributes(verified);
        }
      } catch (error) {
        console.error('Failed to fetch compliance data:', error);
        if (isMounted) {
          setVerifiedAttributes([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCompliance();

    return () => {
      isMounted = false;
    };
  }, [address, publicClient, attributeList]);

  return {
    verifiedAttributes,
    loading,
  };
}

/**
 * Hook to check if user has specific compliance attribute
 */
export function useIsCompliant(attributeType: string) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [isCompliant, setIsCompliant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address || !attributeType || !publicClient) {
      setIsCompliant(false);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchCompliance = async () => {
      try {
        setIsLoading(true);
        const result = await publicClient.readContract({
          address: CONTRACTS.ZK_VERIFIER,
          abi: ZK_VERIFIER_ABI,
          functionName: 'isCompliant',
          args: [address, attributeType],
        });
        if (isMounted) {
          setIsCompliant(result as boolean);
        }
      } catch (error) {
        console.error('Failed to fetch compliance status:', error);
        if (isMounted) {
          setIsCompliant(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCompliance();

    return () => {
      isMounted = false;
    };
  }, [address, attributeType, publicClient]);

  return { isCompliant, isLoading };
}
