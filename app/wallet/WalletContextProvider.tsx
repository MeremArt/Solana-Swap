// AppWalletProvider.tsx
"use client";

import React, { useMemo, createContext, useState, useContext } from "react";
import {
  ConnectionProvider as BaseConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Connection } from "@solana/web3.js";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

// Add Helius RPC URL from environment variables
const HELIUS_MAINNET_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_MAINNET_RPC_URL;

const ConnectionContext = createContext<{
  connection: Connection | null;
  network: WalletAdapterNetwork;
  setNetwork: React.Dispatch<React.SetStateAction<WalletAdapterNetwork>>;
}>({
  connection: null,
  network: WalletAdapterNetwork.Devnet,
  setNetwork: () => {},
});

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [network, setNetwork] = useState<WalletAdapterNetwork>(
    WalletAdapterNetwork.Devnet
  );

  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Mainnet && HELIUS_MAINNET_RPC_URL) {
      return HELIUS_MAINNET_RPC_URL;
    }
    return clusterApiUrl(network);
  }, [network]);

  const connection = useMemo(() => new Connection(endpoint), [endpoint]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new BackpackWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionContext.Provider value={{ connection, network, setNetwork }}>
      <BaseConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </BaseConnectionProvider>
    </ConnectionContext.Provider>
  );
}

export const useConnection = (): Connection => {
  const { connection } = useContext(ConnectionContext);
  if (!connection) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return connection;
};

export const useNetwork = (): {
  network: WalletAdapterNetwork;
  setNetwork: React.Dispatch<React.SetStateAction<WalletAdapterNetwork>>;
} => {
  const { network, setNetwork } = useContext(ConnectionContext);
  return { network, setNetwork };
};
