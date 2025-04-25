// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEvolver {
    function proposeUpgrade(string calldata description, bytes calldata upgradeData) external returns (uint256);
    function executeUpgrade(uint256 proposalId) external;
    function getProposal(uint256 proposalId) external view returns (address, string memory, bytes memory, bool);
    function proposalCount() external view returns (uint256);
}
