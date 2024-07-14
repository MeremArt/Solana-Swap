// import styles from "./swap.module.css";
// import { useWallet } from "@solana/wallet-adapter-react";
// import {
//   PublicKey,
//   VersionedTransaction,
//   TransactionInstruction,
//   AddressLookupTableAccount,
//   TransactionMessage,
//   Connection,
// } from "@solana/web3.js";
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import {
//   PythConnection,
//   getPythProgramKeyForCluster,
// } from "@pythnetwork/client";
// import { useConnection, useNetwork } from "../../wallet/WalletContextProvider";
// interface Asset {
//   name: string;
//   mint: string;
//   decimals: number;
// }

// const assets: Asset[] = [
//   {
//     name: "SOL",
//     mint: "So11111111111111111111111111111111111111112",
//     decimals: 9,
//   },
//   {
//     name: "USDC",
//     mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//     decimals: 6,
//   },
//   {
//     name: "BONK",
//     mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
//     decimals: 5,
//   },
//   {
//     name: "WIF",
//     mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
//     decimals: 6,
//   },
// ];

// const debounce = (func: Function, wait: number) => {
//   let timeout: ReturnType<typeof setTimeout> | undefined;
//   return (...args: any[]) => {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// };

// const Swap: React.FC = () => {
//   const [fromAsset, setFromAsset] = useState(assets[0]);
//   const [toAsset, setToAsset] = useState(assets[1]);
//   const [fromAmount, setFromAmount] = useState<number>(0);
//   const [toAmount, setToAmount] = useState<number>(0);
//   const [optimalAmount, setOptimalAmount] = useState<number | null>(null);
//   const [quoteResponse, setQuoteResponse] = useState<any>(null); // Adjust type as needed
//   const [loading, setLoading] = useState(false);

//   const wallet = useWallet();
//   const connection = useConnection(); // Use the connection from the context
//   const { network } = useNetwork(); // Use the network from the context
//   const [oraclePrices, setOraclePrices] = useState<Record<string, number>>({});
//   const debounceQuoteCall = useCallback(
//     debounce((currentAmount: number, from: Asset, to: Asset) => {
//       getQuote(currentAmount, from, to);
//     }, 500),
//     []
//   );

//   useEffect(() => {
//     debounceQuoteCall(fromAmount, fromAsset, toAsset);
//   }, [fromAmount, fromAsset, toAsset, debounceQuoteCall]);

//   useEffect(() => {
//     const fetchOraclePrices = async () => {
//       const pythConnection = new PythConnection(
//         connection,
//         getPythProgramKeyForCluster(
//           network === WalletAdapterNetwork.Devnet ? "devnet" : "mainnet-beta"
//         )
//       );

//       await pythConnection.onPriceChange((product, price) => {
//         if (price && product.symbol) {
//           setOraclePrices((prevPrices) => {
//             const newPrices: Partial<Record<string, number>> = {
//               ...prevPrices,
//               [product.symbol]: price.price,
//             };

//             // Filter out undefined values
//             const filteredPrices: Record<string, number> = {};
//             for (const key in newPrices) {
//               if (newPrices[key] !== undefined) {
//                 filteredPrices[key] = newPrices[key]!;
//               }
//             }

//             return filteredPrices;
//           });
//         }
//       });

//       pythConnection.start();
//     };

//     fetchOraclePrices();
//   }, [connection, network]);

//   const getOptimalSwapAmount = useCallback(
//     (fromAmount: number, fromAsset: Asset, toAsset: Asset) => {
//       const fromPrice = oraclePrices[fromAsset.name];
//       const toPrice = oraclePrices[toAsset.name];

//       if (fromPrice && toPrice) {
//         const optimalAmount = (fromAmount * fromPrice) / toPrice;
//         return optimalAmount;
//       }

//       return null;
//     },
//     [oraclePrices]
//   );
//   const handleFromAssetChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const selectedAsset =
//       assets.find((asset) => asset.name === event.target.value) || assets[0];
//     setFromAsset(selectedAsset);
//     debounceQuoteCall(fromAmount, selectedAsset, toAsset);
//   };

//   const handleToAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedAsset =
//       assets.find((asset) => asset.name === event.target.value) || assets[0];
//     setToAsset(selectedAsset);
//     debounceQuoteCall(fromAmount, fromAsset, selectedAsset);
//   };

//   const handleFromValueChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const amount = Number(event.target.value);
//     setFromAmount(amount);
//     debounceQuoteCall(amount, fromAsset, toAsset);
//   };
//   // async function getQuote(currentAmount: number, from: Asset, to: Asset) {
//   //   if (isNaN(currentAmount) || currentAmount <= 0) {
//   //     console.error("Invalid fromAmount value:", currentAmount);
//   //     return;
//   //   }

//   //   try {
//   //     const quote = await fetch(
//   //       `https://quote-api.jup.ag/v6/quote?inputMint=${from.mint}&outputMint=${
//   //         to.mint
//   //       }&amount=${
//   //         currentAmount * Math.pow(10, from.decimals)
//   //       }&slippage=0.5&network=${
//   //         network === WalletAdapterNetwork.Devnet ? "devnet" : "mainnet"
//   //       }`
//   //     ).then((res) => res.json());

//   //     if (quote && quote.outAmount) {
//   //       const outAmountNumber =
//   //         Number(quote.outAmount) / Math.pow(10, to.decimals);
//   //       setToAmount(outAmountNumber);
//   //     }

//   //     setQuoteResponse(quote);
//   //   } catch (error) {
//   //     console.error("Error fetching quote:", error);
//   //     toast.error("Error fetching quote");
//   //   }
//   // }

//   async function getQuote(currentAmount: number, from: Asset, to: Asset) {
//     if (isNaN(currentAmount) || currentAmount <= 0) {
//       console.error("Invalid fromAmount value:", currentAmount);
//       return;
//     }

//     try {
//       const optimalAmount = getOptimalSwapAmount(currentAmount, from, to);
//       setOptimalAmount(optimalAmount);

//       if (optimalAmount === null) {
//         throw new Error("Oracle prices not available");
//       }

//       const quote = await fetch(
//         `https://quote-api.jup.ag/v6/quote?inputMint=${from.mint}&outputMint=${
//           to.mint
//         }&amount=${Math.floor(
//           optimalAmount * Math.pow(10, from.decimals)
//         )}&slippage=0.5&network=${
//           network === WalletAdapterNetwork.Devnet ? "devnet" : "mainnet"
//         }`
//       ).then((res) => res.json());

//       if (quote && quote.outAmount) {
//         const outAmountNumber =
//           Number(quote.outAmount) / Math.pow(10, to.decimals);
//         setToAmount(outAmountNumber);
//         setQuoteResponse(quote);
//       }
//     } catch (error) {
//       console.error("Error fetching quote:", error);
//       toast.error("Error fetching quote");
//     }
//   }

//   async function signAndSendTransaction() {
//     if (!wallet.connected || !wallet.signTransaction || !wallet.publicKey) {
//       toast.error(
//         "Wallet is not connected or does not support signing transactions"
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(
//         "https://quote-api.jup.ag/v6/swap-instructions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             quoteResponse,
//             userPublicKey: wallet.publicKey.toBase58(),
//           }),
//         }
//       );

//       const instructions = await response.json();
//       if (instructions.error) {
//         throw new Error(
//           "Failed to get swap instructions: " + instructions.error
//         );
//       }

//       const {
//         computeBudgetInstructions,
//         setupInstructions,
//         swapInstruction: swapInstructionPayload,
//         cleanupInstruction,
//         addressLookupTableAddresses,
//       } = instructions;

//       const deserializeInstruction = (instruction: any) => {
//         return new TransactionInstruction({
//           programId: new PublicKey(instruction.programId),
//           keys: instruction.accounts.map((key: any) => ({
//             pubkey: new PublicKey(key.pubkey),
//             isSigner: key.isSigner,
//             isWritable: key.isWritable,
//           })),
//           data: Buffer.from(instruction.data, "base64"),
//         });
//       };

//       const getAddressLookupTableAccounts = async (keys: string[]) => {
//         const addressLookupTableAccountInfos =
//           await connection.getMultipleAccountsInfo(
//             keys.map((key) => new PublicKey(key))
//           );

//         return addressLookupTableAccountInfos.reduce(
//           (acc, accountInfo, index) => {
//             const addressLookupTableAddress = keys[index];
//             if (accountInfo) {
//               const addressLookupTableAccount = new AddressLookupTableAccount({
//                 key: new PublicKey(addressLookupTableAddress),
//                 state: AddressLookupTableAccount.deserialize(accountInfo.data),
//               });
//               acc.push(addressLookupTableAccount);
//             }
//             return acc;
//           },
//           [] as AddressLookupTableAccount[]
//         );
//       };

//       const addressLookupTableAccounts = await getAddressLookupTableAccounts(
//         addressLookupTableAddresses
//       );

//       const blockhash = (await connection.getLatestBlockhash()).blockhash;
//       const messageV0 = new TransactionMessage({
//         payerKey: wallet.publicKey,
//         recentBlockhash: blockhash,
//         instructions: [
//           ...computeBudgetInstructions.map(deserializeInstruction),
//           ...setupInstructions.map(deserializeInstruction),
//           deserializeInstruction(swapInstructionPayload),
//           deserializeInstruction(cleanupInstruction),
//         ],
//       }).compileToV0Message(addressLookupTableAccounts);

//       const transaction = new VersionedTransaction(messageV0);
//       console.log("Transaction size:", transaction.serialize().length);

//       const signedTransaction = await wallet.signTransaction(transaction);
//       const rawTransaction = signedTransaction.serialize();
//       const txid = await connection.sendRawTransaction(rawTransaction, {
//         skipPreflight: true,
//         maxRetries: 5,
//       });

//       const latestBlockHash = await connection.getLatestBlockhash();
//       await connection.confirmTransaction(
//         {
//           blockhash: latestBlockHash.blockhash,
//           lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//           signature: txid,
//         },
//         "confirmed"
//       );

//       console.log(
//         `Transaction sent: https://solscan.io/tx/${txid}?cluster=devnet`
//       );
//       toast.success("Transaction confirmed!");
//     } catch (error) {
//       console.error("Error signing or sending the transaction:", error);
//       toast.error("Error signing or sending the transaction");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className={styles.body}>
//       <div className={styles.innerContainer}>
//         <div className={styles.inputContainer}>
//           <div className={styles.labels}>You pay</div>
//           <input
//             value={fromAmount}
//             onChange={handleFromValueChange}
//             className={styles.inputField}
//           />
//           <select
//             value={fromAsset.name}
//             onChange={handleFromAssetChange}
//             className={styles.selectField}
//           >
//             {assets.map((asset) => (
//               <option key={asset.mint} value={asset.name}>
//                 {asset.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className={styles.inputContainer}>
//           <div className={styles.labels}>You receive</div>
//           <input
//             type="number"
//             value={toAmount}
//             className={styles.inputField}
//             readOnly
//           />
//           <select
//             value={toAsset.name}
//             onChange={handleToAssetChange}
//             className={styles.selectField}
//           >
//             {assets.map((asset) => (
//               <option key={asset.mint} value={asset.name}>
//                 {asset.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         {optimalAmount !== null && (
//           <div className={styles.optimalAmount}>
//             Optimal Amount: {optimalAmount.toFixed(6)} {toAsset.name}
//           </div>
//         )}
//         <button
//           onClick={signAndSendTransaction}
//           className={styles.button}
//           disabled={!wallet.connected || loading}
//         >
//           {loading ? "Loading..." : "Swap"}
//         </button>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// };

// export default Swap;

import styles from "./swap.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  VersionedTransaction,
  TransactionInstruction,
  AddressLookupTableAccount,
  TransactionMessage,
  Connection,
} from "@solana/web3.js";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PythConnection,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";
import { useConnection, useNetwork } from "../../wallet/WalletContextProvider";

interface Asset {
  name: string;
  mint: string;
  decimals: number;
}

const assets: Asset[] = [
  {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
  },
  {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
  },
  {
    name: "BONK",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    decimals: 5,
  },
  {
    name: "WIF",
    mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    decimals: 6,
  },
  // {
  //   name: "Merem",
  //   mint: "GzJj5ubCzEbakT6zrcnArnVeNAGBsEkVx6LLkCEMdBvT",
  //   decimals: 2,
  // },
];

const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: any[]) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Swap: React.FC = () => {
  const [fromAsset, setFromAsset] = useState(assets[0]);
  const [toAsset, setToAsset] = useState(assets[1]);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [optimalAmount, setOptimalAmount] = useState<number | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<any>(null); // Adjust type as needed
  const [loading, setLoading] = useState(false);

  const wallet = useWallet();
  const connection = useConnection(); // Use the connection from the context
  const { network } = useNetwork(); // Use the network from the context
  const [oraclePrices, setOraclePrices] = useState<Record<string, number>>({});
  const debounceQuoteCall = useCallback(
    debounce((currentAmount: number, from: Asset, to: Asset) => {
      getQuote(currentAmount, from, to);
    }, 500),
    []
  );

  useEffect(() => {
    debounceQuoteCall(fromAmount, fromAsset, toAsset);
  }, [fromAmount, fromAsset, toAsset, debounceQuoteCall]);

  useEffect(() => {
    if (connection) {
      const fetchOraclePrices = async () => {
        const pythConnection = new PythConnection(
          connection,
          getPythProgramKeyForCluster(
            network === WalletAdapterNetwork.Devnet ? "devnet" : "mainnet-beta"
          )
        );

        await pythConnection.onPriceChange((product, price) => {
          if (price && product.symbol) {
            setOraclePrices((prevPrices) => {
              const updatedPrices = {
                ...prevPrices,
                [product.symbol]: price.price,
              };

              // Filter out any undefined values to ensure the type remains valid
              return Object.fromEntries(
                Object.entries(updatedPrices).filter(
                  ([_, v]) => v !== undefined
                )
              ) as Record<string, number>;
            });
          }
        });

        pythConnection.start();
      };

      fetchOraclePrices();
    }
  }, [connection, network]);

  const getOptimalSwapAmount = useCallback(
    (fromAmount: number, fromAsset: Asset, toAsset: Asset) => {
      const fromPrice = oraclePrices[fromAsset.name];
      const toPrice = oraclePrices[toAsset.name];
      if (fromPrice && toPrice) {
        const optimalAmount = (fromAmount * fromPrice) / toPrice;
        return optimalAmount;
      }
      console.warn("Oracle prices not available, using original amount");
      return fromAmount; // Fallback to original amount if prices aren't available
    },
    [oraclePrices]
  );

  const handleFromAssetChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedAsset =
      assets.find((asset) => asset.name === event.target.value) || assets[0];
    setFromAsset(selectedAsset);
    debounceQuoteCall(fromAmount, selectedAsset, toAsset);
  };

  const handleToAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAsset =
      assets.find((asset) => asset.name === event.target.value) || assets[0];
    setToAsset(selectedAsset);
    debounceQuoteCall(fromAmount, fromAsset, selectedAsset);
  };

  const handleFromValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = Number(event.target.value);
    if (!isNaN(amount) && amount > 0) {
      setFromAmount(amount);
      debounceQuoteCall(amount, fromAsset, toAsset);
    } else {
      // Handle invalid input (optional): Display error message, reset state, etc.
      console.error("Invalid fromAmount value:", amount);
    }
  };

  async function getQuote(currentAmount: number, from: Asset, to: Asset) {
    if (isNaN(currentAmount) || currentAmount <= 0) {
      console.error("Invalid fromAmount value:", currentAmount);
      return;
    }

    try {
      const optimalAmount = getOptimalSwapAmount(currentAmount, from, to);
      setOptimalAmount(optimalAmount);

      const amountInSmallestUnit = Math.floor(
        optimalAmount * Math.pow(10, from.decimals)
      );

      const quote = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${from.mint}&outputMint=${
          to.mint
        }&amount=${amountInSmallestUnit}&slippage=0.5&network=${
          network === WalletAdapterNetwork.Devnet ? "devnet" : "mainnet"
        }`
      ).then((res) => res.json());

      if (quote && quote.outAmount) {
        const outAmountNumber =
          Number(quote.outAmount) / Math.pow(10, to.decimals);
        setToAmount(outAmountNumber);
        setQuoteResponse(quote);
      } else {
        throw new Error("Invalid quote response");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      toast.error("Error fetching quote: " + (error as Error).message);
    }
  }

  async function signAndSendTransaction() {
    if (!wallet.connected || !wallet.signTransaction || !wallet.publicKey) {
      toast.error(
        "Wallet is not connected or does not support signing transactions"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://quote-api.jup.ag/v6/swap-instructions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey.toBase58(),
          }),
        }
      );

      const instructions = await response.json();
      if (instructions.error) {
        throw new Error(
          "Failed to get swap instructions: " + instructions.error
        );
      }

      const {
        computeBudgetInstructions,
        setupInstructions,
        swapInstruction: swapInstructionPayload,
        cleanupInstruction,
        addressLookupTableAddresses,
      } = instructions;

      const deserializeInstruction = (instruction: any) => {
        return new TransactionInstruction({
          programId: new PublicKey(instruction.programId),
          keys: instruction.accounts.map((key: any) => ({
            pubkey: new PublicKey(key.pubkey),
            isSigner: key.isSigner,
            isWritable: key.isWritable,
          })),
          data: Buffer.from(instruction.data, "base64"),
        });
      };

      const getAddressLookupTableAccounts = async (keys: string[]) => {
        const addressLookupTableAccountInfos =
          await connection.getMultipleAccountsInfo(
            keys.map((key) => new PublicKey(key))
          );

        return addressLookupTableAccountInfos.reduce(
          (acc, accountInfo, index) => {
            const addressLookupTableAddress = keys[index];
            if (accountInfo) {
              const addressLookupTableAccount = new AddressLookupTableAccount({
                key: new PublicKey(addressLookupTableAddress),
                state: AddressLookupTableAccount.deserialize(accountInfo.data),
              });
              acc.push(addressLookupTableAccount);
            }
            return acc;
          },
          [] as AddressLookupTableAccount[]
        );
      };

      const addressLookupTableAccounts = await getAddressLookupTableAccounts(
        addressLookupTableAddresses
      );

      const blockhash = (await connection.getLatestBlockhash()).blockhash;
      const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions: [
          ...computeBudgetInstructions.map(deserializeInstruction),
          ...setupInstructions.map(deserializeInstruction),
          deserializeInstruction(swapInstructionPayload),
          deserializeInstruction(cleanupInstruction),
        ],
      }).compileToV0Message(addressLookupTableAccounts);

      const transaction = new VersionedTransaction(messageV0);
      console.log("Transaction size:", transaction.serialize().length);

      const signedTransaction = await wallet.signTransaction(transaction);
      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 5,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed"
      );

      console.log(
        `Transaction sent: https://solscan.io/tx/${txid}?cluster=devnet`
      );
      toast.success("Transaction confirmed!");
    } catch (error) {
      console.error("Error signing or sending the transaction:", error);
      toast.error("Error signing or sending the transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.innerContainer}>
        <div className={styles.inputContainer}>
          <div className={styles.labels}>You're paying</div>
          <input
            value={fromAmount}
            onChange={handleFromValueChange}
            className={styles.inputField}
          />
          <select
            value={fromAsset.name}
            onChange={handleFromAssetChange}
            className={styles.selectField}
          >
            {assets.map((asset) => (
              <option key={asset.mint} value={asset.name}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.labels}>To receive</div>
          <input
            type="number"
            value={toAmount}
            className={styles.inputField}
            readOnly
          />
          <select
            value={toAsset.name}
            onChange={handleToAssetChange}
            className={styles.selectField}
          >
            {assets.map((asset) => (
              <option key={asset.mint} value={asset.name}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>
        {optimalAmount !== null && (
          <div className={styles.optimalAmount}>
            <p className="font-bold text-xl">Best Price from pyth(oracle)</p>{" "}
            <p>
              Optimal Amount: {optimalAmount?.toFixed(6)} {fromAsset.name}
            </p>
            <p>
              You will receive: {toAmount?.toFixed(6)} {toAsset.name}
            </p>
          </div>
        )}

        <button
          onClick={signAndSendTransaction}
          className={styles.button}
          disabled={!wallet.connected || loading}
        >
          {loading ? "Loading..." : "Swap"}
        </button>
        {/* <div>
          <p>
            Original Amount: {fromAmount} {fromAsset.name}
          </p>
          <p>
            Optimal Amount: {optimalAmount?.toFixed(6)} {fromAsset.name}
          </p>
          <p>
            You will receive: {toAmount?.toFixed(6)} {toAsset.name}
          </p>
        </div> */}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Swap;
