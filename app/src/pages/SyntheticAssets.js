import React, { useState, useEffect } from 'react';
import { useCSPRClick } from '@make-software/csprclick-ui';
import { Coins, Shield, TrendingUp, AlertTriangle, ArrowUpDown, ExternalLink } from 'lucide-react';

const SyntheticAssets = () => {
  const { isConnected, activeAccount } = useCSPRClick();
  const [activeTab, setActiveTab] = useState('mint');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [syntheticAmount, setSyntheticAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [bridgeAmount, setBridgeAmount] = useState('');
  const [targetChain, setTargetChain] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const [userPosition, setUserPosition] = useState({
    vcspr_collateral: 15000,
    vusd_minted: 10000,
    collateral_ratio: 150,
    liquidation_threshold: 130,
    vusd_balance: 10000
  });

  const [protocolStats, setProtocolStats] = useState({
    total_collateral: 2450000,
    total_synthetic: 1850000,
    global_collateral_ratio: 132.4,
    vusd_price: 1.00
  });

  const supportedChains = [
    { id: '1', name: 'Ethereum', icon: '�' },
    { id: '137', name: 'Polygon', icon: '�' }:,
    { id: '56', name: 'BSC', icon: '🟡' }
  ];

  const calculateMaxMint = () => {
    if (!collateralAmount) return 0;
    const collateralValue = parseFloat(collateralAmount) * 1.05; // vCSPR price
    return (collateralValue / 1.5).toFixed(2); // 150% collateral ratio
  };

  const calculateCollateralRatio = () => {
    if (!collateralAmount || !syntheticAmount) return 0;
    const collateralValue = parseFloat(collateralAmount) * 1.05;
    const debtValue = parseFloat(syntheticAmount);
    return ((collateralValue / debtValue) * 100).toFixed(1);
  };

  const handleMint = async () => {
    if (!isConnected || !collateralAmount || !syntheticAmount) return;
    
    setIsLoading(true);
    try {
      // Simulate minting transaction
      setTimeout(() => {
        setUserPosition(prev => ({
          ...prev,
          vcspr_collateral: prev.vcspr_collateral + parseFloat(collateralAmount),
          vusd_minted: prev.vusd_minted + parseFloat(syntheticAmount),
          vusd_balance: prev.vusd_balance + parseFloat(syntheticAmount),
          collateral_ratio: calculateCollateralRatio()
        }));
        setCollateralAmount('');
        setSyntheticAmount('');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Minting failed:', error);
      setIsLoading(false);
    }
  };

  const handleBurn = async () => {
    if (!isConnected || !burnAmount) return;
    
    setIsLoading(true);
    try {
      // Simulate burning transaction
      setTimeout(() => {
        const burnValue = parseFloat(burnAmount);
        const collateralToReturn = (burnValue / userPosition.vusd_minted) * userPosition.vcspr_collateral;
        
        setUserPosition(prev => ({
          ...prev,
          vcspr_collateral: prev.vcspr_collateral - collateralToReturn,
          vusd_minted: prev.vusd_minted - burnValue,
          vusd_balance: prev.vusd_balance - burnValue
        }));
        setBurnAmount('');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Burning failed:', error);
      setIsLoading(false);
    }
  };

  const handleBridge = async () => {
    if (!isConnected || !bridgeAmount || !targetChain) return;
    
    setIsLoading(true);
    try {
      // Simulate bridge transaction
      setTimeout(() => {
        setUserPosition(prev => ({
          ...prev,
          vusd_balance: prev.vusd_balance - parseFloat(bridgeAmount)
        }));
        setBridgeAmount('');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Bridge failed:', error);
      setIsLoading(false);
    }
  };

  const getRiskColor = (ratio) => {
    if (ratio >= 150) return 'text-green-600';
    if (ratio >= 130) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Synthetic Assets</h1>
        <p className="text-lg text-gray-600">
          Mint vUSD stablecoins using vCSPR as collateral and bridge to any chain
        </p>
      </div>

      {/* User Position Overview */}
      {isConnected && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Your Position</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">vCSPR Collateral</p>
              <p className="text-xl font-bold text-blue-600">
                {userPosition.vcspr_collateral.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">vUSD Minted</p>
              <p className="text-xl font-bold text-purple-600">
                {userPosition.vusd_minted.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Collateral Ratio</p>
              <p className={`text-xl font-bold ${getRiskColor(userPosition.collateral_ratio)}`}>
                {userPosition.collateral_ratio}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">vUSD Balance</p>
              <p className="text-xl font-bold text-green-600">
                {userPosition.vusd_balance.toLocaleString()}
              </p>
            </div>
          </div>
          
          {userPosition.collateral_ratio < 140 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  Warning: Your position is approaching liquidation threshold (130%)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Protocol Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Total Collateral</p>
          <p className="text-xl font-bold text-gray-900">
            ${protocolStats.total_collateral.toLocaleString()}
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Coins className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600">vUSD Supply</p>
          <p className="text-xl font-bold text-gray-900">
            ${protocolStats.total_synthetic.toLocaleString()}
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Global C-Ratio</p>
          <p className="text-xl font-bold text-green-600">
            {protocolStats.global_collateral_ratio}%
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">💲</span>
          </div>
          <p className="text-sm text-gray-600">vUSD Price</p>
          <p className="text-xl font-bold text-gray-900">
            ${protocolStats.vusd_price.toFixed(3)}
          </p>
        </div>
      </div>

      {/* Main Interface */}
      <div className="card">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'mint', label: 'Mint vUSD', icon: Coins },
            { id: 'burn', label: 'Burn & Redeem', icon: ArrowUpDown },
            { id: 'bridge', label: 'Cross-Chain Bridge', icon: ExternalLink }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-casper-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mint Tab */}
        {activeTab === 'mint' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    vCSPR Collateral Amount
                  </label>
                  <input
                    type="number"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {isConnected ? '50,000 vCSPR' : '0 vCSPR'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    vUSD to Mint
                  </label>
                  <input
                    type="number"
                    value={syntheticAmount}
                    onChange={(e) => setSyntheticAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max mintable: {calculateMaxMint()} vUSD
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {collateralAmount && syntheticAmount && (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-gray-900">Position Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Collateral Value:</span>
                        <span className="font-medium">${(parseFloat(collateralAmount) * 1.05).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Debt Value:</span>
                        <span className="font-medium">${syntheticAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Collateral Ratio:</span>
                        <span className={`font-semibold ${getRiskColor(calculateCollateralRatio())}`}>
                          {calculateCollateralRatio()}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Liquidation Price:</span>
                        <span className="font-medium">$0.87</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleMint}
                  disabled={!isConnected || !collateralAmount || !syntheticAmount || isLoading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'Minting...' : 'Mint vUSD'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Burn Tab */}
        {activeTab === 'burn' && (
          <div className="space-y-6">
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  vUSD Amount to Burn
                </label>
                <input
                  type="number"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {isConnected ? userPosition.vusd_balance.toLocaleString() : '0'} vUSD
                </p>
              </div>
              
              {burnAmount && (
                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">vUSD to burn:</span>
                    <span className="font-medium">{burnAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">vCSPR to receive:</span>
                    <span className="font-semibold text-green-600">
                      {((parseFloat(burnAmount) / userPosition.vusd_minted) * userPosition.vcspr_collateral).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleBurn}
                disabled={!isConnected || !burnAmount || isLoading}
                className="w-full btn-secondary disabled:opacity-50"
              >
                {isLoading ? 'Burning...' : 'Burn & Redeem'}
              </button>
            </div>
          </div>
        )}

        {/* Bridge Tab */}
        {activeTab === 'bridge' && (
          <div className="space-y-6">
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  vUSD Amount to Bridge
                </label>
                <input
                  type="number"
                  value={bridgeAmount}
                  onChange={(e) => setBridgeAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {isConnected ? userPosition.vusd_balance.toLocaleString() : '0'} vUSD
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Chain
                </label>
                <select
                  value={targetChain}
                  onChange={(e) => setTargetChain(e.target.value)}
                  className="input-field"
                >
                  {supportedChains.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {bridgeAmount && (
                <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bridge Fee:</span>
                    <span className="font-medium">0.1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">You will receive:</span>
                    <span className="font-semibold text-purple-600">
                      {(parseFloat(bridgeAmount) * 0.999).toFixed(2)} vUSD
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated time:</span>
                    <span className="font-medium">~2 minutes</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleBridge}
                disabled={!isConnected || !bridgeAmount || isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Bridging...' : `Bridge to ${supportedChains.find(c => c.id === targetChain)?.name}`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Risk Management */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Risk Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Safe Zone</h4>
            <p className="text-sm text-gray-600">Collateral ratio above 150%</p>
            <p className="text-xs text-green-600 mt-1">Low liquidation risk</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Warning Zone</h4>
            <p className="text-sm text-gray-600">Collateral ratio 130-150%</p>
            <p className="text-xs text-yellow-600 mt-1">Monitor closely</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Danger Zone</h4>
            <p className="text-sm text-gray-600">Collateral ratio below 130%</p>
            <p className="text-xs text-red-600 mt-1">Liquidation risk</p>
          </div>
        </div>
      </div>

      {/* Connect Wallet Prompt */}
      {!isConnected && (
        <div className="card text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-4">
            Connect your wallet to mint synthetic assets and bridge to other chains
          </p>
        </div>
      )}
    </div>
  );
};

export default SyntheticAssets;