import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount, useEnsName, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useNetwork } from 'wagmi';
import { daiGoerliAbi, daiMumbaiAbi, daiPolygonAbi, daiOptimismAbi, daiOptimismGoerliAbi, fundPgGoerliAbi, fundPgMumbaiAbi, fundPgPolygonAbi, fundPgOptimismAbi,  fundPgOptimismGoerliAbi } from '../lib/abi';
import useDebounce from '../useDebounce';
import Actions from './Actions';
import Transactions from './Transactions';
import Breadcrumb from './Breadcrumb';

export function Account() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })

  const [approvalVal, setApprovalVal] = useState('0')
  const [depositVal, setDepositVal] = useState('0')
  const [allocationVal, setAllocationVal] = useState('0')
  const [focused, setFocused] = useState('Approve')
  const [transactionHash, setTransactionHash] = useState(null)
  const { chain } = useNetwork()
  
 const contractAddresses = {
    matic: {
      dai: '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf',
      daiAbi: daiPolygonAbi,
      fundPGVault: '0xC88e08d5A1D3A035847A4fcdFe68561ADf6E8959',
      fundPgAbi: fundPgPolygonAbi,
    },
    maticum: {
      dai: '0x9198f13b08e299d85e096929fa9781a1e3d5d827',
      daiAbi: daiMumbaiAbi,
      fundPGVault: '0x7f7C720b2fa6D3a587AE9693ae281b441EA42Bd6',
      fundPgAbi: fundPgMumbaiAbi,
    },
    goerli: {
      dai: '0x75ab5ab1eef154c0352fc31d2428cef80c7f8b33',
      daiAbi: daiGoerliAbi,
      fundPGVault: '0x9d90a08e0eccfc041835c0053ba4d4bd7212ba02',
      fundPgAbi: fundPgGoerliAbi,
    },
    optimism: {
      dai: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      daiAbi: daiOptimismAbi,
      fundPGVault: '0x4e4358541dAFafA48b8487E9bC3Cb782911b1CE4',
      fundPgAbi: fundPgOptimismAbi
    },
    'optimism-goerli': {
      dai: '0xcad01dadb7e97ae45b89791d986470f3dfc256f7',
      daiAbi: daiOptimismGoerliAbi,
      fundPGVault: '0x39Af0b8A25edFDe9d75807FC0611e18a822B450e',
      fundPgAbi: fundPgOptimismGoerliAbi,
    }
  };

  // Dai vault and FundPG vault addresses, depending on chain network
  const daiAddress = contractAddresses[chain.network]?.dai || contractAddresses.goerli.dai;
  const fundPGVaultAddress = contractAddresses[chain.network]?.fundPGVault || contractAddresses.goerli.fundPGVault;

  //balance data abi and args
  const balanceAbi = contractAddresses[chain.network]?.fundPgAbi || contractAddresses.goerli.fundPgAbi;
  
  //approve abi and args
  const approveAbi = contractAddresses[chain.network]?.daiAbi || contractAddresses.goerli.daiAbi;
  const approveArgs = []; // todo - figure out proper approve function for non-goerli chains

  //deposit abi and args
  const depositAbi = contractAddresses[chain.network]?.fundPgAbi || contractAddresses.goerli.fundPgAbi;

  //withdraw abi and args
  const withdrawAbi = contractAddresses[chain.network]?.fundPgAbi || contractAddresses.goerli.fundPgAbi;

  // Balance data
  const { data: balanceData , isError: isBalanceError, isLoading: isBalanceLoading } = useContractRead({
    address: fundPGVaultAddress,
    abi: balanceAbi,
    functionName: 'users',
    args: [address]
  })

  // Approve
  const { config: approvalConfig, error: approvalError } = usePrepareContractWrite({
    address: daiAddress,
    abi: approveAbi,
    functionName: 'approve',
    args: [fundPGVaultAddress, approvalVal === '' ? 0 : approvalVal]
  })
  const { data: daiApproveData, write: writeDaiApprove, reset: approveReset } = useContractWrite(approvalConfig)
  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransaction({
    hash: daiApproveData?.hash,
  })

  // Deposit
  const deboucedDeposit = useDebounce(depositVal, 500)
  const deboucedAllocation = useDebounce(allocationVal, 500)
  const { config: depositConfig, error: depositError } = usePrepareContractWrite({
    address: fundPGVaultAddress,
    abi: depositAbi,
    functionName: 'depositUnderlyingOnBehalf',
    args: [depositVal === '' ? 0 : deboucedDeposit, allocationVal === '' ? 0 : deboucedAllocation]
  })
  const { write: writeDeposit } = useContractWrite(depositConfig)

  // Withdraw
  const { config: withdrawConfig, error: withdrawError } = usePrepareContractWrite({
    address: fundPGVaultAddress,
    abi: withdrawAbi,
    functionName: 'withdrawAllUnderlyingOnBehalf'
  })
  const { write: writeWithdraw } = useContractWrite(withdrawConfig)
  
  // Renders the div to choose 'approve', 'withdraw', or 'deposit'
  function renderActionDiv() {
    switch (focused) {
      case 'Approve':
        return (
          <center>
            <div className="mt-5 p-2 w-full flex flex-col justify-center items-center">
              <input
                className="rounded-md px-6 py-4 w-full text-center focus:outline-none text-lg font-medium"
                type="number"
                placeholder="0"
                value={approvalVal}
                onChange={(e) => setApprovalVal(e.target.value)}
              />
              <button
                className="mt-4 px-2 py-1 text-sm rounded-md bg-white font-medium"
                disabled={!writeDaiApprove}
                onClick={() => {
                  try {
                    console.log('writeDaiApprove called');
                    writeDaiApprove?.().then((response) => {
                     console.log('writeDaiApprove promise resolved');
                     console.log(response);
                     setTransactionHash(response.hash);
                     approveReset?.();
                   });

                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Approve
              </button>
            </div>
          </center>
        );
      case 'Deposit':
        return (
          <div className="mt-3">
            <div className="mt-1 flex mb-2">
              <label className="inline-block mr-2 text-sm font-medium text-gray-900">
                Amount:
              </label>
              <input
                className="inline-block w-full h-4 bg-transparent text-black outline-none mt-1"
                type="text"
                placeholder="0"
                value={depositVal}
                onChange={(e) => setDepositVal(e.target.value)}
              />
            </div>
            <label className="block mb-2 text-sm font-medium text-gray-900">{`Allocation: ${allocationVal}%`}</label>
            <input
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              type="range"
              value={allocationVal}
              onChange={(e) => setAllocationVal(e.target.value)}
            />
  
            <button
              className="mt-4 px-2 py-1 text-sm rounded-md bg-white font-medium mb-2"
              disabled={!writeDeposit}
              onClick={() =>
                writeDeposit?.().then((response) => {
                  setTransactionHash(response.hash);
                })
              }
            >
              Deposit
            </button>
          </div>
        );
      case 'Withdraw':
        return (
          <div className="mt-5">
            <center>
              <button
                className="mt-10 rounded-md bg-white text-black px-4 py-2"
                disabled={!writeWithdraw}
                onClick={() =>
                  writeWithdraw?.().then((response) => {
                    setTransactionHash(response.hash);
                  })
                }
              >
                Withdraw All
              </button>
            </center>
          </div>
        );
      }
    }


  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">    
      <div className="flex flex-col items-center">
        <div className="flex w-full">
          <div className="w-1/3 bg-[#D9D9D9] rounded-lg mr-2 p-5 h-48">
            <p className="text-lg font-medium">{ensName}</p>
          </div>
          <Breadcrumb
            transactionHash={transactionHash}
            chainId={chain.id}
            pending={isApproveLoading}
            success={isApproveSuccess}
          />
          <Actions
            focused={focused}
            setFocused={setFocused}
            renderActionDiv={renderActionDiv}
          />
        </div>
        <div className="w-full min-h-[50vh] bg-[#D9D9D9] rounded-lg mt-2 p-3 h-48 overflow-y-scroll">
          <h1 className="ml-1 p-1 font-medium text-xl">Activity</h1>
{/*           <Transactions
            contractAddress={fundPGVaultAddress}
            walletAddress={address}
            chainId={chain.id}
          /> */}
        </div>
      </div>
    </div>
)
}
