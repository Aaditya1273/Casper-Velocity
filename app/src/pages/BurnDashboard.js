import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Activity, Clock, DollarSign, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const BurnDashboard = () => {
  const [burnMetrics, setBurnMetrics] = useState({
    totalBurned: 45000,
    burnRate: 125.5,
    transactionCount: 8420,
    deflationaryImpact: 2.3,
    lastBurnTime: Date.now() - 45000,
    avgBurnPerTx: 5.34
  });

  const [burnHistory] = useState([
    { date: 'Jan', burned: 12000, transactions: 2100, rate: 95.2 },
    { date: 'Feb', burned: 18500, transactions: 3200, rate: 108.7 },
    { date: 'Mar', burned: 25000, transactions: 4500, rate: 115.3 },
    { date: 'Apr', burned: 32000, transactions: 5800, rate: 118.9 },
    { date: 'May', burned: 38500, transactions: 7100, rate: 122.1 },
    { date: 'Jun', burned: 45000, transactions: 8420, rate: 125.5 }
  ]);

  const [realtimeBurns, setRealtimeBurns] = useState([
    { id: 1, amount: 12.5, txHash: '0x1234...5678', timestamp: Date.now() - 30000, type: 'Liquid Staking' },
    { id: 2, amount: 8.3, txHash: '0x2345...6789', timestamp: Date.now() - 45000, type: 'Yield Farming' },
    { id: 3, amount: 15.7, txHash: '0x3456...7890', timestamp: Date.now() - 60000, type: 'Synthetic Mint' },
    { id: 4, amount: 6.2, txHash: '0x4567...8901', timestamp: Date.now() - 90000, type: 'Cross-chain Bridge' },
    { id: 5, amount: 22.1, txHash: '0x5678...9012', timestamp: Date.now() - 120000, type: 'Liquid Staking' }
  ]);

  const [projectionData] = useState([
    { month: 'Jul', conservative: 52000, optimistic: 58000, current: 45000 },
    { month: 'Aug', conservative: 59000, optimistic: 68000, current: 45000 },
    { month: 'Sep', conservative: 66000, optimistic: 79000, current: 45000 },
    { month: 'Oct', conservative: 73000, optimistic: 91000, current: 45000 },
    { month: 'Nov', conservative: 80000, optimistic: 105000, current: 45000 },
    { month: 'Dec', conservative: 87000, optimistic: 120000, current: 45000 }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new burn event
      if (Math.random() > 0.7) {
        const newBurn = {
          id: Date.now(),
          amount: Math.random() * 20 + 5,
          txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
          timestamp: Date.now(),
          type: ['Liquid Staking', 'Yield Farming', 'Synthetic Mint', 'Cross-chain Bridge'][Math.floor(Math.random() * 4)]
        };
        
        setRealtimeBurns(prev => [newBurn, ...prev.slice(0, 9)]);
        
        setBurnMetrics(prev => ({
          ...prev,
          totalBurned: prev.totalBurned + newBurn.amount,
          transactionCount: prev.transactionCount + 1,
          lastBurnTime: Date.now(),
          burnRate: prev.burnRate + (Math.random() - 0.5) * 2
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getBurnTypeColor = (type) => {
    const colors = {
      'Liquid Staking': 'bg-blue-100 text-blue-800',
      'Yield Farming': 'bg-green-100 text-green-800',
      'Synthetic Mint': 'bg-purple-100 text-purple-800',
      'Cross-chain Bridge': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Burn Dashboard</h1>
        </div>
        <p className="text-lg text-gray-600">
          Real-time tracking of CSPR fee burning and deflationary impact
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live data • Updates every 8 seconds</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total CSPR Burned</p>
              <p className="text-2xl font-bold text-orange-600">
                {burnMetrics.totalBurned.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                ${(burnMetrics.totalBurned * 0.045).toLocaleString()} USD value
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Burn Rate</p>
              <p className="text-2xl font-bold text-red-600">
                {burnMetrics.burnRate.toFixed(1)}
              </p>
              <p className="text-sm text-green-600">
                CSPR/hour • +5.2% today
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Burn Transactions</p>
              <p className="text-2xl font-bold text-blue-600">
                {burnMetrics.transactionCount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Avg: {burnMetrics.avgBurnPerTx} CSPR/tx
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deflationary Impact</p>
              <p className="text-2xl font-bold text-purple-600">
                {burnMetrics.deflationaryImpact.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">
                Annual supply reduction
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Burn History Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Historical Burn Data</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={burnHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'burned' ? `${value.toLocaleString()} CSPR` : value,
                  name === 'burned' ? 'Burned' : 'Transactions'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="burned" 
                stroke="#ea580c" 
                fill="#fed7aa" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Burn Rate Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Burn Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={burnHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} CSPR/hour`, 'Burn Rate']} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Real-time Burns and Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Burn Feed */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Burn Feed</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Live</span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {realtimeBurns.map((burn) => (
              <div key={burn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {burn.amount.toFixed(1)} CSPR
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBurnTypeColor(burn.type)}`}>
                        {burn.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{burn.txHash}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{formatTimeAgo(burn.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Burn Projections */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">6-Month Burn Projections</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} CSPR`, '']} />
              <Area 
                type="monotone" 
                dataKey="optimistic" 
                stroke="#10b981" 
                fill="#d1fae5" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="conservative" 
                stroke="#f59e0b" 
                fill="#fef3c7" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-200 rounded-full"></div>
              <span className="text-gray-600">Optimistic (120K by Dec)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
              <span className="text-gray-600">Conservative (87K by Dec)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Burn by Protocol Feature */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Burns by Protocol Feature</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'Liquid Staking', burns: 18500, percentage: 41.1, color: 'blue' },
            { name: 'Yield Farming', burns: 13500, percentage: 30.0, color: 'green' },
            { name: 'Synthetic Assets', burns: 8000, percentage: 17.8, color: 'purple' },
            { name: 'Cross-chain Bridge', burns: 5000, percentage: 11.1, color: 'orange' }
          ].map((feature) => (
            <div key={feature.name} className="text-center">
              <div className={`w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <span className="text-2xl">
                  {feature.name === 'Liquid Staking' && '💧'}
                  {feature.name === 'Yield Farming' && '🌾'}
                  {feature.name === 'Synthetic Assets' && '💎'}
                  {feature.name === 'Cross-chain Bridge' && '🌉'}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{feature.name}</h4>
              <p className="text-lg font-bold text-gray-900">{feature.burns.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{feature.percentage}% of total burns</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Economic Impact Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Supply Reduction</h4>
            <p className="text-2xl font-bold text-green-600">2.3%</p>
            <p className="text-sm text-green-700">Annual deflationary pressure</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Network Value</h4>
            <p className="text-2xl font-bold text-blue-600">$2.03M</p>
            <p className="text-sm text-blue-700">Total value burned to date</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Burn Efficiency</h4>
            <p className="text-2xl font-bold text-purple-600">98.7%</p>
            <p className="text-sm text-purple-700">Of fees successfully burned</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <Flame className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">How Fee Burning Works:</p>
              <ul className="space-y-1 text-xs">
                <li>• 100% of transaction fees are automatically burned</li>
                <li>• Each protocol interaction generates fees that reduce CSPR supply</li>
                <li>• Burn rate increases with network activity and adoption</li>
                <li>• Creates deflationary pressure supporting long-term value</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurnDashboard;