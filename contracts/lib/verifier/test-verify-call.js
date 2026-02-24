#!/usr/bin/env node
/**
 * Test script to verify the Stylus contract can accept verification calls
 * This helps diagnose frontend issues by testing the contract directly
 */

const { ethers } = require('ethers');
require('dotenv').config();

const CONTRACT_ADDRESS = '0x71fec2936322f0d16cb15eb64dcc6571781c32e7';
const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';

// Minimal ABI for testing
const ABI = [
  'function verify(bytes calldata proof, bytes[] calldata publicInputs) external returns (bool)',
  'function getVerifiedCount() external view returns (uint256)',
  'function isInitialized() external view returns (bool)',
];

async function main() {
  console.log('🧪 Testing Stylus ZK Verifier Contract\n');
  
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
  
  console.log('📝 Contract:', CONTRACT_ADDRESS);
  console.log('👤 Wallet:', wallet.address);
  console.log('');
  
  // Check initializationPRIVATE_KEY
  Still reverting! This is very strange. Let me try calling with a send instead of call
  console.log('1️⃣ Checking initialization...');
  const isInit = await contract.isInitialized();
  console.log('   ✅ Initialized:', isInit);
  console.log('');
  
  // Check verified count
  console.log('2️⃣ Checking verified count...');
  const count = await contract.getVerifiedCount();
  console.log('   ✅ Verified count:', count.toString());
  console.log('');
  
  // Create test proof (256 bytes)
  console.log('3️⃣ Creating test proof...');
  const testProof = '0x' + '01'.repeat(256);
  console.log('   ✅ Proof length:', testProof.length, 'chars (', (testProof.length - 2) / 2, 'bytes)');
  console.log('');
  
  // Create test public input (32 bytes)
  console.log('4️⃣ Creating test public input...');
  const testPublicInput = '0x' + '02'.repeat(32);
  console.log('   ✅ Public input length:', testPublicInput.length, 'chars (', (testPublicInput.length - 2) / 2, 'bytes)');
  console.log('');
  
  // Estimate gas
  console.log('5️⃣ Estimating gas...');
  try {
    const gasEstimate = await contract.verify.estimateGas(testProof, [testPublicInput]);
    console.log('   ✅ Estimated gas:', gasEstimate.toString());
    console.log('');
    
    // Get current gas price
    const feeData = await provider.getFeeData();
    console.log('   📊 Gas price:', ethers.formatUnits(feeData.gasPrice || 0n, 'gwei'), 'gwei');
    console.log('   📊 Max fee:', ethers.formatUnits(feeData.maxFeePerGas || 0n, 'gwei'), 'gwei');
    console.log('   📊 Priority fee:', ethers.formatUnits(feeData.maxPriorityFeePerGas || 0n, 'gwei'), 'gwei');
    console.log('');
    
    // Calculate cost
    const estimatedCost = gasEstimate * (feeData.gasPrice || 0n);
    console.log('   💰 Estimated cost:', ethers.formatEther(estimatedCost), 'ETH');
    console.log('');
    
  } catch (error) {
    console.log('   ❌ Gas estimation failed:', error.message);
    console.log('');
    
    // Try to get more details
    if (error.data) {
      console.log('   Error data:', error.data);
    }
    return;
  }
  
  // Ask user if they want to send the transaction
  console.log('6️⃣ Ready to send test transaction');
  console.log('   ⚠️  This will use real testnet ETH');
  console.log('');
  console.log('   To send the transaction, uncomment the code below and run again.');
  console.log('');
  
  /*
  // Uncomment to actually send the transaction
  console.log('   📤 Sending transaction...');
  const tx = await contract.verify(testProof, [testPublicInput], {
    gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
  });
  console.log('   ✅ Transaction sent:', tx.hash);
  console.log('   ⏳ Waiting for confirmation...');
  
  const receipt = await tx.wait();
  console.log('   ✅ Transaction confirmed!');
  console.log('   📊 Gas used:', receipt.gasUsed.toString());
  console.log('   🔗 View on Arbiscan: https://sepolia.arbiscan.io/tx/' + tx.hash);
  console.log('');
  
  // Check new verified count
  const newCount = await contract.getVerifiedCount();
  console.log('   ✅ New verified count:', newCount.toString());
  */
  
  console.log('✅ All checks passed!');
  console.log('');
  console.log('💡 If the frontend is still failing:');
  console.log('   1. Check wallet has enough ETH for gas');
  console.log('   2. Try refreshing the page');
  console.log('   3. Check browser console for errors');
  console.log('   4. Ensure wallet is connected to Arbitrum Sepolia');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
