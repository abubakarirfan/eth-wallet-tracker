import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ethereum Provider (using public blockchain API or Infura/Alchemy)
const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);

app.use(express.json());

// Endpoint to fetch wallet balance
app.get("/balance/:wallet", async (req, res) => {
  const { wallet } = req.params;
  if (!ethers.isAddress(wallet)) return res.status(400).send({ error: "Invalid Ethereum address." });

  try {
    const balance = await provider.getBalance(wallet);
    res.send({ wallet, balance: ethers.formatEther(balance) });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch balance." });
  }
});

// New endpoint for transaction history
app.get("/transactions/:wallet", async (req, res) => {
  const { wallet } = req.params;

  if (!ethers.isAddress(wallet)) return res.status(400).send({ error: "Invalid Ethereum address." });

  try {
    const apiKey = process.env.ETHERSCAN_API_KEY;
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "1") {
      return res.status(404).send({ error: "No transactions found or invalid API response." });
    }

    res.send({ wallet, transactions: data.result });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch transactions." });
  }
});

app.listen(PORT, () => {
    console.log(`Ethereum Wallet Tracker running on http://localhost:${PORT}`);
});
