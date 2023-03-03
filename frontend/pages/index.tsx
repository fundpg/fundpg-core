import { useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance } from "wagmi";
import { Button, Layout, Loader, WalletOptionsModal } from "../components";
import shirt from '../public/images/creatureShirt.png'
import Image from "next/image";

const Home: NextPage = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [{ data: accountData, loading: accountLoading }] = useAccount();
  const [{ data: balanceData, loading: balanceLoading }] = useBalance({
    addressOrName: accountData?.address,
    watch: true,
  });

  // const abi = […] as const
  // const { config } = usePrepareContractWrite({
  //   address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
  //   abi: abi,
  //   functionName: 'feed',
  // })

  const loading = (accountLoading || balanceLoading) && !balanceData;

  const renderContent = () => {
    if (loading) return <Loader size={8} />;
    if (balanceData) {
      return (
        <>
          <h1 className="mb-8 text-4xl font-bold">My Wallet</h1>
          <div className="inline-flex place-items-center">
            <h6 className="ml-2 text-2xl">{`Ξ ${Number(
              balanceData?.formatted
            ).toFixed(4)} ${balanceData?.symbol}`}</h6>
          </div>
        </>
      );
    }

    return (
      <>
        <h1 className="mb-8 text-4xl font-bold">
          FundPG
        </h1>
        <Button
          loading={accountLoading}
          onClick={() => setShowWalletOptions(true)}
        >
          Connect to Wallet
        </Button>
      </>
    );
  };

  return (
    <>
      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <Layout
        showWalletOptions={showWalletOptions}
        setShowWalletOptions={setShowWalletOptions}
      >
        <div className="grid h-screen place-items-center">
          <div className="grid place-items-center">
            {/* renderContent() */}
            <Image src={shirt} alt="creature shirt" width={600} height={600} />
            <a href="https://store.gitcoin.co/products/creature-shipping">
              <button className="rounded-md px-3 py-2 bg-[#478CE1] text-white text-lg font-medium">Purchase Creatures x Gitcoin</button>
            </a>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
