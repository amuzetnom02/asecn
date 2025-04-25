// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Interfaces/ITreasury.sol";

/**
 * @title Treasury
 * @notice Manages ETH, tokens, and payouts for the ASECN DAO.
 */
contract Treasury is ITreasury {
    address public asecn;
    address public evolver;
    address public owner;

    event FundsReceived(address indexed from, uint256 amount);
    event FundsSent(address indexed to, uint256 amount);
    event TokenSent(address indexed token, address indexed to, uint256 amount);

    modifier onlyASECNOrEvolver() {
        require(msg.sender == asecn || msg.sender == evolver, "Not authorized");
        _;
    }

    constructor(address _asecn, address _evolver) {
        asecn = _asecn;
        evolver = _evolver;
        owner = msg.sender;
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    function processAction(bytes calldata actionData) external override onlyASECNOrEvolver {
        // Example: decode actionData and send ETH or tokens
        // (actual implementation would decode and validate actionData)
        // For demonstration, send all ETH to a specified address
        (address payable to, uint256 amount) = abi.decode(actionData, (address, uint256));
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit FundsSent(to, amount);
    }

    // Withdraw tokens (ERC20) - for demonstration
    function withdrawToken(address token, address to, uint256 amount) external onlyASECNOrEvolver {
        (bool success, bytes memory data) = token.call(abi.encodeWithSignature("transfer(address,uint256)", to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Token transfer failed");
        emit TokenSent(token, to, amount);
    }
}
