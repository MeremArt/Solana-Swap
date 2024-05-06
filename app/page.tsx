"use client";
import Image from "next/image";
import Swap from "./components/swap/Swap";
import Navbar from "./components/Navbar/Navbar";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
export default function Home() {
  const network = WalletAdapterNetwork.Devnet;

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];
  const endpoint = clusterApiUrl(network);
  // State to track whether the buttons are active or inactive
  const [areButtonsActive, setAreButtonsActive] = useState(true);
  return (
    <main>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <section className="flex p-4">
              <div className="container mx-auto flex justify-between items-center">
                <div className="text-[#03E1FF] text-2xl font-bold">
                  Solana Swap
                </div>
                <WalletMultiButton />
              </div>
            </section>

            <Swap />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
  );
}
