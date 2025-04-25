// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IActionExecutor {
    function performAction(bytes calldata actionData) external;
}
