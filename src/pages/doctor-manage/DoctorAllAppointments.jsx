import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import CustomSelect from '../../components/common/CustomSelect';
import { FaEye } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingDetailsModal from './modal/BookingDetailsModal';
import { IoIosArrowBack } from 'react-icons/io';
import CustomPagination from '../../components/shared/Pagination';


const dummyPatients = [
    {
        id: '1',
        patientName: 'Taigo Felipe',
        avatar: 'https://placehold.net/avatar.svg?text=TF&bg=212121',
        contactNumber: '+234 54564 5565',
        email: 'tiagofelipe@email.com',
        bookingDate: '2 Nov 2025',
        visitingDate: '21 Sep 2025',
        visitingTime: '12:00 PM',
        visitSpecialties: 'Dermatologist',
        visitReason: 'Nail Treatment',
        appointmentFee: '12.00',
        status: 'Completed',
        detailsInfo: 'Detail Info the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.',
        bankInfo: {
            bankName: 'First Bank Of Nigeria',
            accountName: 'Taigo Felipe',
            accountNumber: '2345678901',
        },
    },
    {
        id: '2',
        patientName: 'Jane Doe',
        avatar: 'https://placehold.net/avatar.svg?text=JD&bg=212121',
        contactNumber: '+1 555 123 4567',
        email: 'janedoe@email.com',
        bookingDate: '2 Nov 2025',
        visitingDate: '21 Sep 2025',
        visitingTime: '12:00 PM',
        visitSpecialties: 'Dermatologist',
        visitReason: 'Nail Treatment',
        appointmentFee: '12.00',
        status: 'Completed',
        
        detailsInfo: 'Detail Info the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.',
        bankInfo: {
            bankName: 'Bank of America',
            accountName: 'Jane Doe',
            accountNumber: '1234567890',
        },
    },
    {
        id: '3',
        patientName: 'John Smith',
        avatar: 'https://placehold.net/avatar.svg?text=JS&bg=212121',
        contactNumber: '+44 20 7946 0958',
        email: 'johnsmith@email.com',
        bookingDate: '2 Nov 2025',
        visitingDate: '21 Sep 2025',
        visitingTime: '12:00 PM',
        visitSpecialties: 'Dermatologist',
        visitReason: 'Nail Treatment',
        appointmentFee: '12.00',
        status: 'Canceled',
        refundStatus: 'Approved',
        detailsInfo: 'Detail Info the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.',
        bankInfo: {
            bankName: 'HSBC',
            accountName: 'John Smith',
            accountNumber: '9876543210',
        },
    },
    {
        id: '4',
        patientName: 'Alice Johnson',
        avatar: 'https://placehold.net/avatar.svg?text=AJ&bg=212121',
        contactNumber: '+1 555 111 2222',
        email: 'alice.j@email.com',
        bookingDate: '3 Nov 2025',
        visitingDate: '22 Sep 2025',
        visitingTime: '01:00 PM',
        visitSpecialties: 'Cardiologist',
        visitReason: 'Check-up',
        appointmentFee: '15.00',
        status: 'Completed',
        detailsInfo: 'Some details about Alice Johnson.',
        bankInfo: {
            bankName: 'Wells Fargo',
            accountName: 'Alice Johnson',
            accountNumber: '1234567891',
        },
    },
    {
        id: '5',
        patientName: 'Bob Williams',
        avatar: 'https://placehold.net/avatar.svg?text=BW&bg=212121',
        contactNumber: '+49 176 12345678',
        email: 'bob.w@email.com',
        bookingDate: '4 Nov 2025',
        visitingDate: '23 Sep 2025',
        visitingTime: '02:00 PM',
        visitSpecialties: 'Pediatrician',
        visitReason: 'Vaccination',
        appointmentFee: '10.00',
        status: 'Completed',
        detailsInfo: 'Some details about Bob Williams.',
        bankInfo: {
            bankName: 'Deutsche Bank',
            accountName: 'Bob Williams',
            accountNumber: '9876543211',
        },
    },
    {
        id: '6',
        patientName: 'Charlie Brown',
        avatar: 'https://placehold.net/avatar.svg?text=CB&bg=212121',
        contactNumber: '+33 6 12345678',
        email: 'charlie.b@email.com',
        bookingDate: '5 Nov 2025',
        visitingDate: '24 Sep 2025',
        visitingTime: '03:00 PM',
        visitSpecialties: 'Oncologist',
        visitReason: 'Consultation',
        appointmentFee: '20.00',
        status: 'Canceled',
        refundStatus: 'Refunded',
        detailsInfo: 'Some details about Charlie Brown.',
        bankInfo: {
            bankName: 'BNP Paribas',
            accountName: 'Charlie Brown',
            accountNumber: '1122334456',
        },
    },
];

const DoctorAllAppointments = () => {
    const [patients, setPatients] = useState(dummyPatients);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);

    const filterOptions = [
        { value: 'All', label: 'All' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Canceled', label: 'Canceled' },
    ];

    const handleFilterChange = (value) => {
        setCurrentPage(1);
        setSelectedFilter(value);
    };

    const { state } = useLocation();
    const navigate = useNavigate();


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
                <div className="grid grid-cols-7 gap-10 text-gray-500 font-semibold mb-2 px-8">
                    <div>Patient</div>
                    <div>Visit Specialties</div>
                    <div>Visit reason</div>
                    <div>Fee</div>
                    <div>Status</div>
                    <div>Booking Date</div>
                    <div className="text-center">Action</div>
                </div>

                {/* Rows */}
                {currentPatients.map((patient) => (
                    <CustomCard
                        key={patient.id}
                        className="grid grid-cols-7 items-center gap-10 py-4 px-8 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={patient.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="font-medium">{patient.patientName}</div>
                        </div>

                        <div className="text-gray-600">{patient.visitSpecialties}</div>
                        <div className="text-gray-600">{patient.visitReason}</div>
                        <div className="text-gray-600">${patient.appointmentFee}</div>
                        <div className={`text-sm px-1 text-center border w-20 rounded-full ${patient.status === "Completed"
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
                ))}
            </div>

            <div className='flex justify-end mt-6'>
                <CustomPagination
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