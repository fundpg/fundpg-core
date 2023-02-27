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


contract FundPG {
    uint256 MAX_INT = 2**256 - 1;
    address public depositToken;
    address public aaveToken;
    address public strategyAddress;
    address public admin;
    mapping (address => uint256) public userAllocation;
    mapping (address => uint256) public userPrincipal;

    constructor(address _depositToken, address _aaveToken, address _strategyAddress) {
        depositToken = _depositToken;
        aaveToken = _aaveToken;
        strategyAddress = _strategyAddress;
        admin = msg.sender;
    }

    function depositUnderlyingOnBehalf(uint256 depositAmount, uint256 allocationPercentage) public {
        // Check that vault has allowances to transfer tokens from caller 
        Erc20 erc20Contract = Erc20(depositToken);
        require(depositAmount > 0, "You need to deposit at least some tokens");
        uint256 allowance = erc20Contract.allowance(msg.sender, address(this));
        require(allowance >= depositAmount, "Insufficient token allowances");

        // Check that allocationPercentage is between 0 and 100
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
        userAllocation[msg.sender] = allocationPercentage;
        userPrincipal[msg.sender] = WadRayMath.wadDiv(depositAmount, liquidityIndex);
    }

    function withdrawAllUnderlyingOnBehalf() public {
        AaveLendingPool aaveContract = AaveLendingPool(strategyAddress);   
        Erc20 atokenContract = Erc20(aaveToken);
        
        // Retrieve principal + interest of user's deposit
        (, uint128 liquidityIndex, , , , , , , , , , ) = aaveContract.getReserveData(depositToken);
        uint256 totalValue = WadRayMath.wadMul(userPrincipal[msg.sender], liquidityIndex);

        // Withdraw 100- userAllocation[msg.sender] % of yield to msg.sender
        uint256 donatedYield = (totalValue - userPrincipal[msg.sender]) * (100 - userAllocation[msg.sender]) / 100;
        uint256 userWithdrawAmount = totalValue - donatedYield;

        // If donatedYield is not 0, send it to vault
        if (donatedYield != 0) {
             aaveContract.withdraw(depositToken, donatedYield, address(this));
        }
        aaveContract.withdraw(depositToken, userWithdrawAmount,msg.sender);

        // Reset userAllocation, userPrincipal
        userAllocation[msg.sender] = 0;
        userPrincipal[msg.sender] = 0;
    }

    function transferYield(address dstAddress, uint256 amount) public {
        // Only admin can transfer yield
        require(msg.sender == admin, "Only admin can transfer yield");
        Erc20 erc20Contract = Erc20(depositToken);
        erc20Contract.transfer(dstAddress, amount);
    }


}
