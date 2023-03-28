import { useState, useEffect } from 'react';
import Image from 'next/image';
import aave from '../aave.png';
import ethereum from '../ethereum.png';
import polygon from '../polygon.png';
import optimism from '../optimism.png';
import { client, chains } from '../wagmi';
import { useNetwork, useSwitchNetwork } from 'wagmi'

export default function NetworkSelection() {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('Aave');
  const [selectedSubNetwork, setSelectedSubNetwork] = useState('Goerli');

  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  const handleSelection = () => {
    if (showModal) {
      setSelectedNetwork('');
      setSelectedSubNetwork('');
      setSelected('');
    }
    setShowModal(!showModal);
  };

  const handleNetworkSelection = (network: any) => {
    setSelected(network);
  };


const handleSubNetworkSelection = (subNetwork: any) => {
  let chainId;
  switch (subNetwork) {
    // case 'ETH Mainnet':
    //   chainId = 1;
    //   break;
    case 'Goerli':
      chainId = 5;
      break;
    case 'Polygon Mainnet':
      chainId = 137;
      break;
    case 'Mumbai':
      chainId = 80001;
      break;
    case 'Optimism':
      chainId = 10;
      break;
    case 'Optimism Goerli':
      chainId = 420;
      break;
    default:
      console.error('Unsupported network');
      return;
  }
  if (switchNetwork) {
    switchNetwork(chainId)
  }
  setSelectedSubNetwork(subNetwork);
  setSelected('');
  setShowModal(!showModal);
};


  

  const handleBack = () => {
    setSelected('');
  };

  useEffect(() => {
    console.log(chains, error, isLoading, pendingChainId)
  }, [chains, error, isLoading, pendingChainId])

  return (
    <>
      <div className="inline-flex relative z-20">
        <div
          className="rounded-xl bg-gray-400 p-2 inline-flex w-10 h-10 mr-2 cursor-pointer"
          onClick={handleSelection}
        >
          <Image src={aave} width={40} height={40} alt="Aave" />
        </div>
        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white rounded-md p-4">
                {!selected && (
                  <>
                    <button className="text-gray-700 text-sm font-medium mb-4" onClick={() => setShowModal(!showModal)}>
                        &lt; Back
                      </button>
                    <div className="flex items-center mb-4">
                      <Image src={aave} width={25} height={25} alt="Aave logo" />
                      <button
                        className="ml-3 text-gray-700 text-md"
                        onClick={() => handleNetworkSelection('Aave')}
                      >
                        Aave
                      </button>
                    </div>
                  </>
                )}
                {selected && (
                  <>
                    <div className="flex items-center mb-4">
                      <button className="text-gray-700 text-sm mr-3" onClick={handleBack}>
                        &lt; Back
                      </button>
                      <Image
                        src={aave}
                        width={15}
                        height={15}
                        alt="Aave logo"
                      />
                      <span className="ml-2 text-gray-700 text-sm font-medium">{selected}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <Image src={ethereum} width={30} height={30} alt="Ethereum logo" />
                      <button
                        className="ml-2 text-gray-700 text-md"
                        onClick={() => handleSubNetworkSelection('Goerli')}
                      >
                        Goerli
                      </button>
                    </div>
                    <div className="flex items-center mb-4">
                      <Image src={polygon} width={30} height={30} alt="Polygon logo" />
                      <button
                        className="ml-2 text-gray-700 text-md"
                        onClick={() => handleSubNetworkSelection('Polygon Mainnet')}
                      >
                        Polygon Mainnet
                      </button>
                    </div>
                    <div className="flex items-center mb-4">
                      <Image src={polygon} width={30} height={30} alt="Polygon logo" />
                      <button
                        className="ml-2 text-gray-700 text-md"
                        onClick={() => handleSubNetworkSelection('Mumbai')}
                      >
                        Mumbai
                      </button>
                    </div>
                    <div className="flex items-center mb-4">
                      <Image src={optimism} width={25} height={25} alt="Optimism logo" />
                      <button
                        className="ml-2 text-gray-700 text-md"
                        onClick={() => handleSubNetworkSelection('Optimism')}
                      >
                        Optimism
                      </button>
                    </div>
                    <div className="flex items-center mb-4">
                      <Image src={optimism} width={25} height={25} alt="Optimism logo" />
                      <button
                        className="ml-2 text-gray-700 text-md"
                        onClick={() => handleSubNetworkSelection('Optimism Goerli')}
                      >
                        Optimism Goerli
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

