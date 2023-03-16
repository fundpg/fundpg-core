// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "v2-contracts/contracts/interfaces/IAlchemistV2.sol";

contract FundPGAlchemix {
    uint256 constant MAX_INT = 2**256 - 1;
    address public charityAddress;
    IERC20 public depositToken;
    IAlchemistV2 public strategyAddress;

    mapping (address => uint256) public userAllocation;
    mapping (address => uint256) public userPrincipal;
    mapping (address => uint256) public userDonation;

    constructor(address _depositToken, address _strategyAddress, address _charityAddress) {
        depositToken = IERC20(_depositToken);
        strategyAddress = IAlchemistV2(_strategyAddress);
        charityAddress = _charityAddress;
    }

    event donation(address indexed user, uint256 amount);

    function deposit(uint256 depositAmount, uint256 allocationPercentage) public {
    // Check that deposit is positive, vault has allowances to transfer tokens from caller, allocation is between 0 and 100 and user has not deposited before 
    uint256 allowance = depositToken.allowance(msg.sender, address(strategyAddress));
    require(depositAmount > 0, "You need to deposit at least some tokens");
    require(allowance >= depositAmount, "Insufficient token allowances");
    require(allocationPercentage >= 0 && allocationPercentage <= 100, "Allocation percentage must be between 0 and 100");
    require(userPrincipal[msg.sender] == 0, "User has already deposited. Please withdraw first.");

    // Deposit into vault on behalf of user
    strategyAddress.deposit(address(depositToken), depositAmount, msg.sender);

    // Approve vault to mint debt on behalf of user
    address debtToken = strategyAddress.debtToken();
    strategyAddress.approveMint(address(this), MAX_INT);

    // Update userAllocation, userPrincipal
    userAllocation[msg.sender] = allocationPercentage;
    userPrincipal[msg.sender] = strategyAddress.totalValue(msg.sender);
    }

    function donate() public {
        // Require that user has deposited
        require(userPrincipal[msg.sender] > 0, "User has not deposited");

        // Get user's total yield and donated amount
        uint256 totalValue = strategyAddress.totalValue(msg.sender);
        uint256 totalYield = totalValue - userPrincipal[msg.sender];

        uint256 remainingYield = totalYield - userDonation[msg.sender];

        // Donate x% of user's yield to charity
        uint256 donationAmount = remainingYield * userAllocation[msg.sender] / 10;

        // Borrow donationAmount from vault and transfer to charity
        strategyAddress.mint(donationAmount, charityAddress);
        emit donation(msg.sender, donationAmount);

        // Update userDonation
        userDonation[msg.sender] += donationAmount;
    }
}