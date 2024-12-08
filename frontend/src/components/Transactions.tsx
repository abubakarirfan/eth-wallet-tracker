import React from "react";

const Transactions: React.FC<{ transactions: any[] }> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <p className="no-transactions">No transactions found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Hash</th>
          <th>From</th>
          <th>To</th>
          <th>Value (ETH)</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx, index) => (
          <tr key={index}>
            <td>{tx.hash}</td>
            <td>{tx.from}</td>
            <td>{tx.to}</td>
            <td>{parseFloat(tx.value) / 10 ** 18}</td>
            <td>{new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Transactions;