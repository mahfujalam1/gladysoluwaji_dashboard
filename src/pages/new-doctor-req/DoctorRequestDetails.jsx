import React, { useState, useMemo } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { IoIosArrowBack } from 'react-icons/io';
import { Image, Modal, Input } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from '../../utils/toast';
import {
    useGetDoctorReviewDetailsQuery,
    useUpdateDoctorStatusMutation
} from '../../RTK/doctor/newDoctor';
import Loader from '../../components/shared/Loader';
import {
    LuCircleCheck,
    LuCircleX,
    LuBan,
    LuClock,
    LuTriangleAlert,
    LuFileCheck,
    LuFileText,
    LuExternalLink,
    LuRefreshCw,
    LuShieldCheck,
    LuShieldAlert,
    LuUser,
    LuMail,
    LuPhone,
    LuBuilding,
    LuStethoscope,
    LuCalendar,
    LuAward,
    LuBriefcase,
    LuInfo,
    LuRotateCcw
} from 'react-icons/lu';

const DoctorRequestDetails = () => {
    const { id: paramId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    // Determine Doctor ID from route param or router state
    const doctorId = paramId || state?.doctor?.id || state?.doctor?._id;

    // Fetch doctor review details from GET /api/doctors/admin/:id
    const {
        data: detailsResponse,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetDoctorReviewDetailsQuery(doctorId, {
        skip: !doctorId,
        refetchOnMountOrArgChange: true,
    });

    const [updateDoctorStatus, { isLoading: isUpdating }] = useUpdateDoctorStatusMutation();

    // Action Modal State
    const [actionModal, setActionModal] = useState({
        isOpen: false,
        type: null, // 'VERIFIED' | 'REJECTED' | 'SUSPENDED' | 'PENDING'
        note: '',
    });

    // Extract doctor details
    const doctor = detailsResponse?.data || state?.doctor;

    const profile = doctor?.userId || {};
    const specialtyName = doctor?.specialtyId?.name || (typeof doctor?.specialtyId === 'string' ? doctor.specialtyId : 'General Medicine');
    const organization = doctor?.currentOrganization || 'Not Specified';
    const mdcnNumber = doctor?.mdcnRegistrationNumber || '';
    const licenseExpiry = doctor?.mdcnPracticingLicenseExpiryDate;
    const verificationStatus = doctor?.verificationStatus || (doctor?.isVerified ? 'VERIFIED' : 'PENDING');
    const verificationNote = doctor?.verificationNote || '';

    // Check MDCN Compliance Criteria for Approval
    const compliance = useMemo(() => {
        const hasMdcnNumber = !!mdcnNumber.trim();
        const hasLicenseDoc = !!doctor?.mdcnPracticingLicenseDocument;
        const expiryDate = licenseExpiry ? new Date(licenseExpiry) : null;
        const isFutureExpiry = expiryDate ? expiryDate.getTime() > Date.now() : false;

        const isFullyCompliant = hasMdcnNumber && hasLicenseDoc && isFutureExpiry;

        return {
            hasMdcnNumber,
            hasLicenseDoc,
            isFutureExpiry,
            expiryDate,
            isFullyCompliant,
        };
    }, [mdcnNumber, doctor?.mdcnPracticingLicenseDocument, licenseExpiry]);

    const openActionModal = (type) => {
        let defaultNote = '';
        if (type === 'VERIFIED') {
            defaultNote = 'MDCN registration and current practising licence reviewed.';
        } else if (type === 'REJECTED') {
            defaultNote = 'Please provide a current practising licence.';
        } else if (type === 'SUSPENDED') {
            defaultNote = 'Verification requires further review.';
        } else if (type === 'PENDING') {
            defaultNote = 'Awaiting updated licence documents.';
        }

        setActionModal({
            isOpen: true,
            type,
            note: defaultNote,
        });
    };

    const handleConfirmAction = async () => {
        const { type, note } = actionModal;
        if (!type || !doctorId) return;

        // Validation for reject / suspend where a meaningful reason is strongly required
        if ((type === 'REJECTED' || type === 'SUSPENDED') && !note.trim()) {
            toast.error('Please enter a note explaining the reason for this action.');
            return;
        }

        try {
            const res = await updateDoctorStatus({
                id: doctorId,
                status: type,
                note: note.trim(),
            }).unwrap();

            toast.success(res?.message || `Doctor status updated to ${type} successfully!`);
            setActionModal({ isOpen: false, type: null, note: '' });
            refetch();
        } catch (err) {
            const errorMsg = err?.data?.message || err?.message || 'Failed to update doctor status. Please try again.';
            toast.error(errorMsg);
            // Doctor remains in current status; do NOT show success
        }
    };

    if (!doctorId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-xl shadow-xs">
                <LuTriangleAlert className="text-amber-500 mb-3" size={48} />
                <h2 className="text-xl font-bold text-gray-800">Doctor Not Specified</h2>
                <p className="text-gray-500 mt-1 max-w-md">
                    No doctor ID was provided. Please select a doctor from the review queue.
                </p>
                <button
                    onClick={() => navigate('/doctor-requests')}
                    className="mt-5 px-5 py-2.5 bg-[#006C93] hover:bg-[#005877] text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Back to Review Queue
                </button>
            </div>
        );
    }

    if (isLoading && !doctor) {
        return (
            <div className="flex flex-col justify-center items-center py-32 bg-white rounded-xl shadow-xs">
                <Loader spinning={true} />
                <p className="text-sm text-gray-500 mt-4">Loading doctor review details...</p>
            </div>
        );
    }

    if (error && !doctor) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 max-w-2xl mx-auto my-12">
                <LuTriangleAlert className="mx-auto mb-3" size={40} />
                <h2 className="text-lg font-bold">Failed to load doctor details</h2>
                <p className="text-sm mt-1">{error?.data?.message || 'The server returned an error while retrieving this doctor record.'}</p>
                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={() => navigate('/doctor-requests')}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        Return to Queue
                    </button>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const renderDocumentCard = (title, url, isRequired = false) => {
        const isPdf = url?.toLowerCase().includes('.pdf');

        return (
            <div className="flex flex-col justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {title}
                        </span>
                        {isRequired ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                Required
                            </span>
                        ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                                Optional
                            </span>
                        )}
                    </div>

                    {url ? (
                        <div className="mt-2">
                            {isPdf ? (
                                <div className="h-40 rounded-lg bg-red-50 border border-red-100 flex flex-col items-center justify-center p-4 text-center">
                                    <LuFileText className="text-red-500 mb-2" size={36} />
                                    <span className="text-xs font-semibold text-gray-700">PDF Document</span>
                                    <span className="text-[11px] text-gray-400 mt-1 truncate max-w-full">
                                        Click below to view file
                                    </span>
                                </div>
                            ) : (
                                <div className="relative h-40 rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center group">
                                    <Image
                                        src={url}
                                        alt={title}
                                        className="h-40! w-full! object-cover"
                                        fallback="https://placehold.net/document.svg?text=Document&bg=f3f4f6"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-40 rounded-lg border-2 border-dashed border-gray-300 bg-white/60 flex flex-col items-center justify-center p-4 text-center mt-2">
                            <LuFileText className="text-gray-300 mb-2" size={32} />
                            <span className="text-xs font-medium text-gray-500">Not Uploaded</span>
                            <span className="text-[11px] text-gray-400 mt-0.5">Doctor has not provided this document</span>
                        </div>
                    )}
                </div>

                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-gray-100 text-[#006C93] text-xs font-semibold rounded-lg border border-gray-200 transition-colors shadow-2xs"
                    >
                        <span>Open Document</span>
                        <LuExternalLink size={13} />
                    </a>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Top Navigation & Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/doctor-requests')}
                        className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#006C93] hover:border-[#006C93] shadow-2xs transition-all cursor-pointer"
                        aria-label="Back to queue"
                    >
                        <IoIosArrowBack size={22} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Doctor Review Details</h1>
                            {verificationStatus === 'VERIFIED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                    <LuCircleCheck size={13} /> Verified & Active
                                </span>
                            )}
                            {verificationStatus === 'PENDING' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                    <LuClock size={13} /> Pending Review
                                </span>
                            )}
                            {verificationStatus === 'REJECTED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                                    <LuCircleX size={13} /> Rejected
                                </span>
                            )}
                            {verificationStatus === 'SUSPENDED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                    <LuBan size={13} /> Suspended
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            ID: <span className="font-mono text-gray-700">{doctorId}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        title="Reload latest details and document URLs"
                        className="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 hover:text-[#006C93] hover:border-[#006C93] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                        <LuRefreshCw className={isFetching ? 'animate-spin text-[#006C93]' : ''} size={14} />
                        <span>{isFetching ? 'Refreshing...' : 'Refresh Details'}</span>
                    </button>
                </div>
            </div>

            {/* Verification Note Banner (if any) */}
            {verificationNote && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    verificationStatus === 'REJECTED'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : verificationStatus === 'SUSPENDED'
                        ? 'bg-purple-50 border-purple-200 text-purple-800'
                        : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                    <LuInfo size={20} className="shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                            Latest Review Note ({verificationStatus})
                        </h4>
                        <p className="text-sm mt-0.5 leading-relaxed font-medium">{verificationNote}</p>
                    </div>
                </div>
            )}

            {/* MDCN Compliance Checklist Banner */}
            <div className={`p-5 rounded-xl border ${
                compliance.isFullyCompliant
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-amber-50/70 border-amber-200'
            }`}>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        {compliance.isFullyCompliant ? (
                            <LuShieldCheck className="text-emerald-600 shrink-0" size={24} />
                        ) : (
                            <LuShieldAlert className="text-amber-600 shrink-0" size={24} />
                        )}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                {compliance.isFullyCompliant
                                    ? 'MDCN Approval Requirements Satisfied'
                                    : 'MDCN Verification Checklist (Mandatory for Approval)'}
                            </h3>
                            <p className="text-xs text-gray-600 mt-0.5">
                                {compliance.isFullyCompliant
                                    ? 'All criteria required by the backend to approve this doctor have been verified.'
                                    : 'Backend validation rejects approval unless registration number, practising licence document, and a future expiry date are all present.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    {/* Item 1: Registration Number */}
                    <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                        compliance.hasMdcnNumber ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-white border-rose-200 text-rose-800'
                    }`}>
                        {compliance.hasMdcnNumber ? (
                            <LuCircleCheck className="text-emerald-600 shrink-0" size={18} />
                        ) : (
                            <LuCircleX className="text-rose-500 shrink-0" size={18} />
                        )}
                        <div className="min-w-0">
                            <span className="text-[11px] font-semibold uppercase tracking-wider block text-gray-500">MDCN Reg No.</span>
                            <span className="text-xs font-bold truncate block">
                                {compliance.hasMdcnNumber ? mdcnNumber : 'Missing'}
                            </span>
                        </div>
                    </div>

                    {/* Item 2: Licence Document */}
                    <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                        compliance.hasLicenseDoc ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-white border-rose-200 text-rose-800'
                    }`}>
                        {compliance.hasLicenseDoc ? (
                            <LuCircleCheck className="text-emerald-600 shrink-0" size={18} />
                        ) : (
                            <LuCircleX className="text-rose-500 shrink-0" size={18} />
                        )}
                        <div className="min-w-0">
                            <span className="text-[11px] font-semibold uppercase tracking-wider block text-gray-500">Licence Document</span>
                            <span className="text-xs font-bold truncate block">
                                {compliance.hasLicenseDoc ? 'File Uploaded' : 'Not Uploaded'}
                            </span>
                        </div>
                    </div>

                    {/* Item 3: Expiry Date */}
                    <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                        compliance.isFutureExpiry ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-white border-rose-200 text-rose-800'
                    }`}>
                        {compliance.isFutureExpiry ? (
                            <LuCircleCheck className="text-emerald-600 shrink-0" size={18} />
                        ) : (
                            <LuTriangleAlert className="text-rose-500 shrink-0" size={18} />
                        )}
                        <div className="min-w-0">
                            <span className="text-[11px] font-semibold uppercase tracking-wider block text-gray-500">Licence Expiry</span>
                            <span className="text-xs font-bold truncate block">
                                {compliance.expiryDate ? (
                                    compliance.isFutureExpiry
                                        ? `Valid (${compliance.expiryDate.toLocaleDateString('en-GB')})`
                                        : `Expired (${compliance.expiryDate.toLocaleDateString('en-GB')})`
                                ) : 'Date Missing'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Overview Card */}
            <CustomCard className="p-6 md:p-8 border border-gray-100 shadow-xs">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <img
                            src={profile.profileImage || 'https://placehold.net/avatar.svg?text=DR&bg=212121'}
                            alt={profile.name || 'Doctor'}
                            className="w-24 h-24 rounded-2xl object-cover border border-gray-200 shadow-xs bg-gray-50"
                            onError={(e) => {
                                e.target.src = 'https://placehold.net/avatar.svg?text=DR&bg=212121';
                            }}
                        />
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-bold text-gray-900">{profile.name || 'Dr. Unnamed'}</h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#006C93]/10 text-[#006C93]">
                                    {specialtyName}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <LuBuilding size={14} className="text-gray-400 shrink-0" />
                                    <span className="font-medium text-gray-800">{organization}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LuMail size={14} className="text-gray-400 shrink-0" />
                                    <span>{profile.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LuPhone size={14} className="text-gray-400 shrink-0" />
                                    <span>{profile.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LuAward size={14} className="text-gray-400 shrink-0" />
                                    <span>MDCN: <strong className="font-mono">{mdcnNumber || 'N/A'}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-right text-xs text-gray-500 space-y-1 self-start md:self-auto">
                        <div>
                            Registered: <span className="font-semibold text-gray-800">
                                {doctor?.createdAt ? new Date(doctor.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                            </span>
                        </div>
                        <div>
                            Last Updated: <span className="font-semibold text-gray-800">
                                {doctor?.updatedAt ? new Date(doctor.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bio / About */}
                <div className="pt-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Doctor Biography & Profile</h3>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                        {doctor?.about || doctor?.bio || 'No professional biography or description provided by the doctor.'}
                    </p>
                </div>

                {/* Services & Experience Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    {/* Services */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <LuStethoscope className="text-[#006C93]" size={16} />
                            Services & Procedures
                        </h3>
                        {Array.isArray(doctor?.services) && doctor.services.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {doctor.services.map((service, index) => {
                                    const serviceName = typeof service === 'object' ? service.name : service;
                                    return (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg shadow-2xs"
                                        >
                                            {serviceName}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No services registered yet.</p>
                        )}
                    </div>

                    {/* Experiences */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <LuBriefcase className="text-[#006C93]" size={16} />
                            Clinical Experience
                        </h3>
                        {Array.isArray(doctor?.experiences) && doctor.experiences.length > 0 ? (
                            <div className="space-y-2.5">
                                {doctor.experiences.map((exp, index) => (
                                    <div key={index} className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs">
                                        <div className="font-semibold text-gray-800">{exp.designation || 'Specialist Doctor'}</div>
                                        <div className="text-gray-600 font-medium">{exp.organizationName || 'Hospital / Clinic'}</div>
                                        <div className="text-gray-400 text-[11px] mt-0.5">
                                            {exp.startDate ? new Date(exp.startDate).getFullYear() : 'N/A'} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : 'N/A'}
                                            {exp.totalYears ? ` (${exp.totalYears} years)` : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No clinical experience recorded.</p>
                        )}
                    </div>
                </div>
            </CustomCard>

            {/* Verification Documents Section */}
            <CustomCard className="p-6 md:p-8 border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Verification Documents</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Click any image to preview or use the button to open the full file in a new tab.
                        </p>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                        Total Uploads: {[
                            doctor?.mdcnPracticingLicenseDocument,
                            doctor?.governmentIdDocument,
                            doctor?.medicalDegreeDocument,
                            doctor?.specialtyCertificateDocument
                        ].filter(Boolean).length}
                    </span>
                </div>

                <Image.PreviewGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. MDCN Practising Licence (Mandatory) */}
                        {renderDocumentCard(
                            'MDCN Practising Licence',
                            doctor?.mdcnPracticingLicenseDocument,
                            true
                        )}

                        {/* 2. Government ID */}
                        {renderDocumentCard(
                            'Government ID',
                            doctor?.governmentIdDocument,
                            false
                        )}

                        {/* 3. Medical Degree */}
                        {renderDocumentCard(
                            'Medical Degree',
                            doctor?.medicalDegreeDocument,
                            false
                        )}

                        {/* 4. Specialty Certificate */}
                        {renderDocumentCard(
                            'Specialty Certificate',
                            doctor?.specialtyCertificateDocument,
                            false
                        )}
                    </div>

                    {/* Any Extra Documents uploaded in verificationDocuments */}
                    {Array.isArray(doctor?.verificationDocuments) && doctor.verificationDocuments.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                                Additional Verification Documents ({doctor.verificationDocuments.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {doctor.verificationDocuments.map((docUrl, idx) =>
                                    renderDocumentCard(`Document #${idx + 1}`, docUrl, false)
                                )}
                            </div>
                        </div>
                    )}
                </Image.PreviewGroup>
            </CustomCard>

            {/* Admin Decision Action Card */}
            <CustomCard className="p-6 md:p-8 border border-gray-100 shadow-xs bg-linear-to-r from-gray-50 to-white">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Admin Review Decision</h2>
                        <p className="text-xs text-gray-500 mt-1 max-w-xl">
                            Select an action below to update the verification status for <strong>{profile.name || 'this doctor'}</strong>.
                            You can provide an optional or mandatory note to communicate requirements to the doctor.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Return to Pending (if not already pending) */}
                        {verificationStatus !== 'PENDING' && (
                            <button
                                onClick={() => openActionModal('PENDING')}
                                className="px-4 py-2.5 bg-white border border-gray-300 hover:border-amber-400 text-gray-700 hover:text-amber-700 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <LuRotateCcw size={14} />
                                <span>Return to Pending</span>
                            </button>
                        )}

                        {/* Suspend Doctor (if verified) */}
                        {verificationStatus === 'VERIFIED' && (
                            <button
                                onClick={() => openActionModal('SUSPENDED')}
                                className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <LuBan size={14} />
                                <span>Suspend Doctor</span>
                            </button>
                        )}

                        {/* Reject Doctor */}
                        {verificationStatus !== 'REJECTED' && (
                            <button
                                onClick={() => openActionModal('REJECTED')}
                                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <LuCircleX size={14} />
                                <span>Reject Application</span>
                            </button>
                        )}

                        {/* Approve Doctor (VERIFIED) */}
                        <button
                            onClick={() => openActionModal('VERIFIED')}
                            className={`px-5 py-2.5 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                                compliance.isFullyCompliant
                                    ? 'bg-[#006C93] hover:bg-[#005877]'
                                    : 'bg-amber-600 hover:bg-amber-700'
                            }`}
                        >
                            <LuCircleCheck size={15} />
                            <span>{verificationStatus === 'VERIFIED' ? 'Re-Approve / Update' : 'Approve Doctor'}</span>
                        </button>
                    </div>
                </div>
            </CustomCard>

            {/* Action Confirmation Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
                        {actionModal.type === 'VERIFIED' && <LuCircleCheck className="text-emerald-600" size={20} />}
                        {actionModal.type === 'REJECTED' && <LuCircleX className="text-rose-600" size={20} />}
                        {actionModal.type === 'SUSPENDED' && <LuBan className="text-purple-600" size={20} />}
                        {actionModal.type === 'PENDING' && <LuRotateCcw className="text-amber-600" size={20} />}
                        <span>
                            {actionModal.type === 'VERIFIED' && 'Approve Doctor Verification'}
                            {actionModal.type === 'REJECTED' && 'Reject Doctor Application'}
                            {actionModal.type === 'SUSPENDED' && 'Suspend Doctor Account'}
                            {actionModal.type === 'PENDING' && 'Return Doctor to Pending Queue'}
                        </span>
                    </div>
                }
                open={actionModal.isOpen}
                onCancel={() => setActionModal({ isOpen: false, type: null, note: '' })}
                centered
                footer={null}
                width={520}
            >
                <div className="py-4 space-y-4">
                    {/* Notice for approval validation */}
                    {actionModal.type === 'VERIFIED' && (
                        <div>
                            {!compliance.isFullyCompliant ? (
                                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs space-y-1">
                                    <div className="font-bold flex items-center gap-1">
                                        <LuTriangleAlert size={14} /> Attention: Backend Criteria Warning
                                    </div>
                                    <p>
                                        The backend rejects a VERIFIED update unless MDCN registration number, practising licence document, and a future licence expiry date are present.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-600">
                                    This will mark the doctor as verified. The doctor will become bookable by patients on the platform.
                                </p>
                            )}
                        </div>
                    )}

                    {actionModal.type === 'REJECTED' && (
                        <p className="text-xs text-gray-600">
                            Please provide a clear reason for rejecting this application so the doctor knows what needs correction.
                        </p>
                    )}

                    {actionModal.type === 'SUSPENDED' && (
                        <p className="text-xs text-gray-600">
                            Please state the reason for suspension. While suspended, the doctor will not be bookable by patients.
                        </p>
                    )}

                    {actionModal.type === 'PENDING' && (
                        <p className="text-xs text-gray-600">
                            This will return the doctor to the pending review queue awaiting updated licence documents.
                        </p>
                    )}

                    {/* Note TextArea */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Review Note / Reason {(actionModal.type === 'REJECTED' || actionModal.type === 'SUSPENDED') ? '(Required)' : '(Optional)'}:
                        </label>
                        <Input.TextArea
                            value={actionModal.note}
                            onChange={(e) => setActionModal((prev) => ({ ...prev, note: e.target.value }))}
                            rows={3}
                            placeholder={
                                actionModal.type === 'REJECTED'
                                    ? 'e.g. Please provide a current practising licence.'
                                    : actionModal.type === 'SUSPENDED'
                                    ? 'e.g. Verification requires further review.'
                                    : 'Enter note or comment...'
                            }
                            className="text-xs!"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setActionModal({ isOpen: false, type: null, note: '' })}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmAction}
                            disabled={isUpdating}
                            className={`px-5 py-2 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                                actionModal.type === 'VERIFIED'
                                    ? 'bg-[#006C93] hover:bg-[#005877]'
                                    : actionModal.type === 'REJECTED'
                                    ? 'bg-rose-600 hover:bg-rose-700'
                                    : actionModal.type === 'SUSPENDED'
                                    ? 'bg-purple-600 hover:bg-purple-700'
                                    : 'bg-amber-600 hover:bg-amber-700'
                            } disabled:opacity-50`}
                        >
                            {isUpdating ? (
                                <span>Processing...</span>
                            ) : (
                                <span>Confirm {actionModal.type === 'VERIFIED' ? 'Approval' : actionModal.type}</span>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DoctorRequestDetails;
