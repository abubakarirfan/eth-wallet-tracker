import React, { useState } from "react";
import axios from "axios";
import "./styles.css";
import Transactions from "./components/Transactions";
import Analytics from "./components/Analytics";

interface Transaction {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
}

const App: React.FC = () => {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paginatedTransactions, setPaginatedTransactions] = useState<
    Transaction[]
  >([]);
  const [page, setPage] = useState(1);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState("");
  const [transactionsPerPage] = useState(10);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchBalance = async () => {
    setError("");
    setLoadingBalance(true);
    try {
      const response = await axios.get(`/balance/${wallet}`);
      setBalance(response.data.balance);
    } catch (err) {
      setError("Failed to fetch balance. Please check the wallet address.");
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchTransactions = async () => {
    setError("");
    setLoadingTransactions(true);
    try {
      const response = await axios.get(`/transactions/${wallet}`);
      const fetchedTransactions = response.data.transactions;

      setTransactions(fetchedTransactions);
      paginateTransactions(fetchedTransactions, 1);
    } catch (err) {
      setError(
        "Failed to fetch transactions. Please check the wallet address."
      );
    } finally {
      setLoadingTransactions(false);
      setHasFetched(true);
    }
  };

  const paginateTransactions = (
    allTransactions: Transaction[],
    currentPage: number
  ) => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    setPaginatedTransactions(allTransactions.slice(startIndex, endIndex));
  };

  const fetchData = async () => {
    if (!wallet) {
      setError("Please enter a valid Ethereum address.");
      return;
    }

    setError("");
    setTransactions([]);
    setBalance("");
    setPaginatedTransactions([]);
    setPage(1);
    setHasFetched(false);

    fetchBalance();
    fetchTransactions();
  };

  const handlePageChange = (direction: "next" | "prev") => {
    const newPage = direction === "next" ? page + 1 : page - 1;
    if (
      newPage < 1 ||
      newPage > Math.ceil(transactions.length / transactionsPerPage)
    )
      return;

    setPage(newPage);
    paginateTransactions(transactions, newPage);
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
        Ethereum Wallet Tracker
      </h1>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Enter Ethereum Wallet Address"
          value={wallet}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setWallet(e.target.value)
          }
          style={{
            padding: "10px",
            width: "400px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={fetchData}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            fontSize: "16px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Get Data
        </button>
      </div>

      {loadingBalance ? (
        <p>Loading balance...</p>
      ) : (
        balance && (
          <p className="success" style={{ textAlign: "center" }}>
            Balance: {balance} ETH
          </p>
        )
      )}

      {loadingTransactions ? (
        <p style={{ textAlign: "center" }}>Loading transactions...</p>
      ) : hasFetched && transactions.length === 0 ? (
        <p style={{ textAlign: "center" }}>No transactions found.</p>
      ) : (
        <>
          <Transactions transactions={paginatedTransactions} />
          {transactions.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of{" "}
                {Math.ceil(transactions.length / transactionsPerPage)}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                disabled={
                  page === Math.ceil(transactions.length / transactionsPerPage)
                }
              >
                Next
              </button>
            </div>
          )}
          <Analytics transactions={transactions} />
        </>
      )}
    </div>
  );
};

export default App;
