import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

const App: React.FC = () => {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  const fetchBalance = async () => {
    setError("");
    setBalance("");

    if (!wallet) {
      setError("Please enter a valid Ethereum address.");
      return;
    }

    try {
      const response = await axios.get(`/balance/${wallet}`);
      setBalance(response.data.balance);
    } catch (err) {
      setError("Failed to fetch balance. Please check the wallet address.");
    }
  };

  return (
    <div className="container">
      <h1>Ethereum Wallet Tracker</h1>
      <input
        type="text"
        placeholder="Enter Ethereum Wallet Address"
        value={wallet}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setWallet(e.target.value)
        }
      />
      <button onClick={fetchBalance}>Get Balance</button>
      {error && <p className="error">{error}</p>}
      {balance && <p className="success">Balance: {balance} ETH</p>}
    </div>
  );
};

export default App;
