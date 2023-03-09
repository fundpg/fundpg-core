import Image from 'next/image'
import { useState } from 'react'
import { useAccount, useEnsName, usePrepareContractWrite, useContractWrite, useContractRead } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })

  const [approvalVal, setApprovalVal] = useState('0')
  const [depositVal, setDepositVal] = useState('0')
  const [allocationVal, setAllocationVal] = useState('0')

  const aaveabi = [{"inputs":[{"internalType":"contract ILendingPoolAddressesProvider","name":"addressesProvider","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ADDRESSES_PROVIDER","outputs":[{"internalType":"contract ILendingPoolAddressesProvider","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllATokens","outputs":[{"components":[{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"tokenAddress","type":"address"}],"internalType":"struct AaveProtocolDataProvider.TokenData[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllReservesTokens","outputs":[{"components":[{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"tokenAddress","type":"address"}],"internalType":"struct AaveProtocolDataProvider.TokenData[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveConfigurationData","outputs":[{"internalType":"uint256","name":"decimals","type":"uint256"},{"internalType":"uint256","name":"ltv","type":"uint256"},{"internalType":"uint256","name":"liquidationThreshold","type":"uint256"},{"internalType":"uint256","name":"liquidationBonus","type":"uint256"},{"internalType":"uint256","name":"reserveFactor","type":"uint256"},{"internalType":"bool","name":"usageAsCollateralEnabled","type":"bool"},{"internalType":"bool","name":"borrowingEnabled","type":"bool"},{"internalType":"bool","name":"stableBorrowRateEnabled","type":"bool"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"isFrozen","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveData","outputs":[{"internalType":"uint256","name":"availableLiquidity","type":"uint256"},{"internalType":"uint256","name":"totalStableDebt","type":"uint256"},{"internalType":"uint256","name":"totalVariableDebt","type":"uint256"},{"internalType":"uint256","name":"liquidityRate","type":"uint256"},{"internalType":"uint256","name":"variableBorrowRate","type":"uint256"},{"internalType":"uint256","name":"stableBorrowRate","type":"uint256"},{"internalType":"uint256","name":"averageStableBorrowRate","type":"uint256"},{"internalType":"uint256","name":"liquidityIndex","type":"uint256"},{"internalType":"uint256","name":"variableBorrowIndex","type":"uint256"},{"internalType":"uint40","name":"lastUpdateTimestamp","type":"uint40"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveTokensAddresses","outputs":[{"internalType":"address","name":"aTokenAddress","type":"address"},{"internalType":"address","name":"stableDebtTokenAddress","type":"address"},{"internalType":"address","name":"variableDebtTokenAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"user","type":"address"}],"name":"getUserReserveData","outputs":[{"internalType":"uint256","name":"currentATokenBalance","type":"uint256"},{"internalType":"uint256","name":"currentStableDebt","type":"uint256"},{"internalType":"uint256","name":"currentVariableDebt","type":"uint256"},{"internalType":"uint256","name":"principalStableDebt","type":"uint256"},{"internalType":"uint256","name":"scaledVariableDebt","type":"uint256"},{"internalType":"uint256","name":"stableBorrowRate","type":"uint256"},{"internalType":"uint256","name":"liquidityRate","type":"uint256"},{"internalType":"uint40","name":"stableRateLastUpdated","type":"uint40"},{"internalType":"bool","name":"usageAsCollateralEnabled","type":"bool"}],"stateMutability":"view","type":"function"}];
  const abi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
  const fundPgABI = [{"inputs":[{"internalType":"address","name":"_depositToken","type":"address"},{"internalType":"address","name":"_strategyAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"donation","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"depositToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"depositAmount","type":"uint256"},{"internalType":"uint256","name":"allocationPercentage","type":"uint256"}],"name":"depositUnderlyingOnBehalf","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"}],"name":"getUserBalance","outputs":[{"internalType":"uint256","name":"totalValue","type":"uint256"},{"internalType":"uint256","name":"userWithdrawAmount","type":"uint256"},{"internalType":"uint256","name":"donatedYield","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"strategyAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dstAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferYield","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"userAllocation","type":"uint256"},{"internalType":"uint256","name":"userPrincipal","type":"uint256"},{"internalType":"uint128","name":"initialLiquidityIndex","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawAllUnderlyingOnBehalf","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  
  // const { data: aaveData } = useContractRead({
  //   address: '0x927F584d4321C1dCcBf5e2902368124b02419a1E',
  //   abi: aaveabi,
  //   functionName: 'getReserveData',
  //   args: ["0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33"]
  // })



  const { data: balanceData , isError: isBalanceError, isLoading: isBalanceLoading } = useContractRead({
    address: '0x3a09D405F23373c590e1DD247B616d26B6B8d5C4',
    abi: fundPgABI,
    functionName: 'users',
    args: [address]
  })

  // const aaveData2: any = aaveData;

  // const newdata: any = balanceData;

  // const totalValue = Number(newdata[1]) / Number(newdata[2]) * Number(aaveData2[7]);
  // const interest = totalValue - Number(newdata[1]);
  // const donatedYield = interest * Number(newdata[0]) / 100;
  // const userWithdrawAmount = totalValue - donatedYield;

  // console.log(Number(aaveData[7]))
  
  const { config, error } = usePrepareContractWrite({
    address: '0x75ab5ab1eef154c0352fc31d2428cef80c7f8b33',
    abi: abi,
    functionName: 'approve',
    args: [address, approvalVal]
  })
  const { write: writeDaiApprove } = useContractWrite(config)

  const { config: depositConfig, error: depositError } = usePrepareContractWrite({
    address: '0x3a09D405F23373c590e1DD247B616d26B6B8d5C4',
    abi: fundPgABI,
    functionName: 'depositUnderlyingOnBehalf',
    args: [parseInt(depositVal), parseInt(allocationVal)]
  })
  const { write: writeDeposit } = useContractWrite(depositConfig)

  const { config: withdrawConfig, error: withdrawError } = usePrepareContractWrite({
    address: '0x3a09D405F23373c590e1DD247B616d26B6B8d5C4',
    abi: fundPgABI,
    functionName: 'withdrawAllUnderlyingOnBehalf'
  })
  const { write: writeWithdraw } = useContractWrite(withdrawConfig)
  const [focused, setFocused] = useState('Approve')

  function renderActionDiv(){

    switch(focused){
      case 'Approve':
        return(
        <center>
          <div className="mt-5 p-2 w-64 flex flex-col justify-center items-center">
            <input
              className="rounded-md px-4 py-2 w-full text-center focus:outline-none text-lg font-medium" 
              type="number" 
              placeholder="0"
              value={approvalVal} 
              onChange={(e) => setApprovalVal(e.target.value)} 
            />
            <button 
              className="mt-5 px-4 py-2 rounded-md bg-white font-medium"
              disabled={!writeDaiApprove} 
              onClick={() => writeDaiApprove?.()}
            >
              Approve
            </button>
            {/*error && (
              <div className="text-red-500">An error occurred preparing the transaction: {error.message}</div>
            )*/}
          </div>
        </center>
        )
      case 'Deposit': 
        return(
          <div className="mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900">{`Amount: ${depositVal}`}</label>
            <input 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              type="range" 
              value={depositVal} 
              onChange={(e) => setDepositVal(e.target.value)} />

            <label className="block mb-2 text-sm font-medium text-gray-900">{`Allocation: ${allocationVal}%`}</label>
            <input 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              type="range" 
              value={allocationVal} 
              onChange={(e) => setAllocationVal(e.target.value)} />

            <button 
              className="mt-2 rounded-md bg-white text-black px-4 py-2"
              disabled={!writeDeposit} 
              onClick={() => writeDeposit?.()}>
                Deposit
            </button>
            {/*depositError && (
              <div className="text-red-500">An error occurred preparing the transaction: {depositError.message}</div>
            )*/}
          </div>
        )
      case 'Withdraw':
        return(
          <div className="mt-5">
            <center>
              <button 
                className="mt-2 rounded-md bg-white text-black px-4 py-2"
                disabled={!writeWithdraw} 
                onClick={() => writeWithdraw?.()}>
                  Withdraw All
              </button>
            </center>
            {/*withdrawError && (
              <div className="text-red-500">An error occurred preparing the transaction: {withdrawError.message}</div>
            )*/}
          </div>
        )
    }
  }

  const exampleTxnArray = [
    { amount: 'Deposited 0.64 ETH', date: '12 days ago' },
    { amount: 'Deposited 0.32 ETH', date: '26 days ago' },
    { amount: 'Deposited 0.53 ETH', date: '8 days ago' },
    { amount: 'Deposited 0.27 ETH', date: '17 days ago' },
    { amount: 'Deposited 0.76 ETH', date: '22 days ago' },
    { amount: 'Deposited 0.94 ETH', date: '3 days ago' },
    { amount: 'Deposited 0.49 ETH', date: '19 days ago' },
    { amount: 'Deposited 0.89 ETH', date: '6 days ago' },
    { amount: 'Deposited 0.12 ETH', date: '11 days ago' },
    { amount: 'Deposited 0.42 ETH', date: '28 days ago' },
  ];

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">    
      <div className="flex flex-col items-center">
        <div className="flex w-full">
          <div className="w-1/3 bg-[#D9D9D9] rounded-lg mr-2 p-5 h-48">
            <p className="text-lg font-medium">{ensName}</p>
          </div>
          <div className="w-2/3 bg-[#D9D9D9] rounded-lg p-3 h-48">
            <div className="flex justify-between rounded-lg bg-[#989898] pl-1 pr-1 pt-.5 pb-.5">
              <button 
                className={`px-2 py-1 rounded-md ${focused === 'Approve' && 'bg-[#7A7A7A] text-white'} text-gray-700 font-medium`}
                onClick={() => focused !== 'Approve' && setFocused('Approve')}>
                Approve
              </button>
              <button 
                className={`px-2 py-1 rounded-md ${focused === 'Deposit' && 'bg-[#7A7A7A] text-white'} text-gray-700 font-medium`}
                onClick={() => focused !== 'Deposit' && setFocused('Deposit')}>
                Deposit
              </button>
              <button 
                className={`px-2 py-1 rounded-md ${focused === 'Withdraw' && 'bg-[#7A7A7A] text-white'} text-gray-700 font-medium`}
                onClick={() => focused !== 'Withdraw' && setFocused('Withdraw')}>
                Withdraw
              </button>
            </div>
            {renderActionDiv()}
          </div>
        </div>
        <div className="w-full min-h-[50vh] bg-[#D9D9D9] rounded-lg mt-2 p-3 h-48 overflow-y-scroll">
          <h1 className="ml-1 p-1 font-medium text-xl">Activity</h1>
          <div className="rounded-md p-2 bg-white text-black flex flex-col">
            {exampleTxnArray.map((item, index) => {
              return(
                <div key={`${item.amount} ${item.date}`} className="mb-2 last-of-type:mb-0">
                  <p className="float-left inline-block">{item.amount.split(' ')[0]} <span className="text-red-500">{`${item.amount.split(' ')[1]} ${item.amount.split(' ')[2]}`}</span></p>
                  <p className="float-right inline-block">{item.date}</p>
                  {index !== exampleTxnArray.length - 1 && <hr className="mt-8 mb-0 border-gray-300 w-full" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
)
}
