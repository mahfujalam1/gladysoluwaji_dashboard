import React from "react";

const StatusDonutChart = () => {
  const data = [
    { label: "Request", value: 35, color: "#F3F1F2" }, // Background-like
    { label: "Complete", value: 45, color: "#006C93" }, // Blue
    { label: "Canceled", value: 20, color: "#C2C2C2" }, // Gray
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

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
      <div className="flex justify-center space-x-8 text-sm mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            ></span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDonutChart;
