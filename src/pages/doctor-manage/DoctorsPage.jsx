import React, { useState, useEffect, useMemo } from 'react';
import { FaEye, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import CustomCard from '../../components/common/CustomCard';
// import CustomPopconfirm from '../../components/shared/Popconfirm';
import toast from '../../utils/toast';
// import { LuTrash2 } from 'react-icons/lu';
import DoctorDetailsModal from './modal/DoctorDetailsModal';
import { useNavigate } from 'react-router-dom';
import CustomPagination from '../../components/shared/Pagination';
import { useGetDoctorsQuery, useGetDoctorByIdQuery, useSuspendDoctorMutation, useUnsuspendDoctorMutation } from '../../RTK/doctor/doctorApi';
import Loader from '../../components/shared/Loader';
import { Input, Popover } from 'antd';
import CustomButton from '../../components/shared/Button';
import SearchInput from '../../components/common/SearchInput';

const DoctorsPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);
    const [doctorRecords, setDoctorRecords] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [suspendNote, setSuspendNote] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [suspendDoctor] = useSuspendDoctorMutation();
    const [unsuspendDoctor] = useUnsuspendDoctorMutation();

    const { data: doctorsResponse, isLoading, error } = useGetDoctorsQuery({
        page: currentPage,
        limit: doctorsPerPage
    });

    const { data: fetchedDoctorDetails, isLoading: isLoadingDetails } = useGetDoctorByIdQuery(
        selectedDoctorId,
        { skip: !selectedDoctorId }
    );

    useEffect(() => {
        const rawData = doctorsResponse?.data?.data || doctorsResponse?.data;
        if (rawData && Array.isArray(rawData)) {
            const filteredRaw = rawData.filter(
                (doctor) => !(doctor.verificationStatus === 'PENDING' && doctor.isVerified === false)
            );
            const mappedDoctors = filteredRaw.map((doctor) => ({
                id: doctor._id,
                uid: doctor.userId?.doctorId || 'N/A',
                name: doctor.userId?.name || 'N/A',
                specialist: doctor.specialtyId?.name || 'N/A',
                hospital: doctor.currentOrganization || 'N/A',
                avatar: doctor.userId?.profileImage || 'https://placehold.net/avatar.svg?text=DR&bg=212121',
                phone: doctor.userId?.phone || 'N/A',
                email: doctor.userId?.email || 'N/A',
                requestedDate: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('en-GB') : 'N/A',
                approvalDate: doctor.updatedAt ? new Date(doctor.updatedAt).toLocaleDateString('en-GB') : 'N/A',
                isVerified: doctor.isVerified,
                isBlock: doctor.verificationStatus === 'REJECTED' || !doctor.isVerified,
                about: doctor.about || '',
                services: Array.isArray(doctor.services) ? doctor.services.map(s => (typeof s === 'object' ? s.name : s)) : [],
                experience: Array.isArray(doctor.experiences) ? doctor.experiences.map(exp => ({
                    hospital: exp.organizationName || 'N/A',
                    role: exp.designation || 'N/A',
                    period: `${new Date(exp.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} - ${exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`,
                    duration: `${exp.totalYears || 0} years`
                })) : [],
                documents: doctor.verificationDocuments || [],
            }));
            setDoctorRecords(mappedDoctors);
        }
    }, [doctorsResponse]);

    const handleDelete = (id) => {
        toast.success("Doctor deleted successfully!");
        // mutation call would go here
    };

    const handleSuspend = async (id) => {
        if (!suspendNote.trim()) {
            toast.error("Please provide a reason for suspension");
            return;
        }
        try {
            await suspendDoctor({ id, note: suspendNote }).unwrap();
            toast.success('Doctor suspended successfully!');
            setSuspendNote('');
        } catch (err) {
            toast.error(err?.data?.message || "Failed to suspend doctor");
        }
    };

    const handleUnsuspend = async (id) => {
        try {
            await unsuspendDoctor(id).unwrap();
            toast.success('Doctor unsuspended successfully!');
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
        const doctor = fetchedDoctorDetails?.data;
        if (!doctor) return null;
        return {
            id: doctor._id,
            uid: doctor.userId?.doctorId || 'N/A',
            name: doctor.userId?.name || 'N/A',
            specialist: doctor.specialtyId?.name || 'N/A',
            hospital: doctor.currentOrganization || 'N/A',
            avatar: doctor.userId?.profileImage || 'https://placehold.net/avatar.svg?text=DR&bg=212121',
            phone: doctor.userId?.phone || 'N/A',
            email: doctor.userId?.email || 'N/A',
            requestedDate: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('en-GB') : 'N/A',
            approvalDate: doctor.updatedAt ? new Date(doctor.updatedAt).toLocaleDateString('en-GB') : 'N/A',
            isBlock: doctor.verificationStatus === 'REJECTED' || !doctor.isVerified,
            about: doctor.about || '',
            services: Array.isArray(doctor.services) ? doctor.services.map(s => (typeof s === 'object' ? s.name : s)) : [],
            experience: Array.isArray(doctor.experiences) ? doctor.experiences.map(exp => ({
                hospital: exp.organizationName || 'N/A',
                role: exp.designation || 'N/A',
                period: `${new Date(exp.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} - ${exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`,
                duration: `${exp.totalYears || 0} years`
            })) : [],
            documents: doctor.verificationDocuments || [],
            bankInfo: doctor.bankInfo || {},
        };
    }, [fetchedDoctorDetails]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const filteredDoctors = useMemo(() => {
        if (!searchTerm.trim()) return doctorRecords;
        const term = searchTerm.toLowerCase();
        return doctorRecords.filter((doctor) =>
            doctor.name?.toLowerCase().includes(term) ||
            doctor.email?.toLowerCase().includes(term) ||
            doctor.phone?.toLowerCase().includes(term) ||
            doctor.specialist?.toLowerCase().includes(term) ||
            doctor.hospital?.toLowerCase().includes(term)
        );
    }, [searchTerm, doctorRecords]);

    if (error) {
        return (
            <div className="text-center py-20 text-red-500 font-medium">
                Error loading doctors: {error?.data?.message || 'Something went wrong'}
            </div>
        );
    }

    const paginationMeta = doctorsResponse?.data?.meta || doctorsResponse?.meta;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-6">Doctor Management</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onSearch={handleSearch}
                    placeholder="Search by name, email, specialty..."
                />
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Header */}
                <div className="grid grid-cols-6 gap-10 text-gray-500 font-semibold mb-2 px-8">
                    <div>Doctors</div>
                    <div>Specialties</div>
                    <div>Contact number</div>
                    <div>Email address</div>
                    <div>Added date</div>
                    <div className="text-center">Action</div>
                </div>

                {/* Rows */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader spinning={isLoading} />
                    </div>
                ) : (
                    filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <CustomCard
                                key={doctor.id}
                                className="grid grid-cols-6 items-center gap-10 py-4 px-8 hover:shadow-md transition-all duration-300 cursor-pointer"
                                onClick={() => navigate("/doctor-appointment-list", { state: { doctorId: doctor.id, name: doctor.name, hospital: doctor.hospital, specialist: doctor.specialist } })}

                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={doctor.avatar}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-50"
                                    />
                                    <div className=''>
                                        <div className="font-medium truncate" title={doctor.name}>{doctor.name}</div>
                                        <div className="text-xs">ID: {doctor.uid}</div>
                                    </div>
                                </div>

                                <div className="text-gray-600 truncate" title={doctor.specialist}>{doctor.specialist}</div>
                                <div className="text-gray-600 truncate" title={doctor.phone}>{doctor.phone}</div>
                                <div className="text-gray-600 truncate" title={doctor.email}>{doctor.email}</div>
                                <div className="text-gray-600 truncate" title={doctor.requestedDate}>{doctor.requestedDate}</div>

                                <div
                                    className="flex justify-center items-center gap-3"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* VIEW BUTTON */}
                                    <FaEye title='Doctor Details'
                                        size={22}
                                        className="text-[#0087b8] cursor-pointer hover:text-[#006e96]"
                                        onClick={() => showModal(doctor)}
                                    />
                                    <Popover
                                        trigger={doctor.isVerified ? "click" : "hover"}
                                        placement='top'
                                        title={doctor.isVerified ? "Do you want to Suspend this Doctor?" : "Do you want to Unsuspend this Doctor?"}
                                        content={
                                            <div className="w-64">
                                                {doctor.isVerified ? (
                                                    <>
                                                        <Input.TextArea
                                                            value={suspendNote}
                                                            onChange={(e) => setSuspendNote(e.target.value)}
                                                            placeholder="Reason for suspension"
                                                            rows={3}
                                                        />
                                                        <CustomButton
                                                            className="w-full mt-3!"
                                                            onClick={() => handleSuspend(doctor.id)}
                                                        >
                                                            Suspend
                                                        </CustomButton>
                                                    </>
                                                ) : (
                                                    <CustomButton
                                                        className="w-full"
                                                        onClick={() => handleUnsuspend(doctor.id)}
                                                    >
                                                        Unsuspend
                                                    </CustomButton>
                                                )}
                                            </div>
                                        }
                                    >
                                        <button title="Suspend / Unsuspend" onClick={(e) => e.stopPropagation()}>
                                            {doctor.isVerified ? (
                                                <FaUserCheck size={24} className="text-green-400 hover:text-green-500 transition-colors cursor-pointer" />

                                            ) : (
                                                <FaUserSlash size={24} className="text-red-400 hover:text-red-500 transition-colors cursor-pointer" />
                                            )}
                                        </button>
                                    </Popover>

                                    {/* DELETE */}
                                    {/* <CustomPopconfirm
                                        title="Are you sure to delete this doctor?"
                                        onConfirm={() => handleDelete(doctor.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button title='Delete Doctor' className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                                            <LuTrash2 size={24} />
                                        </button>
                                    </CustomPopconfirm> */}
                                </div>
                            </CustomCard>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500 font-medium">
                            {searchTerm ? `No doctors matched "${searchTerm}"` : 'No doctors found.'}
                        </div>
                    )
                )}
            </div>

            {!isLoading && filteredDoctors.length > 0 && !searchTerm && (
                <div className='flex justify-end mt-6'>
                    <CustomPagination
                        showSizeChanger={false}
                        total={paginationMeta?.total || 0}
                        pageSize={paginationMeta?.limit || doctorsPerPage}
                        onChange={handlePageChange}
                        current={currentPage}
                    />
                </div>
            )}

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
