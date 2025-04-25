// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Interfaces/IActionExecutor.sol";
import "../Interfaces/ITreasury.sol";

/**
 * @title ActionExecutor
 * @notice Executes approved actions based on ASECN decisions.
 */
contract ActionExecutor is IActionExecutor {
    address public asecn;
    address public treasury;
    address public owner;

    event ActionPerformed(address indexed executor, bytes actionData);

    modifier onlyASECN() {
        require(msg.sender == asecn, "Only ASECN");
        _;
    }

    constructor(address _asecn, address _treasury) {
        asecn = _asecn;
        treasury = _treasury;
        owner = msg.sender;
    }

    function performAction(bytes calldata actionData) external override onlyASECN {
        // Example: decode action and interact with Treasury
        // (actual action logic would be more complex and secure)
        ITreasury(treasury).processAction(actionData);
        emit ActionPerformed(msg.sender, actionData);
    }

    // Update treasury address if needed
    function updateTreasury(address newTreasury) external {
        require(msg.sender == owner, "Not authorized");
        treasury = newTreasury;
    }
}
