import React from 'react';
import CustomCard from '../../components/common/CustomCard';
import StatisticCard from '../../components/charts/StatisticCard';
import RevenueActivityChart from '../../components/charts/RevenueActivityChart';
import StatusDonutChart from '../../components/charts/StatusDonutChart';
import CustomSelect from '../../components/common/CustomSelect';
import { LuDownload, LuFolderCheck } from 'react-icons/lu';
import { PiUsersBold, PiUsersThreeBold } from 'react-icons/pi';

const DashboardPage = () => {
  const yearOptions = [
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
  ];

  const monthOptions = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
  ];

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>

      {/* Overview Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatisticCard icon={<PiUsersThreeBold />} value="1.5k" label="Total Patients" />
        <StatisticCard icon={<PiUsersBold />} value="31" label="Total Doctors" />
        <StatisticCard icon={<LuDownload />} value="746" label="Total Request" />
        <StatisticCard icon={<LuFolderCheck />} value="631" label="Complete Consultation" />
      </div>

      {/* Revenue Activity and Revenue/Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Activity Chart */}
        <div className="lg:col-span-2">
          <CustomCard className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Revenue Activity</h2>
              <CustomSelect options={yearOptions} value="year" onChange={() => { }} />
            </div>
            <RevenueActivityChart />
          </CustomCard>
        </div>

        {/* Revenue and Status Cards */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <CustomCard className='flex flex-row justify-between items-center p-4'>
            <span>
              <h2 className="text-xl font-bold mb-2">Revenue</h2>
              <p className="text-gray-500 mb-2">This Year</p>
            </span>
            <p className="text-3xl font-bold text-black">₦12,897,20</p>
          </CustomCard>

          <CustomCard className="flex-1 p-4 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Status</h2>
              <CustomSelect options={monthOptions} value="month" onChange={() => { }} />
            </div>
            <StatusDonutChart />
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;