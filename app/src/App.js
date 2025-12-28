import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CSPRClickProvider } from '@make-software/csprclick-ui';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LiquidStaking from './pages/LiquidStaking';
import YieldFarming from './pages/YieldFarming';
import SyntheticAssets from './pages/SyntheticAssets';
import BurnDashboard from './pages/BurnDashboard';

const casperConfig = {
  network: 'testnet',
  rpcUrl: 'https://rpc.testnet.casperlabs.io',
  chainName: 'casper-test'
};

function App() {
  return (
    <CSPRClickProvider config={casperConfig}>
      <Router>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/liquid-staking" element={<LiquidStaking />} />
              <Route path="/yield-farming" element={<YieldFarming />} />
              <Route path="/synthetic-assets" element={<SyntheticAssets />} />
              <Route path="/burn-dashboard" element={<BurnDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CSPRClickProvider>
  );
}

export default App;