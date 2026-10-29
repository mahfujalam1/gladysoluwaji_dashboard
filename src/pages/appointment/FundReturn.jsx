import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { useNavigate } from 'react-router-dom';
import CustomPagination from '../../components/shared/Pagination';
import { IoIosArrowBack } from 'react-icons/io';
import { Button } from 'antd';
import { GrDocumentDownload } from 'react-icons/gr';
import { FaEye } from 'react-icons/fa';
import BookingDetails from './modal/BookingDetails';
import defaultAvatar from '../../assets/default-avatar.svg';

const dummyPatients = [
    {
        id: '1',
        patientName: 'Taigo Felipe',
        avatar: defaultAvatar,
        contactNumber: '+1 415 998 7766',
        email: 'tiagofelipe@email.com',
        bookingDate: '10 Nov 2025',
        visitingDate: '12 Nov 2025',
        visitingTime: '11:15 AM',
        visitSpecialties: 'Psychiatrist',
        visitReason: 'Stress & Anxiety Session',
        transferAmount: '12.00',
        status: 'Completed',
        refundStatus: 'Approved',
        detailsInfo: 'Patient reports chronic knee pain.',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Taigo Felipe',
            accountNumber: '5544332211',
        },
        doctorName: 'Dr. Jane Doe',
        doctorSpecialist: 'Dermatologist',
        doctorHospital: 'Bone & Joint Center',
    },
    {
        id: '2',
        patientName: 'Jane Doe',
        avatar: defaultAvatar,
        contactNumber: '+1 415 998 7766',
        email: 'janedoe@email.com',
        bookingDate: '10 Nov 2025',
        visitingDate: '12 Nov 2025',
        visitingTime: '11:15 AM',
        visitSpecialties: 'Psychiatrist',
        visitReason: 'Stress & Anxiety Session',
        transferAmount: '12.00',
        status: 'Canceled',
        refundStatus: 'Approved',
        detailsInfo: 'Patient reports chronic knee pain.',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Jane Doe',
            accountNumber: '5544332211',
        },
        doctorName: 'Dr. John Appleseed',
        doctorSpecialist: 'Cardiologist',
        doctorHospital: 'Bone & Joint Center',
    },
    {
        id: '3',
        patientName: 'John Smith',
        avatar: defaultAvatar,
        contactNumber: '+1 415 998 7766',
        email: 'johnsmith@email.com',
        bookingDate: '10 Nov 2025',
        visitingDate: '12 Nov 2025',
        visitingTime: '11:15 AM',
        visitSpecialties: 'Psychiatrist',
        visitReason: 'Stress & Anxiety Session',
        transferAmount: '12.00',
        status: 'Canceled',
        refundStatus: 'Refunded',
        detailsInfo: 'Patient reports chronic knee pain.',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'John Smith',
            accountNumber: '5544332211',
        },
        doctorName: 'Dr. Sarah Connor',
        doctorSpecialist: 'Orthopedist',
        doctorHospital: 'Bone & Joint Center',
    },
    {
        id: '4',
        patientName: 'Emily Jones',
        avatar: defaultAvatar,
        contactNumber: '+1 415 998 7766',
        email: 'emilyjones@email.com',
        bookingDate: '10 Nov 2025',
        visitingDate: '12 Nov 2025',
        visitingTime: '11:15 AM',
        visitSpecialties: 'Psychiatrist',
        visitReason: 'Stress & Anxiety Session',
        transferAmount: '12.00',
        status: 'Canceled',
        refundStatus: 'Refunded',
        detailsInfo: 'Appointment canceled by patient.',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Emily Jones',
            accountNumber: '5544332211',
        },
        doctorName: 'Dr. Kyle Reese',
        doctorSpecialist: 'Psychiatrist',
        doctorHospital: 'Bone & Joint Center',
    },
    {
        id: '5',
        patientName: 'Michael Brown',
        avatar: defaultAvatar,
        contactNumber: '+1 415 998 7766',
        email: 'michael.brown@email.com',
        bookingDate: '10 Nov 2025',
        visitingDate: '12 Nov 2025',
        visitingTime: '11:15 AM',
        visitSpecialties: 'Psychiatrist',
        visitReason: 'Stress & Anxiety Session',
        transferAmount: '12.00',
        status: 'Canceled',
        refundStatus: 'Refunded',
        detailsInfo: 'Appointment canceled by patient.',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Michael Brown',
            accountNumber: '5544332211',
        },
        doctorName: 'Dr. Kyle Reese',
        doctorSpecialist: 'Psychiatrist',
        doctorHospital: 'Bone & Joint Center',
    },
    {
        id: '6',
        patientName: 'Sarah Wilson',
        avatar: defaultAvatar,
        contactNumber: '+1 415 998 7766',
        email: 'sarah.wilson@email.com',
        bookingDate: '10 Nov 2025',
        visitingDate: '12 Nov 2025',
        visitingTime: '11:15 AM',
        visitSpecialties: 'Psychiatrist',
        visitReason: 'Stress & Anxiety Session',
        transferAmount: '12.00',
        status: 'Canceled',
        refundStatus: 'Refunded',
        detailsInfo: 'Appointment canceled by patient.',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Sarah Wilson',
            accountNumber: '5544332211',
        },
        doctorName: 'Dr. Kyle Reese',
        doctorSpecialist: 'Psychiatrist',
        doctorHospital: 'Bone & Joint Center',
    },

];

const FundReturn = () => {
    const [patients, setPatients] = useState(dummyPatients);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Get current Patients
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const showModal = (patient) => {
        setSelectedPatient(patient);
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedPatient(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="flex items-center text-2xl font-bold mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-3 flex items-center justify-center h-10 w-10 rounded-full bg-white cursor-pointer"
                        aria-label="Go back"
                    >
                        <IoIosArrowBack size={28} />
                    </button>
                    <span>Fund Return to Patient</span>
                </h1>
                <Button className='py-4! px-2! text-lg! hover:border-[#006C93]! hover:text-[#006C93]!'>
                    <GrDocumentDownload />Download
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Header */}
                <div className="grid grid-cols-7 gap-6 text-gray-500 font-semibold mb-2 px-8">
                    <div>Patients</div>
                    <div>Bank Name</div>
                    <div>Account Name</div>
                    <div>Account Number</div>
                    <div>Email Address</div>
                    <div className='text-center'>Transfer Amount</div>
                    <div className='text-center'>Action</div>
                </div>

                {/* Rows */}
                {currentPatients.map((patient) => (
                    <CustomCard
                        key={patient.id}
                        className="grid grid-cols-7 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={patient.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = defaultAvatar;
                                }}
                            />
                            <div className="font-medium">{patient.patientName}</div>
                        </div>

                        <div className="text-gray-600">{patient.bankInfo.bankName}</div>
                        <div className="text-gray-600">{patient.bankInfo.accountName}</div>
                        <div className="text-gray-600">{patient.bankInfo.accountNumber}</div>
                        <div className="text-gray-600">{patient.email}</div>
                        <div className="text-gray-600 text-center">${patient.transferAmount}</div>
                        <div className="justify-items-center">
                            <FaEye
                                size={22}
                                title="Booking Details"
                                className="text-[#0087b8] cursor-pointer hover:text-[#006e96]"
                                onClick={() => showModal(patient)}
                            />
                        </div>
                    </CustomCard>
                ))}
            </div>
            <div className='flex justify-end mt-6'>
                <CustomPagination
                    total={patients.length}
                    pageSize={patientsPerPage}
                    onChange={handlePageChange}
                    current={currentPage}
                />
            </div>
            <BookingDetails
                open={isModalVisible}
                onClose={handleClose}
                appointmentDetails={selectedPatient}
            />
        </div>
    );
};

export default FundReturn;