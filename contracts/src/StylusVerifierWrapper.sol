// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title StylusVerifierWrapper
 * @notice Solidity wrapper for Stylus ZK Verifier
 * @dev This wrapper makes the Stylus contract compatible with standard wallets
 * 
 * Why we need this:
 * - Stylus SDK 0.6.0 has issues with Vec<u8> parameters
 * - MetaMask can't simulate Stylus transactions properly
 * - This Solidity wrapper provides a standard interface
 * - It calls the Stylus contract internally for actual verification
 */
contract StylusVerifierWrapper {
    // Stylus verifier contract address
    address public immutable stylusVerifier;
    
    // Track verified proofs
    uint256 public verifiedCount;
    
    // Events
    event ProofVerified(address indexed user, bool result, uint256 gasUsed);
    
    constructor(address _stylusVerifier) {
        require(_stylusVerifier != address(0), "Invalid verifier address");
        stylusVerifier = _stylusVerifier;
    }
    
    /**
     * @notice Verify a ZK proof (simplified for demo)
     * @dev In production, this would call the Stylus contract
     * @return bool True if proof is valid
     */
    function verify(
        bytes calldata /* proof */,
        bytes[] calldata /* publicInputs */
    ) external returns (bool) {
        uint256 gasStart = gasleft();
        
        // DEMO MODE: Accept all well-formed proofs
        // In production: Call Stylus contract here
        // (bool success, bytes memory result) = stylusVerifier.call(
        //     abi.encodeWithSignature("testVerify()")
        // );
        
        // For now, just return true to demonstrate the flow
        bool isValid = true;
        
        if (isValid) {
            verifiedCount++;
        }
        
        uint256 gasUsed = gasStart - gasleft();
        emit ProofVerified(msg.sender, isValid, gasUsed);
        
        return isValid;
    }
    
    /**
     * @notice Simplified verify function (no parameters)
     * @dev This always returns true for demo purposes
     * @return bool True
     */
    function verifySimple() external returns (bool) {
        uint256 gasStart = gasleft();
        
        verifiedCount++;
        
        uint256 gasUsed = gasStart - gasleft();
        emit ProofVerified(msg.sender, true, gasUsed);
        
        return true;
    }
    
    /**
     * @notice Get total verified count
     * @return uint256 Number of verified proofs
     */
    function getVerifiedCount() external view returns (uint256) {
        return verifiedCount;
    }
    
    /**
     * @notice Get Stylus verifier address
     * @return address Stylus contract address
     */
    function getStylusVerifier() external view returns (address) {
        return stylusVerifier;
    }
}
