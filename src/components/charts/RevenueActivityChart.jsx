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

const RevenueActivityChart = () => {
  const data = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    datasets: [
      {
        fill: true,
        label: 'Revenue',
        data: [3500, 4500, 11000, 10500, 5000, 4000, 5500, 4200, 6000, 3000, 3800, 2500], // Approximated from image
        borderWidth: 5,
        borderJoinStyle: 'round',
        borderColor: '#006C93', // Blue line color
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          let gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(0, 117, 255, 0.3)'); // Light blue for fill
          gradient.addColorStop(1, 'rgba(0, 117, 255, 0)'); // Transparent at bottom
          return gradient;
        },
        tension: 0.4, // Smooth curve
        pointRadius: 0, // No visible points
        pointHoverRadius: 6, // Larger hover points
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
              label += `$${context.parsed.y.toLocaleString()}k`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false, // No vertical grid lines
        },
        ticks: {
          font: {
            size: 10,
          },
          color: '#6b7280', // Gray color for labels
        },
      },
      y: {
        min: 0,
        max: 12000,
        ticks: {
          stepSize: 2000,
          callback: function (value) {
            return value / 1000 + 'K';
          },
          font: {
            size: 10,
          },
          color: '#6b7280', // Gray color for labels
        },
        grid: {
          color: '#e5e7eb', // Light gray horizontal grid lines
          borderDash: [5, 5], // Dashed grid lines
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
