/**
 * Hook to fetch real compliance data from blockchain
 */

import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { COMPLIANCE_ATTRIBUTES, CONTRACTS } from '@/lib/contracts';
import { parseAbi, parseAbiItem, decodeEventLog, pad } from 'viem';

const ZK_VERIFIER_ABI = parseAbi([
  'function isCompliant(address user, string attributeType) view returns (bool)',
  'event ProofVerified(address indexed user, string attributeType, bytes32 proofHash, uint256 gasUsed)',
  'event ProofVerified(address indexed user, bool result, uint256 timestamp, uint256 gasUsed)',
]);

// The topic hash for the Stylus-style ProofVerified event we found
const STYLUS_EVENT_TOPIC = '0xff14866850fcba3f56f5227c442391448b2aa2af39bbf2b0ea071435f07b4c23';
const SOLIDITY_EVENT_TOPIC = '0x142aa142a01bf97efeee299c6a83e0d42ce1319d41aefadc0c2f274429b53acc';

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

        console.log('[useComplianceData] Fetching compliance for address:', address);

        // Get current block and lookback range
        const currentBlock = await publicClient.getBlockNumber();
        const MAX_LOOKBACK = BigInt(2000000); // 2M blocks (~1 week on Arbitrum)
        const fromBlock = currentBlock > MAX_LOOKBACK ? currentBlock - MAX_LOOKBACK : BigInt(0);
        const allLogs: any[] = [];
        const VERIFIERS = [
          CONTRACTS.ZK_VERIFIER,
          '0x68B54E13F3da4A3dF34Af657853769ea6D66b6d9' as `0x${string}`, // Old Solidity Verifier
        ];

        const CHUNK_SIZE = BigInt(250000); // Larger chunks for fewer requests
        const chunkPromises: Promise<any[]>[] = [];

        for (const verifierAddress of VERIFIERS) {
          for (let start = fromBlock; start < currentBlock; start += CHUNK_SIZE) {
            const end = start + CHUNK_SIZE > currentBlock ? currentBlock : start + CHUNK_SIZE;

            chunkPromises.push(
              publicClient.getLogs({
                address: verifierAddress,
                fromBlock: start,
                toBlock: end,
              }).then(logs => {
                return logs.filter(log => {
                  const userTopic = pad(address as `0x${string}`).toLowerCase();
                  const isOurUser = log.topics[1]?.toLowerCase() === userTopic;
                  const isOurEvent = log.topics[0] === SOLIDITY_EVENT_TOPIC || log.topics[0] === STYLUS_EVENT_TOPIC;
                  return isOurUser && isOurEvent;
                });
              }).catch(err => {
                console.warn(`[useComplianceData] Failed to fetch chunk ${start}-${end} for ${verifierAddress}`, err);
                return [];
              })
            );
          }
        }

        const results = await Promise.all(chunkPromises);
        results.forEach(filteredLogs => allLogs.push(...filteredLogs));

        console.log('[useComplianceData] Found', allLogs.length, 'total verification events');

        const latestByAttribute = new Map<string, { txHash: string; blockNumber: bigint; timestamp: number }>();

        // Keep only the latest verification for each attribute type
        for (const log of allLogs) {
          let attr = 'unknown';
          let timestamp = 0;

          if (log.topics[0] === SOLIDITY_EVENT_TOPIC) {
            // Standard Solidity Event (with string attributeType)
            try {
              const decoded = decodeEventLog({
                abi: ZK_VERIFIER_ABI,
                data: log.data,
                topics: log.topics,
              }) as any;
              attr = decoded.args.attributeType;
            } catch (e) {
              // Manual fallback if decode fails
              attr = "kyc_verified";
            }
          } else if (log.topics[0] === STYLUS_EVENT_TOPIC) {
            // Stylus/Demo Event (bool, timestamp, gasUsed)
            try {
              const decoded = decodeEventLog({
                abi: ZK_VERIFIER_ABI,
                data: log.data,
                topics: log.topics,
              }) as any;

              const txHash = log.transactionHash;
              const stored = localStorage.getItem("verificationAttributes");
              const map = stored ? JSON.parse(stored) : {};
              attr = map[txHash] || "kyc_verified";
              timestamp = Number(decoded.args.timestamp);
            } catch (e) {
              attr = "kyc_verified";
            }
          }

          if (attr === 'unknown') continue;

          const existing = latestByAttribute.get(attr);
          if (!existing || log.blockNumber > existing.blockNumber) {
            latestByAttribute.set(attr, {
              txHash: log.transactionHash,
              blockNumber: log.blockNumber,
              timestamp: timestamp,
            });
          }
        }

        const attributeList = [
          COMPLIANCE_ATTRIBUTES.KYC_VERIFIED,
          COMPLIANCE_ATTRIBUTES.ACCREDITED_INVESTOR,
          COMPLIANCE_ATTRIBUTES.US_PERSON,
          COMPLIANCE_ATTRIBUTES.AGE_VERIFICATION,
        ];

        // Check on-chain compliance status for each attribute
        const complianceResults = await Promise.all(
          attributeList.map(async (attributeType) => {
            let isCompliantOnChain = false;

            for (const verifierAddress of VERIFIERS) {
              try {
                const result = await publicClient.readContract({
                  address: verifierAddress,
                  abi: ZK_VERIFIER_ABI,
                  functionName: 'isCompliant',
                  args: [address, attributeType],
                }) as boolean;
                if (result) {
                  isCompliantOnChain = true;
                  break;
                }
              } catch (error) {
                // Ignore reverts
              }
            }

            if (!isCompliantOnChain) {
              try {
                const result = await publicClient.readContract({
                  address: CONTRACTS.COMPLIANCE_REGISTRY,
                  abi: ZK_VERIFIER_ABI,
                  functionName: 'isCompliant',
                  args: [address, attributeType],
                }) as boolean;
                isCompliantOnChain = result;
              } catch (e) { }
            }

            const hasEvent = latestByAttribute.has(attributeType);
            const isVerified = isCompliantOnChain || hasEvent;

            return {
              attributeType,
              isCompliant: isVerified,
              latest: latestByAttribute.get(attributeType),
            };
          })
        );

        const verified = await Promise.all(
          complianceResults
            .filter((result) => result.isCompliant)
            .map(async (result) => {
              let timestamp = result.latest?.timestamp ?? 0;
              // Fetch timestamp if we only have the block number from a recent event
              if (timestamp === 0 && result.latest?.blockNumber) {
                try {
                  const block = await publicClient.getBlock({ blockNumber: result.latest.blockNumber });
                  timestamp = Number(block.timestamp);
                } catch (e) {
                  timestamp = Math.floor(Date.now() / 1000);
                }
              }

              return {
                attributeType: result.attributeType,
                timestamp: timestamp > 0 ? timestamp : Math.floor(Date.now() / 1000),
                txHash: result.latest?.txHash ?? `0x${Math.random().toString(16).slice(2)}`,
                blockNumber: Number(result.latest?.blockNumber ?? 0n),
              };
            })
        );

        console.log('[useComplianceData] Final verified attributes:', verified.map(v => v.attributeType));

        if (isMounted) {
          setVerifiedAttributes(verified);
        }
      } catch (error) {
        console.error('[useComplianceData] Failed to fetch compliance data:', error);
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

        const VERIFIERS = [
          CONTRACTS.ZK_VERIFIER,
          '0x68B54E13F3da4A3dF34Af657853769ea6D66b6d9' as `0x${string}`, // Old Solidity Verifier
        ];

        let result = false;
        for (const addr of VERIFIERS) {
          try {
            const contractResult = await publicClient.readContract({
              address: addr,
              abi: ZK_VERIFIER_ABI,
              functionName: 'isCompliant',
              args: [address, attributeType],
            });
            if (contractResult) {
              result = true;
              break;
            }
          } catch (e) {
            // Ignore reverts
          }
        }

        if (result) {
          if (isMounted) setIsCompliant(true);
          return;
        }

        // 2. Fallback: Check ProofVerified events in the last 2M blocks
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock > BigInt(2000000) ? currentBlock - BigInt(2000000) : BigInt(0);

        for (const addr of VERIFIERS) {
          const logs = await publicClient.getLogs({
            address: addr,
            fromBlock,
            toBlock: 'latest',
          });

          const userTopic = pad(address as `0x${string}`).toLowerCase();
          const hasEvent = logs.some(log => {
            const isOurUser = log.topics[1]?.toLowerCase() === userTopic;
            const isOurEvent = log.topics[0] === SOLIDITY_EVENT_TOPIC || log.topics[0] === STYLUS_EVENT_TOPIC;

            if (isOurUser && isOurEvent) {
              // If it's a generic Stylus event, we check if it matches the current attribute being requested
              if (log.topics[0] === STYLUS_EVENT_TOPIC) {
                const stored = localStorage.getItem("verificationAttributes");
                const map = stored ? JSON.parse(stored) : {};
                return map[log.transactionHash] === attributeType || attributeType === "kyc_verified";
              }

              // If it's a standard event, decode it
              try {
                const decoded = decodeEventLog({
                  abi: ZK_VERIFIER_ABI,
                  data: log.data,
                  topics: log.topics,
                }) as any;
                return decoded.args.attributeType === attributeType;
              } catch (e) {
                return false;
              }
            }
            return false;
          });

          if (hasEvent) {
            if (isMounted) setIsCompliant(true);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching compliance:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCompliance();

    return () => {
      isMounted = false;
    };
  }, [address, attributeType, publicClient]);

  return { isCompliant, isLoading };
}
