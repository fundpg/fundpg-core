import { ConnectWallet, useWallet } from "@thirdweb-dev/react";
import { useUser } from "@thirdweb-dev/react";
import logo from '../fpglogo-transparent.png'
import Account from "../components/Account";
import Navbar from "../components/Navbar";
import Image from "next/image";
import { useEffect } from "react";

function Page() {
  const wallet = useWallet();

  return (
    <>
      <Navbar />
      {typeof wallet === 'undefined' && <><center>
        <Image 
          src={logo} 
          width="600" 
          height="600" 
          alt="FPG logo"
          className="mt-10" />
      </center>
      <br/>
      <div className="ml-[45vw]">
        {typeof wallet === 'undefined' && <ConnectWallet 
          theme="dark"
          btnTitle="Connect Wallet"
        /> }
      </div>
      </>}
      <br/>
      {typeof wallet !== 'undefined' && <Account />}
    </>
  )
}

export default Page