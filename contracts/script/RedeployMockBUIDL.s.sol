// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/MockBUIDL.sol";

contract RedeployMockBUIDL is Script {
    function run() external {
        address complianceRegistry = 0xD39184bd636D5f18604e696C149DdAF770023BEA;

        vm.startBroadcast();

        // Deploy new MockBUIDL
        MockBUIDL mockBuidl = new MockBUIDL(complianceRegistry);

        console.log("MockBUIDL deployed at:", address(mockBuidl));
        console.log("Please update NEXT_PUBLIC_MOCK_BUIDL in .env to:", address(mockBuidl));

        vm.stopBroadcast();
    }
}
