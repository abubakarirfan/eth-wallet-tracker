import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ethereum Provider (using public blockchain API or Infura/Alchemy)
const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);

app.use(express.json());

// Endpoint to fetch wallet balance
app.get("/balance/:wallet", async (req, res) => {
    const walletAddress = req.params.wallet;

    if (!ethers.isAddress(walletAddress)) {
        return res.status(400).send({ error: "Invalid Ethereum address." });
    }

    try {
        const balance = await provider.getBalance(walletAddress);
        const etherBalance = ethers.formatEther(balance);

        res.send({
            wallet: walletAddress,
            balance: etherBalance,
        });
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch balance." });
    }
});

app.listen(PORT, () => {
    console.log(`Ethereum Wallet Tracker running on http://localhost:${PORT}`);
});
