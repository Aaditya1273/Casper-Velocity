use odra::prelude::*;
use crate::types::{StakePosition, BurnMetrics};

#[odra::module]
pub struct LiquidStakingContract {
    // Core state
    total_cspr_staked: Variable<U256>,
    total_vcspr_supply: Variable<U256>,
    exchange_rate: Variable<U256>, // vCSPR per CSPR (scaled by 1e18)
    
    // User positions
    positions: Mapping<Address, StakePosition>,
    user_vcspr_balance: Mapping<Address, U256>,
    
    // Rewards and metrics
    total_rewards_earned: Variable<U256>,
    burn_metrics: Variable<BurnMetrics>,
    
    // Admin
    owner: Variable<Address>,
    paused: Variable<bool>,
    
    // Constants
    min_stake_amount: Variable<U256>,
    staking_apy: Variable<u32>, // basis points (1200 = 12%)
}

#[odra::module]
impl LiquidStakingContract {
    pub fn init(&mut self, owner: Address) {
        self.owner.set(owner);
        self.exchange_rate.set(U256::from(1_000_000_000_000_000_000u64)); // 1:1 initially
        self.min_stake_amount.set(U256::from(100_000_000_000u64)); // 100 CSPR minimum
        self.staking_apy.set(1200); // 12% APY
        self.paused.set(false);
        
        // Initialize burn metrics
        let initial_metrics = BurnMetrics {
            total_fees_burned: U256::zero(),
            transactions_count: 0,
            last_burn_timestamp: 0,
        };
        self.burn_metrics.set(initial_metrics);
    }
    
    #[odra(payable)]
    pub fn stake_cspr(&mut self) {
        let caller = self.env().caller();
        let amount = self.env().attached_value();
        
        require!(!self.paused.get_or_default(), "Contract is paused");
        require!(amount >= self.min_stake_amount.get_or_default(), "Amount below minimum");
        
        // Calculate vCSPR to mint based on current exchange rate
        let exchange_rate = self.exchange_rate.get_or_default();
        let vcspr_to_mint = amount * U256::from(1_000_000_000_000_000_000u64) / exchange_rate;
        
        // Update user position
        let mut position = self.positions.get(&caller).unwrap_or_else(|| StakePosition {
            user: caller,
            cspr_amount: U256::zero(),
            vcspr_amount: U256::zero(),
            timestamp: self.env().get_block_time(),
            rewards_earned: U256::zero(),
        });
        
        position.cspr_amount += amount;
        position.vcspr_amount += vcspr_to_mint;
        position.timestamp = self.env().get_block_time();
        
        self.positions.set(&caller, position);
        
        // Update balances
        let current_balance = self.user_vcspr_balance.get(&caller).unwrap_or_default();
        self.user_vcspr_balance.set(&caller, current_balance + vcspr_to_mint);
        
        // Update totals
        let total_staked = self.total_cspr_staked.get_or_default();
        let total_supply = self.total_vcspr_supply.get_or_default();
        
        self.total_cspr_staked.set(total_staked + amount);
        self.total_vcspr_supply.set(total_supply + vcspr_to_mint);
        
        // Update burn metrics
        self.update_burn_metrics();
        
        self.env().emit_event("StakeDeposited", &(caller, amount, vcspr_to_mint));
    }
    
    pub fn unstake_cspr(&mut self, vcspr_amount: U256) {
        let caller = self.env().caller();
        
        require!(!self.paused.get_or_default(), "Contract is paused");
        
        let user_balance = self.user_vcspr_balance.get(&caller).unwrap_or_default();
        require!(user_balance >= vcspr_amount, "Insufficient vCSPR balance");
        
        // Calculate CSPR to return based on current exchange rate
        let exchange_rate = self.exchange_rate.get_or_default();
        let cspr_to_return = vcspr_amount * exchange_rate / U256::from(1_000_000_000_000_000_000u64);
        
        // Update user position
        if let Some(mut position) = self.positions.get(&caller) {
            position.vcspr_amount -= vcspr_amount;
            position.cspr_amount -= cspr_to_return;
            self.positions.set(&caller, position);
        }
        
        // Update balances
        self.user_vcspr_balance.set(&caller, user_balance - vcspr_amount);
        
        // Update totals
        let total_staked = self.total_cspr_staked.get_or_default();
        let total_supply = self.total_vcspr_supply.get_or_default();
        
        self.total_cspr_staked.set(total_staked - cspr_to_return);
        self.total_vcspr_supply.set(total_supply - vcspr_amount);
        
        // Transfer CSPR back to user
        self.env().transfer_tokens(&caller, &cspr_to_return);
        
        // Update burn metrics
        self.update_burn_metrics();
        
        self.env().emit_event("StakeWithdrawn", &(caller, cspr_to_return, vcspr_amount));
    }
    
    pub fn update_rewards(&mut self) {
        require!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        
        let total_staked = self.total_cspr_staked.get_or_default();
        if total_staked == U256::zero() {
            return;
        }
        
        // Calculate rewards based on APY (simplified daily compounding)
        let apy = self.staking_apy.get_or_default();
        let daily_rate = apy / 365; // basis points per day
        let rewards = total_staked * U256::from(daily_rate) / U256::from(10000);
        
        // Update exchange rate to reflect rewards
        let total_supply = self.total_vcspr_supply.get_or_default();
        if total_supply > U256::zero() {
            let new_total_value = total_staked + rewards;
            let new_exchange_rate = new_total_value * U256::from(1_000_000_000_000_000_000u64) / total_supply;
            self.exchange_rate.set(new_exchange_rate);
        }
        
        let total_rewards = self.total_rewards_earned.get_or_default();
        self.total_rewards_earned.set(total_rewards + rewards);
        
        self.env().emit_event("RewardsUpdated", &rewards);
    }
    
    fn update_burn_metrics(&mut self) {
        let mut metrics = self.burn_metrics.get_or_default();
        metrics.transactions_count += 1;
        metrics.last_burn_timestamp = self.env().get_block_time();
        // In real implementation, would track actual fee burning
        metrics.total_fees_burned += U256::from(1_000_000_000u64); // Placeholder
        self.burn_metrics.set(metrics);
    }
    
    // View functions
    pub fn get_user_position(&self, user: Address) -> Option<StakePosition> {
        self.positions.get(&user)
    }
    
    pub fn get_vcspr_balance(&self, user: Address) -> U256 {
        self.user_vcspr_balance.get(&user).unwrap_or_default()
    }
    
    pub fn get_exchange_rate(&self) -> U256 {
        self.exchange_rate.get_or_default()
    }
    
    pub fn get_total_staked(&self) -> U256 {
        self.total_cspr_staked.get_or_default()
    }
    
    pub fn get_burn_metrics(&self) -> BurnMetrics {
        self.burn_metrics.get_or_default()
    }
    
    pub fn calculate_apy(&self) -> u32 {
        self.staking_apy.get_or_default()
    }
    
    // Admin functions
    pub fn pause(&mut self) {
        require!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        self.paused.set(true);
    }
    
    pub fn unpause(&mut self) {
        require!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        self.paused.set(false);
    }
}