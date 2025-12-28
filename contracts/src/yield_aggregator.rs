use odra::prelude::*;
use crate::types::YieldStrategy;

#[odra::module]
pub struct YieldAggregatorContract {
    // Strategy management
    strategies: Mapping<u32, YieldStrategy>,
    strategy_count: Variable<u32>,
    
    // User deposits per strategy
    user_deposits: Mapping<(Address, u32), U256>,
    user_rewards: Mapping<(Address, u32), U256>,
    
    // Total deposits per strategy
    strategy_totals: Mapping<u32, U256>,
    
    // Admin
    owner: Variable<Address>,
    paused: Variable<bool>,
    
    // Performance tracking
    total_yield_generated: Variable<U256>,
    active_strategies_count: Variable<u32>,
}

#[odra::module]
impl YieldAggregatorContract {
    pub fn init(&mut self, owner: Address) {
        self.owner.set(owner);
        self.strategy_count.set(0);
        self.active_strategies_count.set(0);
        self.paused.set(false);
        self.total_yield_generated.set(U256::zero());
        
        // Initialize default strategies
        self.add_default_strategies();
    }
    
    fn add_default_strategies(&mut self) {
        // Strategy 1: Conservative DeFi (Lower risk, stable returns)
        let conservative_strategy = YieldStrategy {
            id: 1,
            name: "Conservative DeFi Pool".to_string(),
            apy: 800, // 8% APY
            total_deposited: U256::zero(),
            is_active: true,
        };
        
        // Strategy 2: Aggressive DeFi (Higher risk, higher returns)
        let aggressive_strategy = YieldStrategy {
            id: 2,
            name: "High-Yield Farming".to_string(),
            apy: 1500, // 15% APY
            total_deposited: U256::zero(),
            is_active: true,
        };
        
        // Strategy 3: Cross-chain arbitrage
        let arbitrage_strategy = YieldStrategy {
            id: 3,
            name: "Cross-Chain Arbitrage".to_string(),
            apy: 1200, // 12% APY
            total_deposited: U256::zero(),
            is_active: true,
        };
        
        self.strategies.set(&1, conservative_s