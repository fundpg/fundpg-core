import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createClient } from 'wagmi'
import { goerli, polygon, polygonMumbai, optimism, optimismGoerli } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [goerli, polygon, polygonMumbai, optimism, optimismGoerli],
  [
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'FundPG',
  chains,
})

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

export { chains }
