/**
 * Hook to fetch verification history from blockchain events
 */

import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { CONTRACTS } from '@/lib/contracts';
import { parseAbiItem } from 'viem';

export interface VerificationEvent {
  user: string;
  attributeType: string;
  proofHash: string;
  gasUsed: bigint;
  timestamp: number;
  txHash: string;
  blockNumber: bigint;
}

export function useVerificationHistory() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || !publicClient) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Get current block and lookback range
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock > BigInt(1000) ? currentBlock - BigInt(1000) : BigInt(0);

        // Fetch ProofVerified events from ZKVerifier contract
        const logs = await publicClient.getLogs({
          address: CONTRACTS.ZK_VERIFIER,
          event: parseAbiItem('event ProofVerified(address indexed user, string attributeType, bytes32 proofHash, uint256 gasUsed)'),
          args: {
            user: address,
          },
          fromBlock,
          toBlock: 'latest',
        });

        // Get block timestamps for each event
        const eventsWithTimestamps = await Promise.all(
          logs.map(async (log) => {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            let attributeType = log.args.attributeType as string;

            if (attributeType === "" || attributeType === "unknown") {
              try {
                const stored = localStorage.getItem("verificationAttributes");
                const map = stored ? JSON.parse(stored) : {};
                const mapped = map[log.transactionHash as string];
                if (typeof mapped === "string" && mapped.length > 0) {
                  attributeType = mapped;
                }
              } catch (storageError) {
                console.warn("Failed to read verification attribute map", storageError);
              }
            }

            return {
              user: log.args.user as string,
              attributeType,
              proofHash: log.args.proofHash as string,
              gasUsed: log.args.gasUsed as bigint,
              timestamp: Number(block.timestamp),
              txHash: log.transactionHash,
              blockNumber: log.blockNumber,
            };
          })
        );

        // Sort by timestamp (newest first)
        eventsWithTimestamps.sort((a, b) => b.timestamp - a.timestamp);

        setEvents(eventsWithTimestamps);
      } catch (error) {
        console.error('Failed to fetch verification history:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [address, publicClient]);

  return {
    events,
    loading,
  };
}
