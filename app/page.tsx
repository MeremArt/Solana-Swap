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
import { clusterApiUrl, Connection } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

export default function Home() {
  const [link, setLink] = useState(
    "https://dial.to/?action=solana-action:http://localhost:3000/api/actions/transfer-sol"
  );
  const [copied, setCopied] = useState(false);

  // State to track whether the buttons are active or inactive
  const [areButtonsActive, setAreButtonsActive] = useState(true);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <main>
      <Swap />
    </main>
  );
}
