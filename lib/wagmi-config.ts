import { createConfig, http } from "wagmi"
import { mainnet, sepolia, baseSepolia } from "wagmi/chains"
import { metaMask, coinbaseWallet, injected } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id"

export const wagmiConfig = createConfig({
  chains: [baseSepolia, sepolia, mainnet],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: "CRAZY LOST AND FOUND SUITCASE",
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})

export const defaultChain = baseSepolia
