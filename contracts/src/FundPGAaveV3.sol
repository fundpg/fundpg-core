// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "aave-protocol/contracts/libraries/WadRayMath.sol";
import "aave-v3-core/contracts/interfaces/IPool.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

struct UserInfo{
    uint256 userAllocation;
    uint256 userPrincipal;
    uint128 initialLiquidityIndex;
    uint256 userDonations;
}

interface IAttestationStation {
  function attest ( address _about, bytes32 _key, bytes memory _val ) external;
}


contract FundPGAaveV3 {
    using WadRayMath for uint256;
    uint256 MAX_INT = 2**256 - 1;
    IPool public strategy;
    IERC20 public depositToken;
    address public admin;
    mapping (address => UserInfo) public users;

    constructor(address _depositToken, address _strategyAddress, address _admin) {
        depositToken = IERC20(_depositToken);
        strategy = IPool(_strategyAddress);
        admin = _admin;
    }

    event donation(address indexed user, uint256 amount);

    function getCurrentLiquidityIndex() public view returns (uint128 liquidityIndex) {
       liquidityIndex = strategy.getReserveData(address(depositToken)).liquidityIndex;
    }

    function getUserBalance(address userAddress) public view returns(uint256 totalValue, uint256 userWithdrawAmount, uint256 donatedYield) {
    // Require that user has deposited
    require(users[userAddress].userPrincipal > 0, "User has not deposited");

    // Retrieve principal + interest of user's deposit
    uint128 liquidityIndex = getCurrentLiquidityIndex();
    uint256 initialScaledBalance = WadRayMath.rayDiv(users[userAddress].userPrincipal,users[userAddress].initialLiquidityIndex);
    totalValue = WadRayMath.rayMul(initialScaledBalance, liquidityIndex);
    userWithdrawAmount = totalValue;
    donatedYield = 0;

    uint256 interest = 0;
    if (liquidityIndex > users[userAddress].initialLiquidityIndex) {
        interest = totalValue - users[userAddress].userPrincipal;
        donatedYield = interest * users[userAddress].userAllocation / 100;
        userWithdrawAmount = totalValue - donatedYield;
        }
    }

    function depositUnderlyingOnBehalf(uint256 depositAmount, uint256 allocationPercentage) public {
        // Check that deposit is positive, vault has allowances to transfer tokens from caller, allocation is between 0 and 100 and user has not deposited before 
        uint256 allowance = depositToken.allowance(msg.sender, address(this));
        require(depositAmount > 0, "You need to deposit at least some tokens");
        require(allowance >= depositAmount, "Insufficient token allowances");
        require(allocationPercentage >= 0 && allocationPercentage <= 100, "Allocation percentage must be between 0 and 100");
        require(users[msg.sender].userPrincipal == 0, "User has already deposited. Please withdraw first.");

        // Transfer depositAmount from user to this contract
        depositToken.transferFrom(msg.sender, address(this), depositAmount);

        // Approve vault to transfer tokens to strategy
        depositToken.approve(address(strategy), MAX_INT);

        // Deposit into vault 
        strategy.deposit(address(depositToken), depositAmount, address(this), 0);

        // Update userAllocation, userPrincipal, initialLiquidityIndex
        users[msg.sender].userAllocation = allocationPercentage;
        users[msg.sender].userPrincipal = depositAmount;
        users[msg.sender].initialLiquidityIndex =  getCurrentLiquidityIndex();

    }

    function withdrawAllUnderlyingOnBehalf() public {
        (, uint256 userWithdrawAmount, uint256 donatedYield) = getUserBalance(msg.sender);
        if (donatedYield !=0) {
            strategy.withdraw(address(this), donatedYield, address(this));
        }
        strategy.withdraw(address(this), userWithdrawAmount, msg.sender);

        // Reset userAllocation, userPrincipal, initialLiquidityIndex. Increment userDonations
        users[msg.sender].userAllocation = 0;
        users[msg.sender].userPrincipal = 0;
        users[msg.sender].initialLiquidityIndex = 0;
        users[msg.sender].userDonations += donatedYield;

        // Emit event
        emit donation(msg.sender, donatedYield);

    }

    function transferYield(address dstAddress, uint256 amount) public {
        // Only admin can transfer yield
        require(msg.sender == admin, "Only admin can transfer yield");
        depositToken.transfer(dstAddress, amount);
    }

    function createAttestation() public {
        IAttestationStation attestationStation = IAttestationStation(0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77);
        bytes32 key = bytes32(abi.encode("fundpg.donations.amount"));
        bytes memory value = bytes(abi.encode(users[msg.sender].userDonations));
        attestationStation.attest(msg.sender, key, value);
    }



}
