import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { useNavigate } from 'react-router-dom';
import CustomPagination from '../../components/shared/Pagination';
import { FaEye, FaRegCheckCircle } from 'react-icons/fa';
import CustomSelect from '../../components/common/CustomSelect';
import BookingDetails from './modal/BookingDetails';
import { PiArrowCircleUpRightBold } from 'react-icons/pi';
import { Button } from 'antd';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import toast from '../../utils/toast';

export const dummyBooking = [
    {
        id: '3',
        patientName: 'Ahmed Rahman',
        avatar: 'https://placehold.net/avatar.svg?text=AR&bg=22C55E',
        contactNumber: '+880 1712 345678',
        email: 'ahmed.rahman@email.com',
        bookingDate: '1 Dec 2025',
        visitingDate: '5 Dec 2025',
        visitingTime: '03:45 PM',
        visitSpecialties: 'Orthopedist',
        visitReason: 'Knee Pain Consultation',
        appointmentFee: '12.00',
        status: 'Pending',
        refundStatus: [],
        detailsInfo: 'Patient reports chronic knee pain.',
        bankInfo: {
            bankName: 'HSBC',
            accountName: 'Ahmed Rahman',
            accountNumber: '1122334456',
        },
        doctorName: 'Dr. Sarah Connor',
        doctorSpecialist: 'Orthopedist',
        doctorHospital: 'Bone & Joint Center',
    },
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
        refundStatus: [],
        detailsInfo: 'Patient successfully completed nail treatment.',
        bankInfo: {
            bankName: 'Bank Of America',
            accountName: 'Taigo Felipe',
            accountNumber: '1122334456',
        },
        doctorName: 'Dr. Jane Doe',
        doctorSpecialist: 'Dermatologist',
        doctorHospital: 'Bone & Joint Center',
    },
    {
        id: '2',
        patientName: 'Maria Gonzales',
        avatar: 'https://placehold.net/avatar.svg?text=MG&bg=8B5CF6',
        contactNumber: '+34 61234 9876',
        email: 'maria.g@email.com',
        bookingDate: '15 Oct 2025',
        visitingDate: '18 Oct 2025',
        visitingTime: '09:30 AM',
        visitSpecialties: 'Cardiologist',
        visitReason: 'Heart Checkup',
        appointmentFee: '12.00',
        status: 'Completed',
        refundStatus: 'Approved',
        detailsInfo: 'Routine cardiac examination completed.',
        bankInfo: {
            bankName: 'City Bank',
            accountName: 'Maria Gonzales',
            accountNumber: '1122334456',
        },
        doctorName: 'Dr. John Appleseed',
        doctorSpecialist: 'Cardiologist',
        doctorHospital: 'Bone & Joint Center',
    },
    {
        id: '4',
        patientName: 'Emily Watson',
        avatar: 'https://placehold.net/avatar.svg?text=EW&bg=F97316',
        contactNumber: '+1 415 998 7766',
        email: 'emily.watson@email.com',
        bookingDate: '10 Nov 2025',
        visitingDate: '12 Nov 2025',
        visitingTime: '11:15 AM',
        visitSpecialties: 'Psychiatrist',
        visitReason: 'Stress & Anxiety Session',
        appointmentFee: '12.00',
        status: 'Canceled',
        refundStatus: 'Pending',
        detailsInfo: 'Appointment canceled by patient.',
        bankInfo: {
            bankName: 'BNP Paribas',
            accountName: 'Emily Watson',
            accountNumber: '1122334456',
        },
        doctorName: 'Dr. Kyle Reese',
        doctorSpecialist: 'Psychiatrist',
        doctorHospital: 'Bone & Joint Center',
    },
    {
        id: '5',
        patientName: 'Emily Watson',
        avatar: 'https://placehold.net/avatar.svg?text=EW&bg=F97316',
        contactNumber: '+1 415 998 7766',
        email: 'emily.watson@email.com',
        bookingDate: '10 Nov 2025',
        visitingDate: '12 Nov 2025',
        visitingTime: '11:15 AM',
        visitSpecialties: 'Psychiatrist',
        visitReason: 'Stress & Anxiety Session',
        appointmentFee: '12.00',
        status: 'Canceled',
        refundStatus: 'Refunded',
        detailsInfo: 'Appointment canceled by patient.',
        bankInfo: {
            bankName: 'BNP Paribas',
            accountName: 'Emily Watson',
            accountNumber: '1122334456',
        },
        doctorName: 'Dr. Kyle Reese',
        doctorSpecialist: 'Psychiatrist',
        doctorHospital: 'Bone & Joint Center',
    },
];

const AppointmentsPage = () => {
    const navigate = useNavigate();
    const [patients] = useState(dummyBooking);
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const filterOptions = [
        { value: 'All', label: 'All' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Canceled', label: 'Canceled' },
        { value: 'refundRequest', label: 'Refund Request' },
    ];

    const handleFilterChange = (value) => {
        setSelectedFilter(value);
        setCurrentPage(1);
    };

    // 🔹 FILTER LOGIC
    const filteredPatients =
        selectedFilter === 'All'
            ? patients
            : selectedFilter === 'refundRequest'
                ? patients.filter(
                    (patient) => patient.refundStatus === 'Pending'
                )
                : patients.filter(
                    (patient) => patient.status === selectedFilter
                );

    // 🔹 PAGINATION LOGIC
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient =
        indexOfLastPatient - patientsPerPage;
    const currentPatients = filteredPatients.slice(
        indexOfFirstPatient,
        indexOfLastPatient
    );

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

    const handleApprove = (patientId) => {
        toast.success("Request approved successfully!");
        // Implement your approval logic here
        console.log(`Approving patient with ID: ${patientId}`);
        // You might want to update the patient status in your state or make an API call
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Booking Request</h1>
                <div className='flex justify-between items-center mt-2'>
                    <CustomSelect
                        className='h-8'
                        options={filterOptions}
                        value={selectedFilter}
                        onChange={handleFilterChange}
                    />

                    <div className='flex gap-2'>
                        <Button className='text-lg! py-5! px-2! hover:text-[#006C93]! hover:border-[#006C93]!'
                            onClick={() => navigate("/fund-transfer")}
                        >
                            <PiArrowCircleUpRightBold size={22} className='text-[#006C93]' />Fund Transfer
                        </Button>
                        <Button className='text-lg! py-5! px-2! hover:text-[#006C93]! hover:border-[#006C93]!'
                            onClick={() => navigate("/fund-return")}
                        >
                            <PiArrowCircleUpRightBold size={22} className='text-red-600' />Fund Return
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-7 gap-6 text-gray-500 font-semibold px-8 mb-2">
                    <div>Patients</div>
                    <div className="text-center">Specialty</div>
                    <div className="text-center">Reason</div>
                    <div className="text-center">Fee</div>
                    <div>Status</div>
                    <div className="text-center">Booking Date</div>
                    <div className="text-center">Action</div>
                </div>

                {currentPatients.map((patient) => (
                    <CustomCard
                        key={patient.id}
                        className="grid grid-cols-7 items-center gap-6 py-4 px-8"
                    >
                        <div className="flex gap-3">
                            <img
                                src={patient.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <div className="font-medium">
                                    {patient.patientName}
                                </div>
                                <div className="text-sm">
                                    {patient.email}
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            {patient.visitSpecialties}
                        </div>
                        <div className="text-center">
                            {patient.visitReason}
                        </div>
                        <div className="text-center">
                            ${patient.appointmentFee}
                        </div>

                        <div
                            className={`text-sm px-1 w-20 text-center rounded-full border
                                ${patient.status === 'Completed' ? 'text-green-700 bg-green-100 border-green-300'
                                    : patient.status === 'Pending' ? 'text-yellow-700 bg-yellow-100 border-yellow-300'
                                        : patient.status === 'Canceled' ? 'text-red-700 bg-red-100 border-red-300'
                                            : 'text-gray-700 bg-gray-100 border-gray-300'
                                }`}
                        >
                            {patient.status}
                        </div>

                        <div className="text-center">
                            {patient.bookingDate}
                        </div>

                        <div className="flex gap-3 justify-center">
                            <FaEye
                                size={24}
                                title="Booking Details"
                                className="text-[#0087b8] cursor-pointer hover:text-[#006e96]"
                                onClick={() => showModal(patient)}
                            />
                            {patient.refundStatus === 'Pending' && (
                                <CustomPopconfirm
                                    title="Are you sure to Approve this request?"
                                    onConfirm={() => handleApprove(patient.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <FaRegCheckCircle
                                        size={22}
                                        className='text-green-500 cursor-pointer hover:text-green-600'
                                    />
                                </CustomPopconfirm>
                            )}
                        </div>
                    </CustomCard>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-6">
                <CustomPagination
                    showSizeChanger={false}
                    total={filteredPatients.length}
                    pageSize={patientsPerPage}
                    current={currentPage}
                    onChange={handlePageChange}
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

export default AppointmentsPage;
