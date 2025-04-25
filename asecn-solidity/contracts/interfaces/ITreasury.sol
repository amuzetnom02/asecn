// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITreasury {
    function processAction(bytes calldata actionData) external;
    function withdrawToken(address token, address to, uint256 amount) external;
}
