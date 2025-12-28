use casper_velocity_contracts::LiquidStakingContract;
use odra::casper_contract;

#[casper_contract]
fn main() {
    LiquidStakingContract::deploy();
}