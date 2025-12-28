import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Zap, 
  Coins, 
  DollarSign, 
  Users, 
  Activity,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalValueLocked: 2450000,
    totalStaked: 1850000,
    totalYieldGenerated: 125000,
    activeUsers: 1247,
    burnedFees: 45000,
    vcspr_price: 1.05
  });

  const [chartData] = useState([
    { name: 'Jan', tvl: 1200000, yield: 45000 },
    { name: 'Feb', tvl: 1450000, yield: 62000 },
    { name: 'Mar', tvl: 1680000, yield: 78000 },
    { name: 'Apr', tvl: 1920000, yield: 95000 },
    { name: 'May', tvl: 2150000, yield: 110000 },
    { name: 'Jun', tvl: 2450000, yield: 125000 },
  ]);

  const strategyData = [
    { name: 'Conservative DeFi', value: 40, color: '#0ea5e9' },
    { name: 'High-Yield Farming', value: 35, color: '#d946ef' },
    { name: 'Cross-Chain Arbitrage', value: 25, color: '#10b981' },
  ];

  const quickActions = [
    {
      title: 'Stake CSPR',
      description: 'Earn 12% APY + get liquid vCSPR tokens',
      icon: Zap,
      link: '/liquid-staking',
      color: 'from-casper-500 to-casper-600'
    },
    {
      title: 'Yield Farming',
      description: 'Maximize returns with automated strategies',
      icon: TrendingUp,
      link: '/yield-farming',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Mint vUSD',
      description: 'Create synthetic stablecoins with vCSPR',
      icon: Coins,
      link: '/synthetic-assets',
      color: 'from-velocity-500 to-velocity-600'
    },
    {
      title: 'Fee Burning',
      description: 'Track CSPR burned by the protocol',
      icon: Flame,
      link: '/burn-dashboard',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-casper-600 to-velocity-600 bg-clip-text text-transparent">
          Casper Velocity
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The ultimate liquid staking and yield aggregation platform on Casper Network. 
          Stake CSPR, earn yield, and bridge to any chain.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>8s Block Time</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>100% Fee Burning</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Cross-Chain Ready</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value Locked</p>
              <p className="text-2xl font-bold text-gray-900">
                ${metrics.totalValueLocked.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.5% this month
              </p>
            </div>
            <div className="p-3 bg-casper-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-casper-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CSPR Staked</p>
              <p className="text-2xl font-bold text-gray-900">
                {(metrics.totalStaked / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-blue-600">
                12% APY + Liquid Rewards
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yield Generated</p>
              <p className="text-2xl font-bold text-gray-900">
                ${metrics.totalYieldGenerated.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">
                Across all strategies
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CSPR Burned</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.burnedFees.toLocaleString()}
              </p>
              <p className="text-sm text-orange-600 flex items-center">
                <Flame className="w-4 h-4 mr-1" />
                Deflationary Impact
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TVL Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Total Value Locked Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'TVL']} />
              <Line 
                type="monotone" 
                dataKey="tvl" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Strategy Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Strategy Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={strategyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {strategyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {strategyData.map((strategy, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: strategy.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{strategy.name}</span>
                </div>
                <span className="text-sm font-medium">{strategy.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="group card hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-casper-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex items-center text-casper-600 text-sm font-medium">
                    Get Started
                    <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Protocol Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Large stake', amount: '50,000 CSPR', user: '0x1234...5678', time: '2 minutes ago' },
            { action: 'Yield claimed', amount: '1,250 CSPR', user: '0x8765...4321', time: '5 minutes ago' },
            { action: 'vUSD minted', amount: '10,000 vUSD', user: '0x9876...1234', time: '8 minutes ago' },
            { action: 'Cross-chain bridge', amount: '25,000 vUSD', user: '0x5432...8765', time: '12 minutes ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <span className="font-medium text-gray-900">{activity.action}</span>
                  <span className="text-gray-600 ml-2">{activity.amount}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">{activity.user}</div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;