"use client"

import { ReactNode, useState } from "react"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "@/lib/wagmi-config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MiniKitContextProvider } from "@/providers/MiniKitProvider"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <MiniKitContextProvider>{children}</MiniKitContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}


