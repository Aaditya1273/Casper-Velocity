"use client";

import { useAccount, useReadContract, useBlockNumber } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { formatUnits } from "viem";
import { useEffect, useState } from "react";
import { createPublicClient, http, parseAbiItem } from "viem";
import { ARBITRUM_SEPOLIA } from "@/lib/contracts";

const MOCK_BUIDL_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const;

export interface Transaction {
  hash: string;
  type: 'mint' | 'redeem' | 'transfer';
  amount: string;
  timestamp: number;
  from: string;
  to: string;
  blockNumber: bigint;
}

export function usePortfolioData() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTxs, setIsLoadingTxs] = useState(false);
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: balance, isLoading: isLoadingBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.MOCK_BUIDL,
    abi: MOCK_BUIDL_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (!address) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      setIsLoadingTxs(true);
      try {
        const client = createPublicClient({
          chain: ARBITRUM_SEPOLIA,
          transport: http(),
        });

        const currentBlock = await client.getBlockNumber();
        // Use smaller block range for Alchemy free tier (max 10 blocks per request)
        // We'll fetch in chunks to stay within limits
        const CHUNK_SIZE = BigInt(10); // Alchemy free tier limit
        const MAX_LOOKBACK = BigInt(1000); // Look back 1000 blocks max

        const fromBlock = currentBlock > MAX_LOOKBACK ? currentBlock - MAX_LOOKBACK : BigInt(0);

        // Fetch in chunks to respect Alchemy limits
        const allSentLogs = [];
        const allReceivedLogs = [];

        for (let start = fromBlock; start < currentBlock; start += CHUNK_SIZE) {
          const end = start + CHUNK_SIZE > currentBlock ? currentBlock : start + CHUNK_SIZE;

          try {
            const [sentLogs, receivedLogs] = await Promise.all([
              client.getLogs({
                address: CONTRACTS.MOCK_BUIDL,
                event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
                args: { from: address },
                fromBlock: start,
                toBlock: end,
              }).catch(() => []),
              client.getLogs({
                address: CONTRACTS.MOCK_BUIDL,
                event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
                args: { to: address },
                fromBlock: start,
                toBlock: end,
              }).catch(() => []),
            ]);

            allSentLogs.push(...sentLogs);
            allReceivedLogs.push(...receivedLogs);
          } catch (err) {
            // Skip failed chunks
            console.warn(`Failed to fetch logs for blocks ${start}-${end}:`, err);
          }
        }

        const allLogs = [...allSentLogs, ...allReceivedLogs];

        // Deduplicate by transaction hash
        const uniqueLogs = Array.from(
          new Map(allLogs.map(log => [log.transactionHash, log])).values()
        );

        // Sort by block number descending
        uniqueLogs.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

        // Fetch block timestamps for all transactions
        const txsWithDetails = await Promise.all(
          uniqueLogs.slice(0, 20).map(async (log) => {
            const block = await client.getBlock({ blockNumber: log.blockNumber });
            const from = log.args.from as string;
            const to = log.args.to as string;
            const value = log.args.value as bigint;

            // Determine transaction type
            let type: 'mint' | 'redeem' | 'transfer';
            if (from === '0x0000000000000000000000000000000000000000') {
              type = 'mint';
            } else if (to === '0x0000000000000000000000000000000000000000') {
              type = 'redeem';
            } else {
              type = 'transfer';
            }

            return {
              hash: log.transactionHash,
              type,
              amount: formatUnits(value, 6),
              timestamp: Number(block.timestamp),
              from,
              to,
              blockNumber: log.blockNumber,
            };
          })
        );

        setTransactions(txsWithDetails);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setIsLoadingTxs(false);
      }
    };

    fetchTransactions();
  }, [address, blockNumber]);

  const userBalance = balance ? Number(formatUnits(balance as bigint, 6)) : 0;

  // Calculate portfolio stats
  const totalMinted = transactions
    .filter(tx => tx.type === 'mint')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalRedeemed = transactions
    .filter(tx => tx.type === 'redeem')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const portfolioValue = userBalance;
  const portfolioChange = totalMinted - totalRedeemed;

  return {
    balance: userBalance,
    portfolioValue,
    portfolioChange,
    totalMinted,
    totalRedeemed,
    transactions,
    isLoading: isLoadingBalance,
    isLoadingTxs,
    refetchBalance,
  };
}
