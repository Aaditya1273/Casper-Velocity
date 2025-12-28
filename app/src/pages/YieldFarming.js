import React, { useState, useEffect } from 'react';
import { useCSPRClick } from '@make-software/csprclick-ui';
import { TrendingUp, Shield, Zap, DollarSign, ArrowUpRight, Info } from 'lucide-react';

const YieldFarming = () => {
  const { isConnected, activeAccount } = useCSPRClick();
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const strategies = [
    {
      id: 1,
      name: 'Conservative DeFi Pool',
      description: 'Low-risk strategy focusing on stable yield generation',
      apy: 8.5,
      tvl: 980000,
      riskLevel: 'Low',
      color: 'blue',
      features: ['Stable returns', 'Low volatility', 'Automated rebalancing'],
      userDeposit: 5000,
      userRewards: 125
    },
    {
      id: 2,
      name: 'High-Yield Farming',
      description: 'Aggressive strategy targeting maximum yield opportunities',
      apy: 15.2,
      tvl: 750000,
      riskLevel: 'High',
      color: 'green',
      features: ['Maximum returns', 'Active management', 'Compound rewards'],
      userDeposit: 10000,
      userRewards: 380
    },
    {
      id: 3,
      name: 'Cross-Chain Arbitrage',
      description: 'Multi-chain strategy exploiting price differences',
      apy: 12.8,
      tvl: 620000,
      riskLevel: 'Medium',
      color: 'purple',
      features: ['Cross-chain exposure', 'Arbitrage opportunities', 'Diversified risk'],
      userDeposit: 7500,
      userRewards: 240
    }
  ];

  const [userPositions, setUserPositions] = useState(
    strategies.reduce((acc, strategy) => {
      acc[strategy.id] = {
        deposited: strategy.userDeposit,
        rewards: strategy.userRewards,
        lastClaim: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      };
      return acc;
    }, {})
  );

  const handleDeposit = async (strategyId) => {
    if (!isConnected || !depositAmount) return;
    
    setIsLoading(true);
    try {
      // Simulate deposit transaction
      setTimeout(() => {
        setUserPositions(prev => ({
          ...prev,
          [strategyId]: {
            ...prev[strategyId],
            deposited: (prev[strategyId]?.deposited || 0) + parseFloat(depositAmount)
          }
        }));
        setDepositAmount('');
        setSelectedStrategy(null);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Deposit failed:', error);
      setIsLoading(false);
    }
  };

  const handleClaimRewards = async (strategyId) => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      // Simulate claim transaction
      setTimeout(() => {
        setUserPositions(prev => ({
          ...prev,
          [strategyId]: {
            ...prev[strategyId],
            rewards: 0,
            lastClaim: Date.now()
          }
        }));
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Claim failed:', error);
      setIsLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStrategyColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600'
    };
    return colors[color] || colors.blue;
  };

  const totalDeposited = Object.values(userPositions).reduce((sum, pos) => sum + (pos.deposited || 0), 0);
  const totalRewards = Object.values(userPositions).reduce((sum, pos) => sum + (pos.rewards || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Yield Farming</h1>
        <p className="text-lg text-gray-600">
          Maximize your returns with automated yield strategies across multiple protocols
        </p>
      </div>

      {/* User Overview */}
      {isConnected && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Your Farming Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Deposited</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalDeposited.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending Rewards</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalRewards.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Average APY</p>
              <p className="text-2xl font-bold text-purple-600">
                {((strategies.reduce((sum, s) => sum + s.apy, 0) / strategies.length)).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => {
          const userPosition = userPositions[strategy.id];
          
          return (
            <div key={strategy.id} className="card hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                {/* Strategy Header */}
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getStrategyColor(strategy.color)} rounded-lg flex items-center justify-center`}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(strategy.riskLevel)}`}>
                    {strategy.riskLevel} Risk
                  </div>
                </div>

                {/* Strategy Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{strategy.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">APY</span>
                      <span className="font-semibold text-green-600">{strategy.apy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TVL</span>
                      <span className="font-medium">${(strategy.tvl / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {strategy.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* User Position */}
                {isConnected && userPosition && userPosition.deposited > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Your Deposit</span>
                      <span className="font-medium">${userPosition.deposited.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pending Rewards</span>
                      <span className="font-medium text-green-600">${userPosition.rewards.toLocaleString()}</span>
                    </div>
                    {userPosition.rewards > 0 && (
                      <button
                        onClick={() => handleClaimRewards(strategy.id)}
                        disabled={isLoading}
                        className="w-full text-sm bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Claiming...' : 'Claim Rewards'}
                      </button>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => setSelectedStrategy(strategy)}
                  className="w-full btn-primary"
                >
                  Deposit to Strategy
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategy Performance Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Strategy Performance Comparison</h3>
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{strategy.name}</span>
                <span className="text-sm font-semibold text-green-600">{strategy.apy}% APY</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${getStrategyColor(strategy.color)}`}
                  style={{ width: `${(strategy.apy / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {selectedStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Deposit to {selectedStrategy.name}</h3>
              <button
                onClick={() => setSelectedStrategy(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount (USD)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>
              
              {depositAmount && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expected Annual Yield:</span>
                    <span className="font-semibold text-green-600">
                      ${(parseFloat(depositAmount) * selectedStrategy.apy / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Strategy APY:</span>
                    <span className="font-medium">{selectedStrategy.apy}%</span>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeposit(selectedStrategy.id)}
                  disabled={!depositAmount || isLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'Depositing...' : 'Deposit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-gray-600" />
          How Yield Farming Works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Deposit Assets</h4>
                <p className="text-sm text-gray-600">Deposit your vCSPR or other supported assets into yield strategies</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Automated Management</h4>
                <p className="text-sm text-gray-600">Smart contracts automatically optimize your positions for maximum yield</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Earn Rewards</h4>
                <p className="text-sm text-gray-600">Collect yield from multiple DeFi protocols and farming opportunities</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-orange-600">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Compound Growth</h4>
                <p className="text-sm text-gray-600">Rewards are automatically reinvested to maximize compound returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Wallet Prompt */}
      {!isConnected && (
        <div className="card text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-4">
            Connect your wallet to start earning yield with automated farming strategies
          </p>
        </div>
      )}
    </div>
  );
};

export default YieldFarming;