import React, { useState, useEffect } from 'react';
import { useCSPRClick } from '@make-software/csprclick-ui';
import { Zap, TrendingUp, Shield, ArrowRight, Info } from 'lucide-react';

const LiquidStaking = () => {
  const { isConnected, activeAccount, signDeploy } = useCSPRClick();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [userPosition, setUserPosition] = useState({
    cspr_staked: 0,
    vcspr_balance: 0,
    rewards_earned: 0,
    apy: 12.0
  });
  const [exchangeRate, setExchangeRate] = useState(1.05);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in production, fetch from contract
  useEffect(() => {
    if (isConnected && activeAccount) {
      // Simulate fetching user position
      setUserPosition({
        cspr_staked: 25000,
        vcspr_balance: 23809.52, // 25000 / 1.05
        rewards_earned: 1250,
        apy: 12.0
      });
    }
  }, [isConnected, activeAccount]);

  const handleStake = async () => {
    if (!isConnected || !stakeAmount) return;
    
    setIsLoading(true);
    try {
      // In production, create and sign deploy to liquid staking contract
      const deploy = {
        // Contract call parameters
        contractHash: 'liquid-staking-contract-hash',
        entryPoint: 'stake_cspr',
        args: [],
        payment: stakeAmount * 1000000000, // Convert to motes
      };
      
      // await signDeploy(deploy);
      
      // Simulate successful stake
      setTimeout(() => {
        const newStaked = userPosition.cspr_staked + parseFloat(stakeAmount);
        const newVCSPR = newStaked / exchangeRate;
        
        setUserPosition(prev => ({
          ...prev,
          cspr_staked: newStaked,
          vcspr_balance: newVCSPR
        }));
        
        setStakeAmount('');
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Staking failed:', error);
      setIsLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!isConnected || !unstakeAmount) return;
    
    setIsLoading(true);
    try {
      // In production, create and sign deploy to liquid staking contract
      const deploy = {
        contractHash: 'liquid-staking-contract-hash',
        entryPoint: 'unstake_cspr',
        args: [unstakeAmount * 1000000000], // vCSPR amount in motes
      };
      
      // await signDeploy(deploy);
      
      // Simulate successful unstake
      setTimeout(() => {
        const vcspr_to_burn = parseFloat(unstakeAmount);
        const cspr_to_return = vcspr_to_burn * exchangeRate;
        
        setUserPosition(prev => ({
          ...prev,
          cspr_staked: prev.cspr_staked - cspr_to_return,
          vcspr_balance: prev.vcspr_balance - vcspr_to_burn
        }));
        
        setUnstakeAmount('');
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Unstaking failed:', error);
      setIsLoading(false);
    }
  };

  const calculateVCSPR = (cspr) => {
    return cspr ? (parseFloat(cspr) / exchangeRate).toFixed(6) : '0';
  };

  const calculateCSPR = (vcspr) => {
    return vcspr ? (parseFloat(vcspr) * exchangeRate).toFixed(6) : '0';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Liquid Staking</h1>
        <p className="text-lg text-gray-600">
          Stake CSPR and receive liquid vCSPR tokens that earn rewards while remaining tradeable
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">12% APY</h3>
          <p className="text-sm text-gray-600">
            Earn competitive staking rewards automatically distributed
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Instant Liquidity</h3>
          <p className="text-sm text-gray-600">
            Use vCSPR tokens in DeFi while earning staking rewards
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Secure Protocol</h3>
          <p className="text-sm text-gray-600">
            Audited smart contracts with transparent validator selection
          </p>
        </div>
      </div>

      {/* User Position */}
      {isConnected && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Your Position</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">CSPR Staked</p>
              <p className="text-xl font-bold text-gray-900">
                {userPosition.cspr_staked.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">vCSPR Balance</p>
              <p className="text-xl font-bold text-blue-600">
                {userPosition.vcspr_balance.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Rewards Earned</p>
              <p className="text-xl font-bold text-green-600">
                {userPosition.rewards_earned.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Current APY</p>
              <p className="text-xl font-bold text-purple-600">
                {userPosition.apy}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Staking Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stake CSPR */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" />
            Stake CSPR
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Stake
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-field pr-16"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  CSPR
                </div>
              </div>
            </div>
            
            {stakeAmount && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">You will receive:</span>
                  <span className="font-semibold text-blue-600">
                    {calculateVCSPR(stakeAmount)} vCSPR
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Exchange rate:</span>
                  <span className="text-gray-900">1 CSPR = {(1/exchangeRate).toFixed(6)} vCSPR</span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleStake}
              disabled={!isConnected || !stakeAmount || isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Staking...
                </div>
              ) : (
                'Stake CSPR'
              )}
            </button>
          </div>
        </div>

        {/* Unstake vCSPR */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-green-600" />
            Unstake vCSPR
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                vCSPR to Unstake
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-field pr-20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  vCSPR
                </div>
              </div>
              {isConnected && (
                <div className="text-sm text-gray-500 mt-1">
                  Available: {userPosition.vcspr_balance.toLocaleString()} vCSPR
                </div>
              )}
            </div>
            
            {unstakeAmount && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">You will receive:</span>
                  <span className="font-semibold text-green-600">
                    {calculateCSPR(unstakeAmount)} CSPR
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Exchange rate:</span>
                  <span className="text-gray-900">1 vCSPR = {exchangeRate.toFixed(6)} CSPR</span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleUnstake}
              disabled={!isConnected || !unstakeAmount || isLoading}
              className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-casper-600 mr-2"></div>
                  Unstaking...
                </div>
              ) : (
                'Unstake vCSPR'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Protocol Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-gray-600" />
          Protocol Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total CSPR Staked</p>
            <p className="text-xl font-bold text-gray-900">2.45M CSPR</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total vCSPR Supply</p>
            <p className="text-xl font-bold text-blue-600">2.33M vCSPR</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Exchange Rate</p>
            <p className="text-xl font-bold text-purple-600">{exchangeRate.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Protocol APY</p>
            <p className="text-xl font-bold text-green-600">12.0%</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="space-y-1 text-xs">
                <li>• Your CSPR is staked with high-performance validators</li>
                <li>• Receive vCSPR tokens representing your staked position</li>
                <li>• vCSPR appreciates in value as rewards accumulate</li>
                <li>• Use vCSPR in other DeFi protocols while earning staking rewards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Wallet Prompt */}
      {!isConnected && (
        <div className="card text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-4">
            Connect your Casper wallet to start liquid staking and earning rewards
          </p>
        </div>
      )}
    </div>
  );
};

export default LiquidStaking;