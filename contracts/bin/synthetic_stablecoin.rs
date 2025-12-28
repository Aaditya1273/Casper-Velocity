use casper_velocity_contracts::SyntheticStablecoinContract;
use odra::casper_contract;

#[casper_contract]
fn main() {
    SyntheticStablecoinContract::deploy();
}