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
      <div className="text-center">
        <h2 className="text-white text-3xl font-bold font-geist ">
          BLINK DONATION
        </h2>
        <div className="mt-4">
          <input
            type="text"
            value={link}
            readOnly
            className="p-2 w-2/3 text-center bg-gray-800 text-white rounded-lg"
          />
          <button
            onClick={handleCopyLink}
            className="ml-4 p-2 text-white text-l font-bold bg-[#03E1FF] hover:bg-gray-300 transition-all duration-200 rounded-lg"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
      <Swap />
    </main>
  );
}
