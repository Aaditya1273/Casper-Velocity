// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IGroth16Verifier.sol";

/**
 * @title ZKVerifier
 * @notice Wrapper contract for Groth16 ZK proof verifier
 * @dev Delegates verification to a generated Solidity Groth16 verifier
 */
contract ZKVerifier is Ownable {
    /// @notice Address of the Groth16 verifier contract
    address public groth16Verifier;

    /// @notice Mapping of verified proofs
    mapping(bytes32 => bool) public verifiedProofs;

    /// @notice Mapping of user compliance attributes
    mapping(address => mapping(string => bool)) public userCompliance;

    event ProofVerified(
        address indexed user,
        string attributeType,
        bytes32 proofHash,
        uint256 gasUsed
    );

    event Groth16VerifierUpdated(address indexed oldVerifier, address indexed newVerifier);

    constructor(address _groth16Verifier) Ownable(msg.sender) {
        require(_groth16Verifier != address(0), "Invalid verifier address");
        groth16Verifier = _groth16Verifier;
    }

    /**
     * @notice Verify a Groth16 proof using the generated verifier
     * @param a Groth16 proof A
     * @param b Groth16 proof B
     * @param c Groth16 proof C
     * @param publicInputs Public inputs array
     * @param attributeType The compliance attribute being proven
     * @return success Whether the proof was verified
     */
    function verifyProof(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata publicInputs,
        string calldata attributeType
    ) external returns (bool success) {
        uint256 gasStart = gasleft();

        bool verified = IGroth16Verifier(groth16Verifier).verifyProof(a, b, c, publicInputs);
        require(verified, "Proof verification failed");

        bytes32 proofHash = keccak256(abi.encodePacked(a, b, c, publicInputs));
        verifiedProofs[proofHash] = true;
        userCompliance[msg.sender][attributeType] = true;

        uint256 gasUsed = gasStart - gasleft();

        emit ProofVerified(msg.sender, attributeType, proofHash, gasUsed);

        return true;
    }

    /**
     * @notice Check if a user has verified a specific compliance attribute
     * @param user The user address
     * @param attributeType The compliance attribute type
     * @return verified Whether the attribute is verified
     */
    function isCompliant(
        address user,
        string calldata attributeType
    ) external view returns (bool verified) {
        return userCompliance[user][attributeType];
    }

    /**
     * @notice Update the Stylus verifier address
     * @param _newVerifier The new verifier address
     */
    function updateGroth16Verifier(address _newVerifier) external onlyOwner {
        require(_newVerifier != address(0), "Invalid verifier address");
        address oldVerifier = groth16Verifier;
        groth16Verifier = _newVerifier;
        emit Groth16VerifierUpdated(oldVerifier, _newVerifier);
    }
}
