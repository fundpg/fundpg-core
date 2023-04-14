import { ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <ThirdwebProvider activeChain="ethereum">
      <NextHead>
        <title>FundPG</title>
      </NextHead>

      {mounted && <Component {...pageProps} />}
    </ThirdwebProvider>
  )
}

export default App
