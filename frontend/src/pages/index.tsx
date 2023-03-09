import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi'
import logo from '../fpglogo-transparent.png'
import { Account } from '../components'
import Navbar from '../components/Navbar'
function Page() {
  const { isConnected } = useAccount()

  return (
    <>
      <Navbar />
      {!isConnected && <><center>
        <Image 
          src={logo} 
          width="600" 
          height="600" 
          alt="FPG logo"
          className="mt-10" />
      </center>
      <br/>
      <div className="ml-[45vw]">
        {!isConnected && <ConnectButton />}
      </div>
      </>}
      <br/>
      {isConnected && <Account />}
    </>
  )
}

export default Page
