import React from 'react';
import CustomCard from '../../components/common/CustomCard';
import StatisticCard from '../../components/charts/StatisticCard';
import RevenueActivityChart from '../../components/charts/RevenueActivityChart';
import StatusDonutChart from '../../components/charts/StatusDonutChart';
import CustomSelect from '../../components/common/CustomSelect';
import { LuDownload, LuFolderCheck } from 'react-icons/lu';
import { PiUsersBold, PiUsersThreeBold } from 'react-icons/pi';
import { useGetDashboardQuery } from '../../RTK/dashboard/dashboard';
import Loader from '../../components/shared/Loader';

const DashboardPage = () => {
  const { data: apiResponse, isLoading, error } = useGetDashboardQuery();

  const yearOptions = [
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
  ];

  const monthOptions = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
  ];

  // Extract data from api response
  const overview = apiResponse?.data?.overview || {};
  const revenueActivity = apiResponse?.data?.revenueActivity || {};
  const revenue = apiResponse?.data?.revenue ?? 0;
  const status = apiResponse?.data?.status || {};

  if (isLoading) {
    return (
       <div className="flex justify-center items-center py-30">
                        <Loader spinning={isLoading} tip="Loading..." />
                    </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-lg">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>

      {/* Overview Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatisticCard
          icon={<PiUsersThreeBold />}
          value={overview.totalPatients ?? '—'}
          label="Total Patients"
        />
        <StatisticCard
          icon={<PiUsersBold />}
          value={overview.totalDoctors ?? '—'}
          label="Total Doctors"
        />
        <StatisticCard
          icon={<LuDownload />}
          value={overview.totalAppointments ?? '—'}
          label="Total Appointments"
        />
        <StatisticCard
          icon={<LuFolderCheck />}
          value={overview.completeConsultations ?? '—'}
          label="Complete Consultations"
        />
      </div>

      {/* Revenue Activity and Revenue/Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Activity Chart */}
        <div className="lg:col-span-2">
          <CustomCard className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                Revenue Activity{' '}
                <span className="text-sm font-normal text-gray-400">
                  ({revenueActivity.year || '—'})
                </span>
              </h2>
              <CustomSelect options={yearOptions} value="year" onChange={() => { }} />
            </div>
            <RevenueActivityChart monthlyData={revenueActivity.monthly || []} />
          </CustomCard>
        </div>

        {/* Revenue and Status Cards */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <CustomCard className='flex flex-row justify-between items-center p-4'>
            <span>
              <h2 className="text-xl font-bold mb-2">Revenue</h2>
              <p className="text-gray-500 mb-2">This Year</p>
            </span>
            <p className="text-3xl font-bold text-black">
              ₦{revenue.toLocaleString()}
            </p>
          </CustomCard>

          <CustomCard className="flex-1 p-4 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Status</h2>
              <CustomSelect options={monthOptions} value="month" onChange={() => { }} />
            </div>
            <StatusDonutChart
              totalRequests={status.totalRequests ?? 0}
              completed={status.completed ?? 0}
              canceled={status.canceled ?? 0}
            />
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;