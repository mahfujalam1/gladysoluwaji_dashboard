import React, { useState } from 'react';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa';
import CustomCard from '../../components/common/CustomCard';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import toast from '../../utils/toast';
import PatientDetails from './modal/PatientDetailsModal';
import { LuTrash2 } from 'react-icons/lu';
import CustomPagination from '../../components/shared/Pagination';

const dummyPatients = [
    {
        id: '20215156465',
        name: 'Taigo Felipe',
        avatar: 'https://placehold.net/avatar.svg?text=TF&bg=212121',
        emergencyContact: '+234 54564 5565',
        email: 'tiagofelipe@email.com',
        addedDate: '2 Nov 2025',
        isBlock: false,
        dob: '10-11-1989',
        bloodGroup: 'AB+',
        allergies: ['Food Allergies', 'Seasonal Allergy', 'Food Allergy'],
        bankInfo: {
            bankName: 'First Bank Of Nigeria',
            accountName: 'Taigo Felipe',
            accountNumber: '2345678901',
        },
    },
    {
        id: '20215156466',
        name: 'Jane Doe',
        avatar: 'https://placehold.net/avatar.svg?text=JD&bg=212121',
        emergencyContact: '+1 555 123 4567',
        email: 'janedoe@email.com',
        addedDate: '2 Nov 2025',
        isBlock: true,
        dob: '05-20-1992',
        bloodGroup: 'O-',
        allergies: ['Pollen'],
        bankInfo: {
            bankName: 'Bank of America',
            accountName: 'Jane Doe',
            accountNumber: '1234567890',
        },
    },
    {
        id: '20215156467',
        name: 'John Smith',
        avatar: 'https://placehold.net/avatar.svg?text=JS&bg=212121',
        emergencyContact: '+44 20 7946 0958',
        email: 'johnsmith@email.com',
        addedDate: '1 Nov 2025',
        isBlock: false,
        dob: '01-15-1985',
        bloodGroup: 'A+',
        allergies: ['Peanuts'],
        bankInfo: {
            bankName: 'HSBC',
            accountName: 'John Smith',
            accountNumber: '9876543210',
        },
    },
    {
        id: '20215156468',
        name: 'Emily Jones',
        avatar: 'https://placehold.net/avatar.svg?text=EJ&bg=212121',
        emergencyContact: '+61 2 9876 5432',
        email: 'emilyjones@email.com',
        addedDate: '31 Oct 2025',
        isBlock: false,
        dob: '03-12-1995',
        bloodGroup: 'B+',
        allergies: ['Dust Mites'],
        bankInfo: {
            bankName: 'Commonwealth Bank',
            accountName: 'Emily Jones',
            accountNumber: '1122334455',
        },
    },
    {
        id: '20215156469',
        name: 'Michael Brown',
        avatar: 'https://placehold.net/avatar.svg?text=MB&bg=212121',
        emergencyContact: '+81 3 1234 5678',
        email: 'michaelbrown@email.com',
        addedDate: '30 Oct 2025',
        isBlock: false,
        dob: '07-25-1988',
        bloodGroup: 'AB-',
        allergies: ['Latex'],
        bankInfo: {
            bankName: 'MUFG Bank',
            accountName: 'Michael Brown',
            accountNumber: '8877665544',
        },
    },
    {
        id: '20215156470',
        name: 'Jessica Williams',
        avatar: 'https://placehold.net/avatar.svg?text=JW&bg=212121',
        emergencyContact: '+49 30 1234567',
        email: 'jessicawilliams@email.com',
        addedDate: '29 Oct 2025',
        isBlock: false,
        dob: '11-02-1991',
        bloodGroup: 'O+',
        allergies: ['Cats', 'Dust', 'Dogs', 'Pollen'],
        bankInfo: {
            bankName: 'Deutsche Bank',
            accountName: 'Jessica Williams',
            accountNumber: '6655443322',
        },
    },
];

const PatientsPage = () => {
    const [patients, setPatients] = useState(dummyPatients);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);

    const handleDelete = (id) => {
        toast.success("Patient deleted successfully!");
        setPatients(prev => prev.filter(patient => patient.id !== id));
    };

    const toggleBlock = (id) => {
        setPatients((prev) =>
            prev.map((patient) =>
                patient.id === id
                    ? { ...patient, isBlock: !patient.isBlock }
                    : patient
            )
        );
        toast.success('Patient status updated!');
    };

    const showModal = (patient) => {
        setSelectedPatient(patient);
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedPatient(null);
    };

    // Pagination logic
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Header */}
                <div className="grid grid-cols-6 gap-6 text-gray-500 font-semibold mb-2 px-8">
                    <div>Patients</div>
                    <div>ID</div>
                    <div>Contact number</div>
                    <div>Email address</div>
                    <div>Added date</div>
                    <div className="text-center">Action</div>
                </div>

                {/* Rows */}
                {currentPatients.map((patient) => (
                    <CustomCard
                        key={patient.id}
                        onClick={() => showModal(patient)}
                        className="grid grid-cols-6 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={patient.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="font-medium">{patient.name}</div>
                        </div>

                        <div className="text-gray-600">{patient.id}</div>
                        <div className="text-gray-600">{patient.emergencyContact}</div>
                        <div className="text-gray-600">{patient.email}</div>
                        <div className="text-gray-600">{patient.addedDate}</div>

                        <div
                            className="flex justify-center items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CustomPopconfirm
                                title={`Are you sure to ${patient.isBlock ? 'unblock' : 'block'
                                    } this patient?`}
                                onConfirm={() => toggleBlock(patient.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <button title="Block / Unblock">
                                    {patient.isBlock ? (

                                        <FaUserSlash
                                            size={24}
                                            className="text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                                        />
                                    ) : (
                                        <FaUserCheck
                                            size={24}
                                            className="text-green-400 hover:text-green-500 transition-colors cursor-pointer"
                                        />
                                    )}
                                </button>
                            </CustomPopconfirm>

                            {/* DELETE */}
                            <CustomPopconfirm
                                title="Are you sure to delete this patient?"
                                onConfirm={() => handleDelete(patient.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <button title='Delete Admin' className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                                    <LuTrash2 size={24} />
                                </button>
                            </CustomPopconfirm>
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

            <PatientDetails
                open={isModalVisible}
                onClose={handleClose}
                patient={selectedPatient}
            />
        </div>
    );
};

export default PatientsPage;