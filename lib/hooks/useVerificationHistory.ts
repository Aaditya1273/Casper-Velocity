/**
 * Hook to fetch verification history from blockchain events
 */

import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { CONTRACTS } from '@/lib/contracts';
import { decodeEventLog, parseAbi, parseAbiItem, pad } from 'viem';

const ZK_VERIFIER_ABI = parseAbi([
  'event ProofVerified(address indexed user, string attributeType, bytes32 proofHash, uint256 gasUsed)',
  'event ProofVerified(address indexed user, bool result, uint256 timestamp, uint256 gasUsed)',
]);

const STYLUS_EVENT_TOPIC = '0xff14866850fcba3f56f5227c442391448b2aa2af39bbf2b0ea071435f07b4c23';
const SOLIDITY_EVENT_TOPIC = '0x142aa142a01bf97efeee299c6a83e0d42ce1319d41aefadc0c2f274429b53acc';

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
        const fromBlock = currentBlock > BigInt(1000000) ? currentBlock - BigInt(1000000) : BigInt(0);

        const VERIFIERS = [
          CONTRACTS.ZK_VERIFIER,
          '0x68B54E13F3da4A3dF34Af657853769ea6D66b6d9' as `0x${string}`, // Old Solidity Verifier
        ];

        const allLogs: any[] = [];
        const logPromises = VERIFIERS.map(verifierAddress =>
          publicClient.getLogs({
            address: verifierAddress,
            fromBlock,
            toBlock: 'latest',
          }).then(logs => {
            const userTopic = pad(address as `0x${string}`).toLowerCase();
            return logs.filter(log =>
              log.topics[1]?.toLowerCase() === userTopic &&
              (log.topics[0] === SOLIDITY_EVENT_TOPIC || log.topics[0] === STYLUS_EVENT_TOPIC)
            );
          }).catch(err => {
            console.warn(`Failed to fetch history from ${verifierAddress}`, err);
            return [];
          })
        );

        const results = await Promise.all(logPromises);
        results.forEach(filteredLogs => allLogs.push(...filteredLogs));

        // Get block timestamps for each event
        const eventsWithTimestamps = await Promise.all(
          allLogs.map(async (log) => {
            let attributeType = 'unknown';
            let proofHash = '0x';
            let gasUsed = 0n;
            let timestamp = 0;

            if (log.topics[0] === SOLIDITY_EVENT_TOPIC) {
              try {
                const decoded = decodeEventLog({
                  abi: ZK_VERIFIER_ABI,
                  data: log.data,
                  topics: log.topics,
                }) as any;
                attributeType = decoded.args.attributeType;
                proofHash = decoded.args.proofHash;
                gasUsed = decoded.args.gasUsed;
              } catch (e) { }
            } else {
              try {
                const decoded = decodeEventLog({
                  abi: ZK_VERIFIER_ABI,
                  data: log.data,
                  topics: log.topics,
                }) as any;
                timestamp = Number(decoded.args.timestamp);
                gasUsed = decoded.args.gasUsed;

                const txHash = log.transactionHash;
                const stored = localStorage.getItem("verificationAttributes");
                const map = stored ? JSON.parse(stored) : {};
                attributeType = map[txHash] || "kyc_verified";
              } catch (e) { }
            }

            if (timestamp === 0) {
              const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
              timestamp = Number(block.timestamp);
            }

            return {
              user: address,
              attributeType,
              proofHash,
              gasUsed,
              timestamp,
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
