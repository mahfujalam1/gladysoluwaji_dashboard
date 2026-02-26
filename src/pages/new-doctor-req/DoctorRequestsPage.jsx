import React, { useState, useEffect } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { useNavigate } from 'react-router-dom';
import CustomPagination from '../../components/shared/Pagination';
import { useGetNewDoctorsQuery } from '../../RTK/doctor/newDoctor';
import Loader from '../../components/shared/Loader';

const DoctorRequestsPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);
    const [doctorRecords, setDoctorRecords] = useState([]);

    const { data: doctorsResponse, isLoading, error } = useGetNewDoctorsQuery({
        page: currentPage,
        limit: doctorsPerPage
    });

    useEffect(() => {
        const rawData = doctorsResponse?.data?.data || doctorsResponse?.data;
        if (rawData && Array.isArray(rawData)) {
            const mappedDoctors = rawData.map((doctor) => ({
                id: doctor._id,
                name: doctor.userId?.name || 'N/A',
                Specialties: doctor.specialtyId?.name || 'N/A',
                avatar: doctor.userId?.profileImage || 'https://placehold.net/avatar.svg?text=DR&bg=212121',
                doctorContact: doctor.userId?.phone || 'N/A',
                email: doctor.userId?.email || 'N/A',
                requestDate: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
                doctorId: doctor.userId?.doctorId,
                hospital: doctor.currentOrganization || 'N/A',
                documents: doctor.verificationDocuments || [],
                verificationStatus: doctor.verificationStatus,
                isVerified: doctor.isVerified,
                totalExperienceYears: doctor.totalExperienceYears
            }));
            setDoctorRecords(mappedDoctors);
        }
    }, [doctorsResponse]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (error) {
        return (
            <div className="text-center py-20 text-red-500 font-medium">
                Error loading doctor requests: {error?.data?.message || 'Something went wrong'}
            </div>
        );
    }

    const paginationMeta = doctorsResponse?.data?.meta || doctorsResponse?.meta;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-6">New Doctor Request List</h1>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Header */}
                <div className="grid grid-cols-5 gap-6 text-gray-500 font-semibold mb-2 px-8">
                    <div>Doctors</div>
                    <div>Specialties</div>
                    <div>Contact Number</div>
                    <div>Email Address</div>
                    <div>Request Date</div>
                </div>

                {/* Rows */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader spinning={isLoading} />
                    </div>
                ) : (
                    doctorRecords.length > 0 ? (
                        doctorRecords.map((doctor) => (
                            <CustomCard
                                key={doctor.id}
                                onClick={() => navigate("/doctor-requests-details", { state: { doctor } })}
                                className="grid grid-cols-5 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={doctor.avatar}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-50"
                                    />
                                    <div className="font-medium truncate" title={doctor.name}>{doctor.name}</div>
                                </div>

                                <div className="text-gray-600 truncate" title={doctor.Specialties}>{doctor.Specialties}</div>
                                <div className="text-gray-600 truncate" title={doctor.doctorContact}>{doctor.doctorContact}</div>
                                <div className="text-gray-600 truncate" title={doctor.email}>{doctor.email}</div>
                                <div className="text-gray-600 truncate" title={doctor.requestDate}>{doctor.requestDate}</div>
                            </CustomCard>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500 font-medium">
                            No doctor requests found.
                        </div>
                    )
                )}
            </div>

            {!isLoading && doctorRecords.length > 0 && (
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
        </div>
    );
};

export default DoctorRequestsPage;