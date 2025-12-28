use casper_velocity_contracts::YieldAggregatorContract;
use odra::casper_contract;

#[casper_contract]
fn main() {
    YieldAggregatorContract::deploy();
}