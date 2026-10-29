import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import CustomSelect from '../../components/common/CustomSelect';
import { FaEye } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingDetailsModal from './modal/BookingDetailsModal';
import { IoIosArrowBack } from 'react-icons/io';
import CustomPagination from '../../components/shared/Pagination';
import { useGetDoctorAppointmentsQuery, useGetDoctorBookingDetailsByIdQuery } from '../../RTK/doctor/doctorApi';
import Loader from '../../components/shared/Loader';
import { getImageUrl, defaultAvatar } from '../../utils/imageUrl';


const DoctorAllAppointments = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);

    const { state } = useLocation();
    const navigate = useNavigate();
    const { doctorId } = state || {};

    const { data: appointmentsData, isLoading, error } = useGetDoctorAppointmentsQuery(doctorId, {
        skip: !doctorId
    });

    React.useEffect(() => {
        if (appointmentsData?.data) {
            const mappedPatients = appointmentsData.data.map(appointment => ({
                id: appointment._id,
                patientName: appointment.patientName,
                avatar: getImageUrl(appointment.patientProfileImage),
                contactNumber: appointment.patientPhone,
                visitingTime: appointment.appointmentTime,
                visitReason: appointment.reasonTitle,
                // Using consultationFee as requested, fallback gracefully if undefined
                appointmentFee: appointment.consultationFee || '0.00',
                status: appointment.status === 'CANCELLED' ? 'Canceled' :
                    appointment.status === 'COMPLETED' ? 'Completed' :
                        appointment.status, // Normalize status string casing if needed
                bookingDate: appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A',
                // Add other fields if available or necessary for modal
                ...appointment
            }));
            setPatients(mappedPatients);
        }
    }, [appointmentsData]);


    const filterOptions = [
        { value: 'All', label: 'All' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Canceled' },
    ];

    const handleFilterChange = (value) => {
        setCurrentPage(1);
        setSelectedFilter(value);
    };




    const showModal = (patient) => {

        setSelectedPatient(patient);
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedPatient(null);
    };

    const filteredPatients = patients.filter(patient => {
        if (selectedFilter === 'All') {
            return true;
        }
        return patient.status === selectedFilter;
    });

    // Pagination logic
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className='flex items-center justify-center mb-6'>
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-3 flex items-center justify-center h-10 w-10 rounded-full bg-white cursor-pointer"
                        aria-label="Go back"
                    >
                        <IoIosArrowBack size={28} />
                    </button>
                    <span className="text-2xl font-bold">{state?.name}'s Appointments</span>
                </div>
                <CustomSelect
                    options={filterOptions}
                    onChange={handleFilterChange}
                    value={selectedFilter}
                />
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Header */}
                <div className="grid grid-cols-6 gap-10 text-gray-500 font-semibold mb-2 px-8">
                    <div>Patient</div>
                    {/* <div>Visit Specialties</div> */}
                    <div>Visit reason</div>
                    <div>Fee</div>
                    <div>Status</div>
                    <div>Booking Date</div>
                    <div className="text-center">Action</div>
                </div>

                {/* Rows */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader spinning={isLoading} />
                    </div>
                ) : (
                    currentPatients.length > 0 ? (
                        currentPatients.map((patient) => (
                            <CustomCard
                                key={patient.id}
                                className="grid grid-cols-6 items-center gap-10 py-4 px-8 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={patient.avatar}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = defaultAvatar;
                                        }}
                                    />
                                    <div className="font-medium">{patient.patientName}</div>
                                </div>

                                <div className="text-gray-600">{patient.visitReason}</div>
                                <div className="text-gray-600">${patient.appointmentFee}</div>
                                <div className={`text-sm px-1 text-center border w-22 rounded-full ${patient.status === "COMPLETED"
                                    ? "text-green-700 bg-green-100 border-green-300"
                                    : "text-red-700 bg-red-100 border-red-300"
                                    }`}>{patient.status}</div>
                                <div className="text-gray-600">{patient.bookingDate}</div>

                                <div
                                    className="flex justify-center items-center gap-3"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <FaEye title='Booking Details'
                                        size={22}
                                        className="text-[#0087b8] cursor-pointer hover:text-[#006e96]"
                                        onClick={() => showModal(patient)}
                                    />
                                </div>

                            </CustomCard>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">No appointments found.</div>
                    )
                )}
            </div>


            <div className='flex justify-end mt-6'>
                <CustomPagination
                    showSizeChanger={false}
                    total={filteredPatients.length}
                    pageSize={patientsPerPage}
                    onChange={handlePageChange}
                    current={currentPage}
                />
            </div>
            <BookingDetailsModal
                open={isModalVisible}
                onClose={handleClose}
                appointmentDetails={selectedPatient}
            />
        </div>
    );
};

export default DoctorAllAppointments;