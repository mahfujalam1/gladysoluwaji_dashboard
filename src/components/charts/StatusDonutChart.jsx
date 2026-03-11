import React from "react";

const StatusDonutChart = ({ totalRequests = 0, completed = 0, canceled = 0 }) => {
  const data = [
    { label: "Request", value: totalRequests, color: "#F3F1F2" },
    { label: "Complete", value: completed, color: "#006C93" },
    { label: "Canceled", value: canceled, color: "#C2C2C2" },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1; // avoid divide-by-zero

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Donut */}
      <div className="w-42 h-42 relative mb-4">
        <svg viewBox="0 0 100 100">
          {data.map((item, index) => {
            const slice = (item.value / total) * circumference;

            const circle = (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="12"
                strokeDasharray={`${slice} ${circumference - slice}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            );

            offset += slice;
            return circle;
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm mt-2 flex-wrap gap-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDonutChart;
