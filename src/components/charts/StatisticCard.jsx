import React from 'react';
import CustomCard from '../common/CustomCard';

const StatisticCard = ({ icon, value, label }) => {
  return (
    <CustomCard className="flex flex-col items-center justify-center p-4 text-center">
      <div className="text-3xl text-gray-700 mb-2">{icon}</div>
      <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
    </CustomCard>
  );
};

export default StatisticCard;
