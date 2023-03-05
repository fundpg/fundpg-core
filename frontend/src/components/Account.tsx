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
    <p>
      {ensName ?? address}
      {ensName ? ` (${address})` : null}
      <br/>
      <small>Note: make sure to change to Goerli network to test</small>
      <br/>
      {!isBalanceLoading && `Balance: ${balanceData}`}
      <br/> <br/>
      <input type="text" value={approvalVal} onChange={(e) => setApprovalVal(e.target.value)} placeholder="Enter approval amount" /> 
      <button disabled={!writeDaiApprove} onClick={() => writeDaiApprove?.()}>
        Approve DAI
      </button>
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
      <br/>
      <br/>
      <input type="text" value={depositVal} onChange={(e) => setDepositVal(e.target.value)} placeholder="Enter deposit amount" /> 
      <input type="text" value={allocationVal} onChange={(e) => setAllocationVal(e.target.value)} placeholder="Enter allocation amount" /> 
      <button disabled={!writeDeposit} onClick={() => writeDeposit?.()}>
        depositUnderlyIntOnBehelaf (FundPG)
      </button>
      {depositError && (
        <div>An error occurred preparing the transaction: {depositError.message}</div>
      )}
      <br/>
      <br/>
      <button disabled={!writeWithdraw} onClick={() => writeWithdraw?.()}>
        withdrawAllUnderlyingOnBehalf (FundPG)
      </button>
      {withdrawError && (
        <div>An error occurred preparing the transaction: {withdrawError.message}</div>
      )}
    </p>
  )
}
