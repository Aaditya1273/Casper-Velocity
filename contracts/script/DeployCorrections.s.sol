// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/MockBUIDL.sol";
import "../src/PasskeyRegistry.sol";

contract DeployCorrections is Script {
    function run() external {
        address complianceRegistry = 0x464D37393C8D3991b493DBb57F5f3b8c31c7Fa60;
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy modified MockBUIDL
        MockBUIDL mockBuidl = new MockBUIDL(complianceRegistry);
        console.log("MockBUIDL deployed at:", address(mockBuidl));

        // Deploy modified PasskeyRegistry
        PasskeyRegistry passkeyRegistry = new PasskeyRegistry();
        console.log("PasskeyRegistry deployed at:", address(passkeyRegistry));

        vm.stopBroadcast();
    }
}
