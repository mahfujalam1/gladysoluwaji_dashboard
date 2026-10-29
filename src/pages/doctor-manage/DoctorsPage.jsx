import React, { useState, useMemo } from 'react';
import CustomCard from '../../components/common/CustomCard';
import toast from '../../utils/toast';
import DoctorDetailsModal from './modal/DoctorDetailsModal';
import { useNavigate } from 'react-router-dom';
import CustomPagination from '../../components/shared/Pagination';
import { getImageUrl, defaultAvatar } from '../../utils/imageUrl';
import {
    useGetDoctorsQuery,
    useGetDoctorByIdQuery,
    useUpdateDoctorStatusMutation,
    useSuspendDoctorMutation,
    useUnsuspendDoctorMutation
} from '../../RTK/doctor/doctorApi';
import Loader from '../../components/shared/Loader';
import { Input, Popover } from 'antd';
import SearchInput from '../../components/common/SearchInput';
import {
    LuClock,
    LuCircleCheck,
    LuCircleX,
    LuBan,
    LuMail,
    LuPhone,
    LuBuilding,
    LuStethoscope,
    LuRefreshCw,
    LuTriangleAlert,
    LuEye,
    LuFileCheck,
    LuCalendarDays,
    LuUserCheck,
    LuUserX,
    LuArrowRight,
    LuShieldAlert
} from 'react-icons/lu';

const STATUS_FILTERS = [
    { key: 'ALL', label: 'All Doctors', icon: null },
    { key: 'VERIFIED', label: 'Verified', icon: LuCircleCheck },
    { key: 'PENDING', label: 'Pending', icon: LuClock },
    { key: 'SUSPENDED', label: 'Suspended', icon: LuBan },
    { key: 'REJECTED', label: 'Rejected', icon: LuCircleX },
];

const DoctorsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [suspendNote, setSuspendNote] = useState('');

    const statusParam = activeTab === 'ALL' ? undefined : activeTab;

    const {
        data: doctorsResponse,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetDoctorsQuery({
        page: currentPage,
        limit: doctorsPerPage,
        ...(statusParam ? { status: statusParam } : {})
    });

    const { data: fetchedDoctorDetails, isLoading: isLoadingDetails } = useGetDoctorByIdQuery(
        selectedDoctorId,
        { skip: !selectedDoctorId }
    );

    const [suspendDoctor, { isLoading: isSuspending }] = useSuspendDoctorMutation();
    const [unsuspendDoctor, { isLoading: isUnsuspending }] = useUnsuspendDoctorMutation();
    const [updateDoctorStatus] = useUpdateDoctorStatusMutation();

    const handleTabChange = (key) => {
        setActiveTab(key);
        setCurrentPage(1);
        setSearchTerm('');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Extract raw data from API response
    const rawData = doctorsResponse?.data?.data || doctorsResponse?.data || [];
    const paginationMeta = doctorsResponse?.meta || doctorsResponse?.data?.meta;

    const doctorRecords = useMemo(() => {
        if (!Array.isArray(rawData)) return [];
        return rawData.map((doctor) => {
            const expiryDate = doctor.mdcnPracticingLicenseExpiryDate
                ? new Date(doctor.mdcnPracticingLicenseExpiryDate)
                : null;
            const isLicenseExpired = expiryDate ? expiryDate.getTime() < Date.now() : null;

            return {
                id: doctor._id,
                uid: doctor.userId?.doctorId || doctor.userId?._id?.slice(-6) || 'N/A',
                name: doctor.userId?.name || 'Unnamed Doctor',
                specialist: doctor.specialtyId?.name || 'General Practice',
                hospital: doctor.currentOrganization || 'Not Specified',
                avatar: getImageUrl(doctor.userId?.profileImage),
                phone: doctor.userId?.phone || 'N/A',
                email: doctor.userId?.email || 'N/A',
                mdcnRegistrationNumber: doctor.mdcnRegistrationNumber || 'N/A',
                licenseExpiryDate: doctor.mdcnPracticingLicenseExpiryDate,
                isLicenseExpired,
                verificationStatus: doctor.verificationStatus || (doctor.isVerified ? 'VERIFIED' : 'PENDING'),
                verificationNote: doctor.verificationNote || '',
                isVerified: !!doctor.isVerified,
                requestedDate: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }) : 'N/A',
                approvalDate: doctor.updatedAt ? new Date(doctor.updatedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }) : 'N/A',
                about: doctor.about || doctor.bio || '',
                services: Array.isArray(doctor.services) ? doctor.services.map(s => (typeof s === 'object' ? s.name : s)) : [],
                experience: Array.isArray(doctor.experiences) ? doctor.experiences.map(exp => ({
                    hospital: exp.organizationName || 'N/A',
                    role: exp.designation || 'N/A',
                    period: `${exp.startDate ? new Date(exp.startDate).getFullYear() : 'N/A'} - ${exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : 'N/A'}`,
                    duration: exp.totalYears ? `${exp.totalYears} years` : ''
                })) : [],
                documents: doctor.verificationDocuments || [],
                raw: doctor,
            };
        });
    }, [rawData]);

    // Client-side search filtering
    const filteredDoctors = useMemo(() => {
        if (!searchTerm.trim()) return doctorRecords;
        const term = searchTerm.toLowerCase();
        return doctorRecords.filter((doc) =>
            doc.name?.toLowerCase().includes(term) ||
            doc.email?.toLowerCase().includes(term) ||
            doc.phone?.toLowerCase().includes(term) ||
            doc.specialist?.toLowerCase().includes(term) ||
            doc.hospital?.toLowerCase().includes(term) ||
            doc.mdcnRegistrationNumber?.toLowerCase().includes(term)
        );
    }, [searchTerm, doctorRecords]);

    const handleSuspend = async (id) => {
        if (!suspendNote.trim()) {
            toast.error("Please provide a reason for suspension");
            return;
        }
        try {
            await suspendDoctor({ id, note: suspendNote.trim() }).unwrap();
            toast.success('Doctor suspended successfully!');
            setSuspendNote('');
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to suspend doctor");
        }
    };

    const handleUnsuspend = async (id) => {
        try {
            await unsuspendDoctor(id).unwrap();
            toast.success('Doctor unsuspended and verified successfully!');
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to unsuspend doctor");
        }
    };

    const showModal = (doctor) => {
        setSelectedDoctorId(doctor.id);
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedDoctorId(null);
    };

    const mappedDetails = useMemo(() => {
        const doc = fetchedDoctorDetails?.data;
        if (!doc) return null;
        return {
            id: doc._id,
            uid: doc.userId?.doctorId || doc.userId?._id?.slice(-6) || 'N/A',
            name: doc.userId?.name || 'N/A',
            specialist: doc.specialtyId?.name || 'N/A',
            hospital: doc.currentOrganization || 'N/A',
            avatar: getImageUrl(doc.userId?.profileImage),
            phone: doc.userId?.phone || 'N/A',
            email: doc.userId?.email || 'N/A',
            requestedDate: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-GB') : 'N/A',
            approvalDate: doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString('en-GB') : 'N/A',
            isBlock: doc.verificationStatus === 'SUSPENDED' || doc.verificationStatus === 'REJECTED' || !doc.isVerified,
            about: doc.about || doc.bio || '',
            services: Array.isArray(doc.services) ? doc.services.map(s => (typeof s === 'object' ? s.name : s)) : [],
            experience: Array.isArray(doc.experiences) ? doc.experiences.map(exp => ({
                hospital: exp.organizationName || 'N/A',
                role: exp.designation || 'N/A',
                period: `${exp.startDate ? new Date(exp.startDate).getFullYear() : 'N/A'} - ${exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : 'N/A'}`,
                duration: exp.totalYears ? `${exp.totalYears} years` : ''
            })) : [],
            documents: doc.verificationDocuments || [
                doc.mdcnPracticingLicenseDocument,
                doc.governmentIdDocument,
                doc.medicalDegreeDocument,
                doc.specialtyCertificateDocument
            ].filter(Boolean),
            bankInfo: doc.bankInfo || {},
        };
    }, [fetchedDoctorDetails]);

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
            return <span className="text-gray-400 text-xs italic whitespace-nowrap">Not Provided</span>;
        }

        const formatted = new Date(expiryDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        if (isExpired) {
            return (
                <div className="flex flex-col whitespace-nowrap">
                    <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                        <LuTriangleAlert size={12} /> Expired
                    </span>
                    <span className="text-xs text-rose-500">{formatted}</span>
                </div>
            );
        }

        return (
            <div className="flex flex-col whitespace-nowrap">
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
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Doctor Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor registered doctors, verify credentials, manage platform access, and view appointments.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        title="Refresh List"
                        className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-[#006C93] hover:border-[#006C93] rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm font-medium shadow-xs disabled:opacity-50"
                    >
                        <LuRefreshCw className={isFetching ? "animate-spin text-[#006C93]" : ""} size={16} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onSearch={(val) => setSearchTerm(val)}
                        placeholder="Search doctor, email, specialty..."
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
                            {tab.key === 'ALL' && paginationMeta?.total ? (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {paginationMeta.total}
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>

            {/* Main Table / Doctor Records */}
            <div className="space-y-3">
                {/* Header Row */}
                <div className="hidden lg:grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-2">
                    <div className="col-span-3">Doctor & Contact</div>
                    <div className="col-span-2">Specialty & Org</div>
                    <div className="col-span-2">MDCN Reg No.</div>
                    <div className="col-span-2">Licence Expiry</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
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
                            onClick={() => refetch()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <CustomCard
                            key={doctor.id}
                            className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 py-4 px-6 hover:shadow-md hover:border-[#006C93]/40 border border-gray-100 transition-all duration-200"
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
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-semibold text-gray-900 text-sm truncate" title={doctor.name}>
                                            {doctor.name}
                                        </h3>
                                    </div>
                                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                                        ID: {doctor.uid}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 truncate" title={doctor.email}>
                                        <LuMail size={12} className="shrink-0 text-gray-400" />
                                        <span className="truncate">{doctor.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Specialty & Organization */}
                            <div className="col-span-1 lg:col-span-2">
                                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800 truncate" title={doctor.specialist}>
                                    <LuStethoscope size={14} className="text-[#006C93] shrink-0" />
                                    <span className="truncate">{doctor.specialist}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 truncate" title={doctor.hospital}>
                                    <LuBuilding size={13} className="text-gray-400 shrink-0" />
                                    <span className="truncate">{doctor.hospital}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                                    <LuPhone size={12} className="shrink-0" />
                                    <span>{doctor.phone}</span>
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

                            {/* Action Buttons */}
                            <div className="col-span-1 lg:col-span-1 flex items-center justify-end gap-1.5">
                                {/* Appointments Button */}
                                <button
                                    onClick={() => navigate("/doctor-appointment-list", {
                                        state: {
                                            doctorId: doctor.id,
                                            name: doctor.name,
                                            hospital: doctor.hospital,
                                            specialist: doctor.specialist
                                        }
                                    })}
                                    title="View Appointments"
                                    className="p-2 bg-gray-50 hover:bg-[#006C93] text-gray-600 hover:text-white rounded-lg border border-gray-200 hover:border-[#006C93] transition-colors cursor-pointer"
                                >
                                    <LuCalendarDays size={16} />
                                </button>

                                {/* Review / Credentials Page */}
                                <button
                                    onClick={() => navigate(`/doctor-requests-details/${doctor.id}`, { state: { doctor: doctor.raw } })}
                                    title="Review Credentials / Details"
                                    className="p-2 bg-gray-50 hover:bg-[#006C93] text-gray-600 hover:text-white rounded-lg border border-gray-200 hover:border-[#006C93] transition-colors cursor-pointer"
                                >
                                    <LuEye size={16} />
                                </button>

                                {/* Suspend / Unsuspend Action Popover */}
                                <Popover
                                    trigger="click"
                                    placement="topRight"
                                    title={
                                        <div className="text-xs font-bold text-gray-800 pb-1 border-b border-gray-100">
                                            {doctor.verificationStatus === 'SUSPENDED' ? 'Unsuspend Doctor' : 'Suspend Doctor'}
                                        </div>
                                    }
                                    content={
                                        <div className="w-64 pt-2 space-y-3">
                                            {doctor.verificationStatus === 'SUSPENDED' ? (
                                                <>
                                                    <p className="text-xs text-gray-600">
                                                        Do you want to unsuspend <strong>{doctor.name}</strong> and restore full verified access?
                                                    </p>
                                                    <button
                                                        onClick={() => handleUnsuspend(doctor.id)}
                                                        disabled={isUnsuspending}
                                                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                    >
                                                        {isUnsuspending ? 'Processing...' : 'Confirm Unsuspend'}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-xs text-gray-600">
                                                        Provide a reason for suspending <strong>{doctor.name}</strong>:
                                                    </p>
                                                    <Input.TextArea
                                                        value={suspendNote}
                                                        onChange={(e) => setSuspendNote(e.target.value)}
                                                        placeholder="Reason for suspension..."
                                                        rows={3}
                                                        className="text-xs!"
                                                    />
                                                    <button
                                                        onClick={() => handleSuspend(doctor.id)}
                                                        disabled={isSuspending}
                                                        className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                    >
                                                        {isSuspending ? 'Processing...' : 'Confirm Suspension'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    }
                                >
                                    <button
                                        title={doctor.verificationStatus === 'SUSPENDED' ? 'Unsuspend Doctor' : 'Suspend Doctor'}
                                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                            doctor.verificationStatus === 'SUSPENDED'
                                                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                        }`}
                                    >
                                        {doctor.verificationStatus === 'SUSPENDED' ? (
                                            <LuUserX size={16} />
                                        ) : (
                                            <LuUserCheck size={16} />
                                        )}
                                    </button>
                                </Popover>
                            </div>
                        </CustomCard>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-xs border border-gray-100">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-3">
                            <LuFileCheck size={28} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800">
                            {searchTerm ? 'No matching doctors found' : 'No doctors in this section'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                            {searchTerm
                                ? `No results found for "${searchTerm}". Try adjusting your keywords.`
                                : activeTab === 'ALL'
                                ? 'No doctor records found in the database.'
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

            {/* Modal for doctor details */}
            <DoctorDetailsModal
                open={isModalVisible}
                onClose={handleClose}
                doctor={mappedDetails || doctorRecords.find(d => d.id === selectedDoctorId)}
                isLoading={isLoadingDetails}
            />
        </div>
    );
};

export default DoctorsPage;
