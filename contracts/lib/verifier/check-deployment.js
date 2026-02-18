#!/usr/bin/env node

const { ethers } = require('ethers');

const STYLUS_CONTRACT = '0xea603f56edf3c04278b1611314e6a633b81fd399';
const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';

async function checkDeployment() {
  console.log('🔍 Checking Contract Deployment\n');
  
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  // Check if contract exists
  const code = await provider.getCode(STYLUS_CONTRACT);
  console.log('Contract address:', STYLUS_CONTRACT);
  console.log('Code length:', code.length, 'bytes');
  console.log('Code preview:', code.slice(0, 100) + '...');
  
  if (code === '0x' || code === '0x0') {
    console.log('\n❌ No contract deployed at this address!');
    return false;
  }
  
  console.log('\n✅ Contract exists at this address');
  
  // Try to call with different function selectors
  console.log('\n🔍 Testing function calls...');
  
  const functions = [
    { name: 'is_initialized()', selector: '0x9a01873c' },
    { name: 'get_verified_count()', selector: '0x8ada066e' },
    { name: 'get_owner()', selector: '0x893d20e8' },
  ];
  
  for (const func of functions) {
    try {
      const result = await provider.call({
        to: STYLUS_CONTRACT,
        data: func.selector,
      });
      console.log(`✅ ${func.name}: ${result}`);
    } catch (error) {
      console.log(`❌ ${func.name}: ${error.message.split('\n')[0]}`);
    }
  }
  
  return true;
}

checkDeployment()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
