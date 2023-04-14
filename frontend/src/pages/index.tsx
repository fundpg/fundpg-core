import { ConnectWallet } from "@thirdweb-dev/react";
import { Account } from '../components'

function Page() {
  return (
    <>
      <h1>FundPG</h1>

      <ConnectWallet 
          theme="dark"
          btnTitle="Connect Wallet"
        />
      {/*isConnected && <Account />*/}
    </>
  )
}

export default Page
