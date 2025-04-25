// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Interfaces/IASECN.sol";

/**
 * @title ASECNFactory
 * @notice Facilitates the creation of new ASECN instances (clones/forks).
 */
contract ASECNFactory {
    address public owner;
    address[] public deployedASECNs;

    event ASECNCreated(address indexed asecn, address creator);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createASECN(
        address memoryCore,
        address perceptionModule,
        address actionExecutor,
        address treasury,
        address evolver
    ) external onlyOwner returns (address) {
        IASECN asecn = IASECN(
            address(new ASECN(
                memoryCore,
                perceptionModule,
                actionExecutor,
                treasury,
                evolver,
                address(this)
            ))
        );
        deployedASECNs.push(address(asecn));
        emit ASECNCreated(address(asecn), msg.sender);
        return address(asecn);
    }

    function getDeployedASECNs() external view returns (address[] memory) {
        return deployedASECNs;
    }
}
