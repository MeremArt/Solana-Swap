import React from "react";
import Wallet from "../swap/Wallet/Wallet";
const Navbar = () => {
  return (
    <nav className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-[#03E1FF] text-2xl font-bold">Solana Swap</div>

        <Wallet />
      </div>
    </nav>
  );
};

export default Navbar;
