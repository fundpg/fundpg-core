import { useState } from 'react'
import { useAccount, useEnsName, usePrepareContractWrite, useContractWrite, useContractRead } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })

  const [approvalVal, setApprovalVal] = useState('0')
  const [depositVal, setDepositVal] = useState('0')
  const [allocationVal, setAllocationVal] = useState('0')

  const abi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
  const fundPgABI = [{"inputs":[{"internalType":"address","name":"_depositToken","type":"address"},{"internalType":"address","name":"_strategyAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"donation","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"depositToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"depositAmount","type":"uint256"},{"internalType":"uint256","name":"allocationPercentage","type":"uint256"}],"name":"depositUnderlyingOnBehalf","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"}],"name":"getUserBalance","outputs":[{"internalType":"uint256","name":"totalValue","type":"uint256"},{"internalType":"uint256","name":"userWithdrawAmount","type":"uint256"},{"internalType":"uint256","name":"donatedYield","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"strategyAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dstAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferYield","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"userAllocation","type":"uint256"},{"internalType":"uint256","name":"userPrincipal","type":"uint256"},{"internalType":"uint128","name":"initialLiquidityIndex","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawAllUnderlyingOnBehalf","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  
  const { data: balanceData, isError: isBalanceError, isLoading: isBalanceLoading } = useContractRead({
    address: '0x3a09D405F23373c590e1DD247B616d26B6B8d5C4',
    abi: fundPgABI,
    functionName: 'getUserBalance',
    args: [address]
  })
  
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

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-gray-900 text-white font-bold">FundPG</div>
      <div className="p-4">
        <p className="text-gray-800">
          {ensName ?? address}
          {ensName ? ` (${address})` : null}
        </p>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Approval Amount:</label>
          <input className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={approvalVal} onChange={(e) => setApprovalVal(e.target.value)} placeholder="Enter approval amount" />
        </div>
        <button disabled={!writeDaiApprove} onClick={() => writeDaiApprove?.()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Approve
        </button>
        {error && (
          <div className="text-red-500">An error occurred preparing the transaction: {error.message}</div>
        )}
        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">Deposit Amount: {depositVal}</label>
          <input className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" type="range" value={depositVal} onChange={(e) => setDepositVal(e.target.value)} placeholder="Enter deposit amount" />
          <label className="block text-gray-700 font-bold mb-2">Allocation Amount: {`${allocationVal}%`}</label>
          <input className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="range" value={allocationVal} onChange={(e) => setAllocationVal(e.target.value)} placeholder="Enter allocation amount" />
        </div>
        <button disabled={!writeDeposit} onClick={() => writeDeposit?.()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Deposit
        </button>
        {depositError && (
          <div className="text-red-500">An error occurred preparing the transaction: {depositError.message}</div>
        )}
        <button disabled={!writeWithdraw} onClick={() => writeWithdraw?.()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Withdraw
        </button>
        {withdrawError && (
          <div className="text-red-500">An error occurred preparing the transaction: {withdrawError.message}</div>
        )}
        <p className="text-gray-600 text-xs mt-4">Note: make sure to change to Goerli network to test</p>
        {/* {!isBalanceLoading &&  <p className="text-gray-800 mt-4"> Balance: {balanceData} </p> } */}
        
      <br />
  </div>
</div>
)
}
