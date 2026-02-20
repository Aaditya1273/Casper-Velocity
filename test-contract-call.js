#!/usr/bin/env node
/**
 * Test contract call to diagnose the "Review alert" issue
 */

const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x9af0b5c82d56d083d1cf54425f57a7b04d6566ec';
const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';

const ABI = [
  'function verify(bytes calldata proof, bytes[] calldata publicInputs) external returns (bool)',
  'function isInitialized() external view returns (bool)',
  'function getVerifiedCount() external view returns (uint256)',
];

async function testContract() {
  console.log('🧪 Testing Stylus Contract Call\n');
  
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  
  // Test 1: Check if initialized
  console.log('1️⃣ Checking if contract is initialized...');
  try {
    const isInit = await contract.isInitialized();
    console.log('   ✅ Initialized:', isInit);
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  // Test 2: Get verified count
  console.log('\n2️⃣ Getting verified count...');
  try {
    const count = await contract.getVerifiedCount();
    console.log('   ✅ Verified count:', count.toString());
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  // Test 3: Try to call verify (static call to simulate)
  console.log('\n3️⃣ Testing verify function (static call)...');
  try {
    // Create test proof (256 bytes)
    const proof = '0x' + '01'.repeat(256);
    
    // Create test public input (32 bytes)
    const publicInput = '0x' + '02'.repeat(32);
    
    console.log('   Proof length:', proof.length - 2, 'hex chars =', (proof.length - 2) / 2, 'bytes');
    console.log('   Public input length:', publicInput.length - 2, 'hex chars =', (publicInput.length - 2) / 2, 'bytes');
    
    // Try static call (simulation)
    const result = await contract.verify.staticCall(proof, [publicInput]);
    console.log('   ✅ Verify result:', result);
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    console.log('   Error data:', error.data);
    
    // Try to decode the error
    if (error.data) {
      console.log('   Raw error data:', error.data);
    }
  }
  
  // Test 4: Estimate gas
  console.log('\n4️⃣ Estimating gas...');
  try {
    const proof = '0x' + '01'.repeat(256);
    const publicInput = '0x' + '02'.repeat(32);
    
    const gasEstimate = await contract.verify.estimateGas(proof, [publicInput]);
    console.log('   ✅ Estimated gas:', gasEstimate.toString());
  } catch (error) {
    console.log('   ❌ Gas estimation failed:', error.message);
    if (error.data) {
      console.log('   Error data:', error.data);
    }
  }
}

testContract().catch(console.error);
