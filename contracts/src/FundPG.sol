// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "aave-protocol/contracts/libraries/WadRayMath.sol";

interface Erc20 {
    function balanceOf(address) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function scaledBalanceOf ( address user ) external view returns ( uint256 );
}

interface AaveLendingPool{
    function getReserveData ( address asset ) external view returns (uint256, uint128, uint128, uint128, uint128, uint128, uint40, address, address, address, address, uint8);
    function deposit ( address asset, uint256 amount, address onBehalfOf, uint16 referralCode ) external;
    function withdraw ( address asset, uint256 amount, address to ) external returns ( uint256 );
}

struct UserInfo{
    uint256 userAllocation;
    uint256 userPrincipal;
    uint256 initialLiquidityIndex;
}


contract FundPG {
    uint256 MAX_INT = 2**256 - 1;
    address public depositToken;
    address public strategyAddress;
    address public admin;
    mapping (address => UserInfo) public users;

    constructor(address _depositToken, address _strategyAddress) {
        depositToken = _depositToken;
        strategyAddress = _strategyAddress;
        admin = msg.sender;
    }

    event donation(address indexed user, uint256 amount);

    function getUserBalance(address userAddress) public view returns(uint256 totalValue, uint256 userWithdrawAmount, uint256 donatedYield) {
        AaveLendingPool aaveContract = AaveLendingPool(strategyAddress);   

         // Retrieve principal + interest of user's deposit
        (, uint128 liquidityIndex, , , , , , , , , , ) = aaveContract.getReserveData(depositToken);
        totalValue = WadRayMath.wadMul(WadRayMath.wadDiv(users[userAddress].userPrincipal,users[userAddress].initialLiquidityIndex), liquidityIndex);

        // Withdraw 100- userAllocation[userAddress] % of yield to msg.sender
        donatedYield = (totalValue - users[userAddress].userPrincipal) * users[userAddress].userAllocation / 100;
        userWithdrawAmount = totalValue - donatedYield;
    }

    function depositUnderlyingOnBehalf(uint256 depositAmount, uint256 allocationPercentage) public {
        // Check that deposit is positive, vault has allowances to transfer tokens from caller and allocation is between 0 and 100 
        Erc20 erc20Contract = Erc20(depositToken);
        uint256 allowance = erc20Contract.allowance(msg.sender, address(this));
        require(depositAmount > 0, "You need to deposit at least some tokens");
        require(allowance >= depositAmount, "Insufficient token allowances");
        require(allocationPercentage >= 0 && allocationPercentage <= 100, "Allocation percentage must be between 0 and 100");

        // Transfer depositAmount from msg.sender to vault
        erc20Contract.transferFrom(msg.sender, address(this), depositAmount);

        // Approve vault to transfer tokens to strategy
        erc20Contract.approve(strategyAddress, MAX_INT);

        // depositUnderlying to strategy address
        AaveLendingPool aaveContract = AaveLendingPool(strategyAddress);
        aaveContract.deposit(depositToken, depositAmount, address(this), 0);

        // Get current liquidity index
        (, uint128 liquidityIndex, , , , , , , , , , ) = aaveContract.getReserveData(depositToken);


        // Update userAllocation, userPrincipal. userPrincipal is the scaledBalanceOf the user's deposit.
        users[msg.sender].userAllocation = allocationPercentage;
        users[msg.sender].userPrincipal = depositAmount;
        users[msg.sender].initialLiquidityIndex = liquidityIndex;
    }

    function withdrawAllUnderlyingOnBehalf() public {
        AaveLendingPool aaveContract = AaveLendingPool(strategyAddress);
        (, uint256 userWithdrawAmount, uint256 donatedYield)  = getUserBalance(msg.sender);
        // If donatedYield is not 0, send it to vault
        if (donatedYield != 0) {
             aaveContract.withdraw(depositToken, donatedYield, address(this));
        }
        aaveContract.withdraw(depositToken, userWithdrawAmount, msg.sender);

        // Reset userAllocation, userPrincipal, initial liquidity index
        users[msg.sender].userAllocation = 0;
        users[msg.sender].userPrincipal = 0;
        users[msg.sender].initialLiquidityIndex = 0;

        // Emit event
        emit donation(msg.sender, donatedYield);
    }

    function transferYield(address dstAddress, uint256 amount) public {
        // Only admin can transfer yield
        require(msg.sender == admin, "Only admin can transfer yield");
        Erc20 erc20Contract = Erc20(depositToken);
        erc20Contract.transfer(dstAddress, amount);
    }


}
