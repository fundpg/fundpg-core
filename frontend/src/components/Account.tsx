import Image from 'next/image';
import { useEffect, useState } from 'react';
import useDebounce from '../useDebounce';
import Actions from './Actions';
// import Transactions from './Transactions';
import { useWallet, useSDK } from "@thirdweb-dev/react";

export default function Account() {

  const sdk = useSDK()
  const wallet = useWallet()
  const [address, setAddress] = useState<string>('');
  const [focused, setFocused] = useState<string>('Approve')
  const [ens, setEns] = useState<string>('');

  useEffect(() => {
    async function getENS(){
      const address = await wallet?.getAddress()
      setAddress('')
      const provider = sdk?.getProvider()
      const ensValue = await provider?.lookupAddress(address ?? '')
      ensValue && setEns(ensValue)
    }
    getENS()
  }, [wallet])

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
                value={0}
              />
              <button className="mt-4 px-2 py-1 text-sm rounded-md bg-white font-medium">
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
                value={0}
              />
            </div>
            <label className="block mb-2 text-sm font-medium text-gray-900">{`Allocation: 0%`}</label>
            <input
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              type="range"
              value={0}
            />
  
            <button
              className="mt-4 px-2 py-1 text-sm rounded-md bg-white font-medium mb-2">
              Deposit
            </button>
          </div>
        );
      case 'Withdraw':
        return (
          <div className="mt-5">
            <center>
              <button
                className="mt-10 rounded-md bg-white text-black px-4 py-2">
                Withdraw All
              </button>
            </center>
          </div>
        );
      default:
        return (
          <>
          </>
        );
      }
    }
  
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">    
      <div className="flex flex-col items-center">
        <div className="flex w-full">
          <div className="w-1/3 bg-[#D9D9D9] rounded-lg mr-2 p-5 h-48">
            <p className="text-lg font-medium">{ens || address}</p>
          </div>
          <Actions
            focused={focused}
            setFocused={setFocused}
            renderActionDiv={() => renderActionDiv()}
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
 );
}