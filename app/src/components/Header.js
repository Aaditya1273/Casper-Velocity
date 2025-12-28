import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@make-software/csprclick-ui';
import { Zap, TrendingUp, Coins, BarChart3, Flame } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Liquid Staking', href: '/liquid-staking', icon: Zap },
    { name: 'Yield Farming', href: '/yield-farming', icon: TrendingUp },
    { name: 'Synthetic Assets', href: '/synthetic-assets', icon: Coins },
    { name: 'Burn Dashboard', href: '/burn-dashboard', icon: Flame },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-casper-600 to-velocity-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-casper-600 to-velocity-600 bg-clip-text text-transparent">
              Casper Velocity
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-casper-100 to-velocity-100 text-casper-700'
                      : 'text-gray-600 hover:text-casper-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Connect Wallet */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;