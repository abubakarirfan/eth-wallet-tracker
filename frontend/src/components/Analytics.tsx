import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Transaction {
  timeStamp: string;
  value: string;
}

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  // Calculate metrics
  const totalETHTransferred = useMemo(() => {
    return transactions
      .reduce((acc, tx) => acc + parseFloat(tx.value) / 10 ** 18, 0)
      .toFixed(4);
  }, [transactions]);

  const averageETHPerTransaction = useMemo(() => {
    return transactions.length > 0
      ? (
          transactions.reduce(
            (acc, tx) => acc + parseFloat(tx.value) / 10 ** 18,
            0
          ) / transactions.length
        ).toFixed(4)
      : "0";
  }, [transactions]);

  // Prepare data for chart (Number of transactions per day)
  const chartData = useMemo(() => {
    const counts: { [date: string]: number } = {};
    transactions.forEach((tx) => {
      const date = new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });

    const labels = Object.keys(counts).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const data = labels.map((label) => counts[label]);

    return {
      labels,
      datasets: [
        {
          label: "Transactions Per Day",
          data,
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    };
  }, [transactions]);

  if (transactions.length === 0) {
    return <p>No data available for analytics.</p>;
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Analytics Dashboard</h2>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Total ETH Transferred:</strong> {totalETHTransferred} ETH
        </p>
        <p>
          <strong>Average ETH per Transaction:</strong>{" "}
          {averageETHPerTransaction} ETH
        </p>
      </div>
      <div className="chart-container">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Number of Transactions",
                },
              },
            },
          }}
          style={{
            height: "400px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;
