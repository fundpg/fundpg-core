import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi'
import logo from '../fpglogo.png'
import { Account } from '../components'
function Page() {
  const { isConnected } = useAccount()

  return (
    <>
      {!isConnected && <center>
        <Image 
          src={logo} 
          width="600" 
          height="600" 
          alt="FPG logo"
          className="mt-10" />
      </center>}
      <br/>
      <div className="ml-[45vw]">
        <ConnectButton />
      </div>
      <br/>
      {isConnected && <Account />}
    </>
  )
}

export default Page
