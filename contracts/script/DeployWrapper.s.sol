// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/StylusVerifierWrapper.sol";

contract DeployWrapper is Script {
    function run() external {
        // Stylus verifier address (deployed earlier)
        address stylusVerifier = 0x7BCa267bFfC69Fff991917f72d0C6B4ce9117343;
        
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy wrapper
        StylusVerifierWrapper wrapper = new StylusVerifierWrapper(stylusVerifier);
        
        console.log("StylusVerifierWrapper deployed at:", address(wrapper));
        console.log("Stylus verifier:", wrapper.getStylusVerifier());
        
        vm.stopBroadcast();
    }
}
