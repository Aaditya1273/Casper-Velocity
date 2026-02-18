/**
 * ArbShield ZK Verifier - Stylus Contract ABI
 * Auto-generated Solidity interface
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IZKVerifier {
    /// Initialize the verifier with an owner address
    function initialize(address owner) external;

    /// Verify a Groth16 ZK proof
    /// @param proof 256 bytes containing proof points (A, B, C)
    /// @param publicInputs Array of 32-byte field elements
    /// @return bool True if proof is valid
    function verify(bytes calldata proof, bytes[] calldata publicInputs) external returns (bool);

    /// Get total number of verified proofs
    function getVerifiedCount() external view returns (uint256);

    /// Get the owner address
    function getOwner() external view returns (address);

    /// Check if contract is initialized
    function isInitialized() external view returns (bool);
}
