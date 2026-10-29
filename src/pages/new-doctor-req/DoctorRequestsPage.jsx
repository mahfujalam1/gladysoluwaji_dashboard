import React, { useState, useMemo } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { useNavigate } from 'react-router-dom';
import CustomPagination from '../../components/shared/Pagination';
import { getImageUrl, defaultAvatar } from '../../utils/imageUrl';
import { useGetNewDoctorsQuery } from '../../RTK/doctor/newDoctor';
import { useGetDoctorsQuery } from '../../RTK/doctor/doctorApi';
import Loader from '../../components/shared/Loader';
import SearchInput from '../../components/common/SearchInput';
import {
    LuClock,
    LuCircleCheck,
    LuCircleX,
    LuBan,
    LuShieldAlert,
    LuCalendar,
    LuPhone,
    LuMail,
    LuBuilding,
    LuStethoscope,
    LuFileCheck,
    LuArrowRight,
    LuTriangleAlert,
    LuRefreshCw
} from 'react-icons/lu';

const STATUS_FILTERS = [
    { key: 'PENDING_QUEUE', label: 'Pending Queue', icon: LuClock },
    { key: 'ALL', label: 'All Doctors', icon: null },
    { key: 'VERIFIED', label: 'Verified', icon: LuCircleCheck },
    { key: 'REJECTED', label: 'Rejected', icon: LuCircleX },
    { key: 'SUSPENDED', label: 'Suspended', icon: LuBan },
];

const DoctorRequestsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('PENDING_QUEUE');
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch pending doctors specifically when 'PENDING_QUEUE' is active
    const isPendingQueue = activeTab === 'PENDING_QUEUE';

    const {
        data: pendingResponse,
        isLoading: isPendingLoading,
        error: pendingError,
        refetch: refetchPending
    } = useGetNewDoctorsQuery(
        { page: currentPage, limit: doctorsPerPage },
        { skip: !isPendingQueue }
    );

    // Fetch doctors by status (or all) when other tabs are active
    const statusParam = activeTab === 'ALL' || isPendingQueue ? undefined : activeTab;
    const {
        data: allDoctorsResponse,
        isLoading: isAllLoading,
        error: allError,
        refetch: refetchAll
    } = useGetDoctorsQuery(
        {
            page: currentPage,
            limit: doctorsPerPage,
            ...(statusParam ? { status: statusParam } : {})
        },
        { skip: isPendingQueue }
    );

    const activeResponse = isPendingQueue ? pendingResponse : allDoctorsResponse;
    const isLoading = isPendingQueue ? isPendingLoading : isAllLoading;
    const error = isPendingQueue ? pendingError : allError;

    const handleRefresh = () => {
        if (isPendingQueue) {
            refetchPending();
        } else {
            refetchAll();
        }
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        setCurrentPage(1);
        setSearchTerm('');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Extract doctors list and pagination meta
    const rawData = activeResponse?.data?.data || activeResponse?.data || [];
    const paginationMeta = activeResponse?.meta || activeResponse?.data?.meta;

    const doctorRecords = useMemo(() => {
        if (!Array.isArray(rawData)) return [];
        return rawData.map((doctor) => {
            const expiryDate = doctor.mdcnPracticingLicenseExpiryDate
                ? new Date(doctor.mdcnPracticingLicenseExpiryDate)
                : null;
            const isLicenseExpired = expiryDate ? expiryDate.getTime() < Date.now() : null;

            return {
                id: doctor._id,
                name: doctor.userId?.name || 'Unnamed Doctor',
                email: doctor.userId?.email || 'N/A',
                phone: doctor.userId?.phone || 'N/A',
                avatar: getImageUrl(doctor.userId?.profileImage),
                specialty: doctor.specialtyId?.name || 'General Practice',
                organization: doctor.currentOrganization || 'Not Specified',
                mdcnRegistrationNumber: doctor.mdcnRegistrationNumber || 'N/A',
                licenseExpiryDate: doctor.mdcnPracticingLicenseExpiryDate,
                isLicenseExpired,
                verificationStatus: doctor.verificationStatus || (doctor.isVerified ? 'VERIFIED' : 'PENDING'),
                verificationNote: doctor.verificationNote || '',
                isVerified: !!doctor.isVerified,
                createdAt: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }) : 'N/A',
                raw: doctor,
            };
        });
    }, [rawData]);

    // Client-side search filter
    const filteredDoctors = useMemo(() => {
        if (!searchTerm.trim()) return doctorRecords;
        const term = searchTerm.toLowerCase();
        return doctorRecords.filter((doc) =>
            doc.name?.toLowerCase().includes(term) ||
            doc.email?.toLowerCase().includes(term) ||
            doc.phone?.toLowerCase().includes(term) ||
            doc.specialty?.toLowerCase().includes(term) ||
            doc.organization?.toLowerCase().includes(term) ||
            doc.mdcnRegistrationNumber?.toLowerCase().includes(term)
        );
    }, [searchTerm, doctorRecords]);

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'VERIFIED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Verified
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Rejected
                    </span>
                );
            case 'SUSPENDED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-purple-50 text-purple-700 border border-purple-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        Suspended
                    </span>
                );
            case 'PENDING':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Pending
                    </span>
                );
        }
    };

    const renderLicenseExpiry = (expiryDate, isExpired) => {
        if (!expiryDate) {
            return <span className="text-gray-400 text-xs italic">Not Provided</span>;
        }

        const formatted = new Date(expiryDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        if (isExpired) {
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                        <LuTriangleAlert size={12} /> Expired
                    </span>
                    <span className="text-xs text-rose-500">{formatted}</span>
                </div>
            );
        }

        return (
            <div className="flex flex-col">
                <span className="text-xs font-medium text-emerald-700">Valid</span>
                <span className="text-xs text-gray-600">{formatted}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Doctor Review Queue</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage doctor verifications, review MDCN practising licences, and process credentials.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        title="Refresh Queue"
                        className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-[#006C93] hover:border-[#006C93] rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm font-medium shadow-xs"
                    >
                        <LuRefreshCw className={isLoading ? "animate-spin" : ""} size={16} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onSearch={(val) => setSearchTerm(val)}
                        placeholder="Search doctor, email, MDCN..."
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
                {STATUS_FILTERS.map((tab) => {
                    const isActive = activeTab === tab.key;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? 'bg-[#006C93] text-white shadow-xs'
                                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            {Icon && <Icon size={15} />}
                            <span>{tab.label}</span>
                            {tab.key === 'PENDING_QUEUE' && paginationMeta?.total && isPendingQueue ? (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {paginationMeta.total}
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>

            {/* Main Table / Queue List */}
            <div className="space-y-3">
                {/* Table Header Row */}
                <div className="hidden lg:grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-2">
                    <div className="col-span-3">Doctor & Contact</div>
                    <div className="col-span-2">Specialty & Org</div>
                    <div className="col-span-2">MDCN Reg No.</div>
                    <div className="col-span-2">Licence Expiry</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-24 bg-white rounded-xl shadow-xs">
                        <Loader spinning={true} />
                    </div>
                ) : error ? (
                    <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center text-red-600">
                        <LuTriangleAlert className="mx-auto mb-2" size={32} />
                        <p className="font-semibold">Failed to load doctors</p>
                        <p className="text-sm mt-1">{error?.data?.message || 'Something went wrong while connecting to the server.'}</p>
                        <button
                            onClick={handleRefresh}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <CustomCard
                            key={doctor.id}
                            onClick={() => navigate(`/doctor-requests-details/${doctor.id}`, { state: { doctor: doctor.raw } })}
                            className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 py-4 px-6 hover:shadow-md hover:border-[#006C93]/40 border border-gray-100 transition-all duration-200 cursor-pointer"
                        >
                            {/* Doctor info */}
                            <div className="col-span-1 lg:col-span-3 flex items-center gap-3">
                                <img
                                    src={doctor.avatar}
                                    alt={doctor.name}
                                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-100 shadow-2xs bg-gray-50"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = defaultAvatar;
                                    }}
                                />
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm truncate hover:text-[#006C93]" title={doctor.name}>
                                        {doctor.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 truncate" title={doctor.email}>
                                        <LuMail size={12} className="shrink-0 text-gray-400" />
                                        <span className="truncate">{doctor.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                        <LuPhone size={12} className="shrink-0 text-gray-400" />
                                        <span>{doctor.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Specialty & Organization */}
                            <div className="col-span-1 lg:col-span-2">
                                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800 truncate" title={doctor.specialty}>
                                    <LuStethoscope size={14} className="text-[#006C93] shrink-0" />
                                    <span className="truncate">{doctor.specialty}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 truncate" title={doctor.organization}>
                                    <LuBuilding size={13} className="text-gray-400 shrink-0" />
                                    <span className="truncate">{doctor.organization}</span>
                                </div>
                            </div>

                            {/* MDCN Registration Number */}
                            <div className="col-span-1 lg:col-span-2">
                                <div className="text-xs text-gray-400 lg:hidden font-medium">MDCN Reg No:</div>
                                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-800 rounded font-mono text-xs font-semibold border border-gray-200">
                                    {doctor.mdcnRegistrationNumber}
                                </span>
                            </div>

                            {/* Licence Expiry Date */}
                            <div className="col-span-1 lg:col-span-2">
                                <div className="text-xs text-gray-400 lg:hidden font-medium">Licence Expiry:</div>
                                {renderLicenseExpiry(doctor.licenseExpiryDate, doctor.isLicenseExpired)}
                            </div>

                            {/* Status */}
                            <div className="col-span-1 lg:col-span-2 flex lg:justify-center items-center">
                                {renderStatusBadge(doctor.verificationStatus)}
                            </div>

                            {/* Action Button */}
                            <div className="col-span-1 lg:col-span-1 flex justify-end">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/doctor-requests-details/${doctor.id}`, { state: { doctor: doctor.raw } });
                                    }}
                                    className="px-3 py-1.5 bg-[#006C93] hover:bg-[#005877] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                                >
                                    <span>Review</span>
                                    <LuArrowRight size={13} />
                                </button>
                            </div>
                        </CustomCard>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-xs border border-gray-100">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-3">
                            <LuFileCheck size={28} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800">
                            {searchTerm ? 'No matching doctors found' : 'No doctors in this queue'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                            {searchTerm
                                ? `No results found for "${searchTerm}". Try adjusting your keywords.`
                                : activeTab === 'PENDING_QUEUE'
                                ? 'All doctor requests have been processed! Check the verified or all tab for others.'
                                : `There are currently no doctors with status ${activeTab}.`}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!isLoading && filteredDoctors.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Showing page {paginationMeta?.page || currentPage} of {paginationMeta?.totalPages || 1} ({paginationMeta?.total || filteredDoctors.length} total doctors)
                    </p>
                    <CustomPagination
                        showSizeChanger={false}
                        total={paginationMeta?.total || filteredDoctors.length}
                        pageSize={paginationMeta?.limit || doctorsPerPage}
                        onChange={handlePageChange}
                        current={currentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default DoctorRequestsPage;