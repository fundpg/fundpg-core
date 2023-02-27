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
    Aave aave = Aave(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);
    Dai dai = Dai(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    aDai atokenContract = aDai(0x028171bCA77440897B824Ca71D1c56caC55b68A3);
    
    address vaultAddress;
    address depositToken = 0x6B175474E89094C44Da98b954EedeAC495271d0F; // DAI
    address strategyAddress = 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9; // Aave Lending Pool V2
    address myAddress = 0xC83A986e3939f5e789c49c2Ac3D25fcF53E1DB86;
    uint256 MAX_INT = 2**256 - 1;

    function setUp() public {
        mainnetFork = vm.createFork("https://eth.llamarpc.com");
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

        // Jumps forward blocks
        vm.warp(block.timestamp + 10000);
     
        // Withdraw 95% DAI to user and 5% DAI to vault
        vault.withdrawAllUnderlyingOnBehalf();
    }
}
