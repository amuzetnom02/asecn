// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Interfaces/IEvolver.sol";

/**
 * @title Evolver
 * @notice Handles proposals for upgrades and contract changes.
 */
contract Evolver is IEvolver {
    address public asecn;
    address public owner;

    struct Proposal {
        address proposer;
        string description;
        bytes upgradeData;
        bool executed;
    }

    Proposal[] public proposals;

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _asecn) {
        asecn = _asecn;
        owner = msg.sender;
    }

    function proposeUpgrade(string calldata description, bytes calldata upgradeData) external override returns (uint256) {
        proposals.push(Proposal({
            proposer: msg.sender,
            description: description,
            upgradeData: upgradeData,
            executed: false
        }));
        uint256 proposalId = proposals.length - 1;
        emit ProposalCreated(proposalId, msg.sender, description);
        return proposalId;
    }

    function executeUpgrade(uint256 proposalId) external override onlyOwner {
        Proposal storage prop = proposals[proposalId];
        require(!prop.executed, "Already executed");
        // In a real system, upgradeData would be used to perform upgrades
        prop.executed = true;
        emit ProposalExecuted(proposalId);
    }

    function getProposal(uint256 proposalId) external view override returns (address, string memory, bytes memory, bool) {
        Proposal storage prop = proposals[proposalId];
        return (prop.proposer, prop.description, prop.upgradeData, prop.executed);
    }

    function proposalCount() external view override returns (uint256) {
        return proposals.length;
    }
}
