import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import CustomSelect from '../../components/common/CustomSelect';
import { FaEye } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';


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
        doctorName: 'Dr. Elowyn Starcrest',
        specialist: 'Dentist',
        hospital: 'Central Dental Care',
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
        doctorName: 'Dr. Elowyn Starcrest',
        specialist: 'Dentist',
        hospital: 'Central Dental Care',
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
        doctorName: 'Dr. Elowyn Starcrest',
        specialist: 'Dentist',
        hospital: 'Central Dental Care',
        detailsInfo: 'Detail Info the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.',
        bankInfo: {
            bankName: 'HSBC',
            accountName: 'John Smith',
            accountNumber: '9876543210',
        },
    },
];

const DoctorAllAppointments = () => {
    const [patients, setPatients] = useState(dummyPatients);
    const [selectedPatient, setSelectedPatient] = useState(null);

   const {state} = useLocation;


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
                <h1 className="text-2xl font-bold mb-6">{state.name} Appointments</h1>
                <CustomSelect />
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Header */}
                <div className="grid grid-cols-7 gap-6 text-gray-500 font-semibold mb-2 px-8">
                    <div>Patient</div>
                    <div>Visit Specialties</div>
                    <div>Visit reason</div>
                    <div>Fee</div>
                    <div>status</div>
                    <div>Date</div>
                    <div className="text-center">Action</div>
                </div>

                {/* Rows */}
                {patients.map((patient) => (
                    <CustomCard
                        key={patient.id}
                        className="grid grid-cols-7 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={patient.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="font-medium">{patient.name}</div>
                        </div>

                        <div className="text-gray-600">{patient.visitSpecialties}</div>
                        <div className="text-gray-600">{patient.visitReason}</div>
                        <div className="text-gray-600">{patient.appointmentFee}</div>
                        <div className="text-gray-600">{patient.status}</div>
                        <div className="text-gray-600">{patient.bookingDate}</div>

                        <div
                            className="flex justify-center items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaEye title='View Details'
                                size={22}
                                className="text-[#0087b8] cursor-pointer hover:text-[#006e96]"
                                onClick={() => showModal(patient)}
                            />
                        </div>

                    </CustomCard>
                ))}
            </div>
            <BookingDetailsModal
                open={isModalVisible}
                onClose={handleClose}
                doctor={selectedDoctor}
            />
        </div>
    );
};

export default DoctorAllAppointments;
