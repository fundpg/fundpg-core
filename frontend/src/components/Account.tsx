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
  
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">    
      <div className="flex flex-col items-center">
        <div className="flex w-full">
          <div className="w-1/3 bg-[#D9D9D9] rounded-lg mr-2 p-5 h-48">
            <p className="text-lg font-medium">{ens || address}</p>
          </div>
          {/* <Actions
            focused={focused}
            setFocused={setFocused}
            renderActionDiv={() => renderActionDiv()}
          /> */}
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