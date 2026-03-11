import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const RevenueActivityChart = ({ monthlyData = [] }) => {
  const chartValues = monthlyData.length === 12
    ? monthlyData
    : Array(12).fill(0);

  const maxValue = Math.max(...chartValues, 1000);
  // Round up to a nice ceiling (next multiple of 1000)
  const yMax = Math.ceil(maxValue / 1000) * 1000 + 1000;
  const stepSize = yMax <= 5000 ? 1000 : yMax <= 10000 ? 2000 : 5000;

  const data = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    datasets: [
      {
        fill: true,
        label: 'Revenue',
        data: chartValues,
        borderWidth: 5,
        borderJoinStyle: 'round',
        borderColor: '#006C93',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          let gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(0, 117, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 117, 255, 0)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#006C93',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `₦${context.parsed.y.toLocaleString()}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          color: '#6b7280',
        },
      },
      y: {
        min: 0,
        max: yMax,
        ticks: {
          stepSize,
          callback: function (value) {
            return value >= 1000 ? value / 1000 + 'K' : value;
          },
          font: {
            size: 10,
          },
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <div className="h-84"> {/* Set a fixed height for the chart container */}
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueActivityChart;
