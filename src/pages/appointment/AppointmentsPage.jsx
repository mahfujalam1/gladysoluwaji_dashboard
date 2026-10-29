import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import CustomPagination from '../../components/shared/Pagination';
import { FaEye, FaRegCheckCircle } from 'react-icons/fa';
import CustomSelect from '../../components/common/CustomSelect';
import BookingDetails from './modal/BookingDetails';
// import { PiArrowCircleUpRightBold } from 'react-icons/pi';
// import { Button } from 'antd';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import toast from '../../utils/toast';
import { useGetAppointmentsQuery } from '../../RTK/appointment/appointmentsApi';
import Loader from '../../components/shared/Loader';
import { getImageUrl, defaultAvatar } from '../../utils/imageUrl';

const AppointmentsPage = () => {
    const [patients, setPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { data: appointmentsData, isLoading, error } = useGetAppointmentsQuery({
        page: currentPage,
        limit: patientsPerPage
    });

    React.useEffect(() => {
        if (appointmentsData?.data) {
            const mappedPatients = appointmentsData.data.map(appointment => ({
                id: appointment._id,
                patientName: appointment.patientName,
                avatar: getImageUrl(appointment.patientProfileImage),
                email: appointment.patientEmail,
                visitingTime: appointment.appointmentTime,
                visitSpecialties: appointment.specialtyName,
                visitReason: appointment.reasonTitle,
                appointmentFee: appointment.consultationFee || '0.00',
                status: appointment.status === 'CANCELLED' ? 'Canceled' :
                    appointment.status === 'COMPLETED' ? 'Completed' :
                        appointment.status,
                bookingDate: appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A',
                refundStatus: 'N/A',
                ...appointment
            }));
            setPatients(mappedPatients);
        }
    }, [appointmentsData]);

    const filterOptions = [
        { value: 'All', label: 'All' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'CANCELLED', label: 'Canceled' },
        // { value: 'refundRequest', label: 'Refund Request' },
    ];

    const handleFilterChange = (value) => {
        setSelectedFilter(value);
        setCurrentPage(1);
    };

    // 🔹 FILTER LOGIC (Client-side for now, as API might not support filter params yet)
    const filteredPatients =
        selectedFilter === 'All'
            ? patients
            : patients.filter(
                (patient) => patient.status === selectedFilter
            );

    // For now, let's assume `filteredPatients` is what we show.
    const currentPatients = filteredPatients;

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
        // TODO: wire up actual approval API mutation here
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Booking Request</h1>
                <div className='flex justify-end items-center mt-2'>
                    <CustomSelect
                        className='h-8'
                        options={filterOptions}
                        value={selectedFilter}
                        onChange={handleFilterChange}
                    />

                    {/* <div className='flex gap-2'>
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
                    </div> */}
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

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader spinning={isLoading} />
                    </div>
                ) : (
                    currentPatients.length > 0 ? (
                        currentPatients.map((patient) => (
                            <CustomCard
                                key={patient.id}
                                className="grid grid-cols-7 items-center gap-6 py-4 px-8"
                            >
                                <div className="flex gap-3">
                                    <img
                                        src={patient.avatar}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = defaultAvatar;
                                        }}
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
                                    className={`text-sm px-1 w-22 text-center rounded-full border
                                        ${patient.status === 'COMPLETED' ? 'text-green-700 bg-green-100 border-green-300'
                                            : patient.status === 'PENDING' ? 'text-yellow-700 bg-yellow-100 border-yellow-300'
                                                : patient.status === 'CANCELLED' ? 'text-red-700 bg-red-100 border-red-300'
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
                                    {patient.refundStatus === 'PENDING' && (
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
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">No appointments found.</div>
                    )
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-6">
                <CustomPagination
                    showSizeChanger={false}
                    total={appointmentsData?.meta?.total || 0}
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
