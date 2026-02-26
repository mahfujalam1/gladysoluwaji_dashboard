import React, { useState, useEffect } from 'react';
import CustomCard from '../../components/common/CustomCard';
import CustomPagination from '../../components/shared/Pagination';
import { DatePicker } from 'antd';
import { useGetAuditLogsQuery } from '../../RTK/audit/auditApi';
import Loader from '../../components/shared/Loader';

const { RangePicker } = DatePicker;

const AuditLog = () => {
    const [searchParams, setSearchParams] = useState({
        page: 1,
        limit: 20,
        startDate: '',
        endDate: '',
    });

    const { data: auditData, isLoading } = useGetAuditLogsQuery(searchParams);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (auditData) {
            const mappedLogs = (auditData.data || auditData.logs || auditData || []).map(log => ({
                id: log.userId?._id,
                username: log.userId?.name || 'N/A',
                action: log.action,
                resource: log.resource,
                ipAddress: log.ipAddress || 'N/A',
                date: log.createdAt ? new Date(log.createdAt).toLocaleString('en-GB') : 'N/A',
            }));
            setLogs(mappedLogs);
        }
    }, [auditData]);

    const handlePageChange = (page, limit) => {
        setSearchParams(prev => ({ ...prev, page, limit }));
    };

    const handleDateChange = (dates, dateStrings) => {
        setSearchParams(prev => ({
            ...prev,
            page: 1,
            startDate: dateStrings ? dateStrings[0] : '',
            endDate: dateStrings ? dateStrings[1] : '',
        }));
    };

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Audit Logs</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-medium">Filter by Date:</span>
                    <RangePicker
                        onChange={handleDateChange}
                        className="rounded-lg border-gray-300 hover:border-blue-400 h-10"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-6 text-gray-500 font-semibold mb-2 px-8">
                    <div>ID</div>
                    <div>Username</div>
                    <div>Action</div>
                    <div>Resource</div>
                    <div>IP Address</div>
                    <div>Date</div>
                </div>

                {/* Table Rows */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader spinning={isLoading} />
                    </div>
                ) : (
                    logs.length > 0 ? (
                        logs.map((log) => (
                            <CustomCard
                                key={log.id}
                                className="grid grid-cols-6 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300"
                            >
                                <div className="font-medium text-blue-600 truncate" title={log.id}>
                                    {log.id}
                                </div>
                                <div className="text-gray-700 font-medium truncate" title={log.username}>
                                    {log.username}
                                </div>
                                <div>
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${log.action === 'DELETE' ? 'bg-red-100 text-red-600' :
                                        log.action === 'CREATE' ? 'bg-green-100 text-green-600' :
                                            log.action === 'UPDATE' ? 'bg-blue-100 text-blue-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {log.action}
                                    </span>
                                </div>
                                <div className="text-gray-600 truncate" title={log.resource}>{log.resource}</div>
                                <div className="text-gray-600 font-mono text-sm">{log.ipAddress}</div>
                                <div className="text-gray-600 text-sm whitespace-nowrap">{log.date}</div>
                            </CustomCard>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            No logs found for the selected criteria.
                        </div>
                    )
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-8">
                <CustomPagination
                    total={auditData?.meta?.total || logs.length}
                    pageSize={auditData?.meta?.limit || searchParams.limit}
                    onChange={handlePageChange}
                    current={searchParams.page}
                />
            </div>
        </div>
    );
};

export default AuditLog;