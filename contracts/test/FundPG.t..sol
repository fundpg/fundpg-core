// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/FundPG.sol";

interface Aave{
    function deposit ( address asset, uint256 amount, address onBehalfOf, uint16 referralCode ) external;
    function withdraw ( address asset, uint256 amount, address to ) external returns ( uint256 );
}


interface Dai {
    function balanceOf(address) external view returns (uint256);
    function version() external view returns (string memory);
    function mint(address account, uint256 amount) external;
    function approve(address spender, uint256 amount) external returns (bool);
}

interface aDai {
    function balanceOf(address user) external view returns (uint256);
}


contract FundPGTest is Test {
    uint256 mainnetFork;
    FundPG public vault;
    Aave aave = Aave(0x4bd5643ac6f66a5237E18bfA7d47cF22f1c9F210);
    Dai dai = Dai(0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33);
    // aDai atokenContract = aDai(0x028171bCA77440897B824Ca71D1c56caC55b68A3);
    
    address vaultAddress;
    address depositToken = 0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33; // DAI
    address strategyAddress = 0x4bd5643ac6f66a5237E18bfA7d47cF22f1c9F210; // Aave Lending Pool V2
    address myAddress = 0x0c1514024c4A847907FbdB8eA0Dd95a4eeAe9237;
    uint256 MAX_INT = 2**256 - 1;

    function setUp() public {
        mainnetFork = vm.createFork("https://rpc.ankr.com/eth_goerli");
        vault = new FundPG(depositToken,strategyAddress);
        vm.makePersistent(address(vault));
        vm.selectFork(mainnetFork);
        vm.startBroadcast(myAddress);
        vaultAddress = address(vault);
    }

    function testUserDAIBalance() public  {
        // Approve vault to spend unlimited DAI
        dai.approve(vaultAddress, MAX_INT);

        // Deposit 30 DAI to vault 
        vault.depositUnderlyingOnBehalf(30000000000000000000, 5);

        // // Get users struct and print
        (uint256 userAllocation, uint256 userPrincipal, uint256 initialLiquidityIndex) = vault.users(myAddress);
        emit log_named_uint("user allocation", userAllocation);
        emit log_named_uint("user principal ", userPrincipal);
        emit log_named_uint("user initial liquidity index", initialLiquidityIndex);


        (uint256 totalValue, uint256 userWithdrawAmount, uint256 donatedYield) = vault.getUserBalance(myAddress);
        emit log_named_uint("total value", totalValue);
        emit log_named_uint("user withdraw amount", userWithdrawAmount);
        emit log_named_uint("donated yield", donatedYield);

        emit log_named_uint("", 0);

        // Jumps forward blocks
        vm.warp(block.timestamp + 100000);

        (userAllocation, userPrincipal, initialLiquidityIndex) = vault.users(myAddress);
        emit log_named_uint("user allocation", userAllocation);
        emit log_named_uint("user principal ", userPrincipal);
        emit log_named_uint("user initial liquidity index", initialLiquidityIndex);

        

        (totalValue, userWithdrawAmount, donatedYield) = vault.getUserBalance(myAddress);
        emit log_named_uint("total value", totalValue);
        emit log_named_uint("user withdraw amount", userWithdrawAmount);
        emit log_named_uint("donated yield", donatedYield);
     
        // Withdraw 95% DAI to user and 5% DAI to vault
        // vault.withdrawAllUnderlyingOnBehalf();


    }
}
