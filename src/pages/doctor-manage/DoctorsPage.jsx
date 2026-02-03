import React, { useState } from 'react';
import { FaEye, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import CustomCard from '../../components/common/CustomCard';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import toast from '../../utils/toast';
import { LuTrash2 } from 'react-icons/lu';
import DoctorDetailsModal from './modal/DoctorDetailsModal';
import image1 from '../../assets/_n.jpg'
import image2 from '../../assets/n.jpg'
import { useNavigate } from 'react-router-dom';
import CustomPagination from '../../components/shared/Pagination';

const dummyDoctors = [
    {
        id: '20215156471',
        name: 'Dr. Elowyn Starcrest',
        specialist: 'Dermatologist',
        hospital: 'Central Dental Care',
        avatar: 'https://placehold.net/avatar.svg?text=ES&bg=212121',
        phone: '+234 54564 5565',
        email: 'elowynstarcrest@gmail.com',
        nationalId: '1012635654112',
        requestedDate: '8 Nov 2025',
        approvalDate: '8 Nov 2025',
        isBlock: false,
        about: 'Dr. Elowyn Starcrest is a compassionate and highly skilled physician known for her patient-centered approach and dedication to delivering exceptional care.',
        services: ['Bridge', 'Dental Cleaning', 'Pediatric Dentist Consultation', 'Dental Consultation', 'Root Canal'],
        bankInfo: {
            bankName: 'First Bank Of Nigeria',
            accountName: 'Elect Energy Nigeria Limited',
            accountNumber: '234 54564 5565',
        },
        experience: [
            {
                hospital: 'Central Dental care',
                role: 'Senior Internal Medicine Consultant',
                period: '22 Jan 2025 - Present',
                duration: '4 years'
            },
            {
                hospital: 'Aurora Valley Medical Center',
                role: 'Senior Internal Medicine Consultant',
                period: '22 Jan 2021 - 31 Aug 2025',
                duration: '4 years'
            }
        ],
        documents: [{ ImageUrl: image1 }, { ImageUrl: image2 }],

    },
    {
        id: '20215156465',
        name: 'Taigo Felipe',
        specialist: 'Dermatologist',
        hospital: 'General Hospital',
        avatar: 'https://placehold.net/avatar.svg?text=TF&bg=212121',
        phone: '+234 54564 5565',
        email: 'tiagofelipe@email.com',
        nationalId: '1234567890',
        requestedDate: '2 Nov 2025',
        approvalDate: '3 Nov 2025',
        isBlock: false,
        bankInfo: {
            bankName: 'First Bank Of Nigeria',
            accountName: 'Taigo Felipe',
            accountNumber: '2345678901',
        },
        documents: [{ ImageUrl: image1 }, { ImageUrl: image2 }],
        about: 'A dedicated oncologist with over 10 years of experience in treating cancer patients.',
        services: ['Chemotherapy', 'Radiation Therapy'],
        experience: [
            {
                hospital: 'Central Dental care',
                role: 'Senior Internal Medicine Consultant',
                period: '22 Jan 2025 - Present',
                duration: '4 years'
            },
            {
                hospital: 'Aurora Valley Medical Center',
                role: 'Senior Internal Medicine Consultant',
                period: '22 Jan 2021 - 31 Aug 2025',
                duration: '4 years'
            }
        ],

    },
    {
        id: '20215156466',
        name: 'Jane Doe',
        specialist: 'Dermatologist',
        hospital: 'City Clinic',
        avatar: 'https://placehold.net/avatar.svg?text=JD&bg=212121',
        phone: '+1 555 123 4567',
        email: 'janedoe@email.com',
        nationalId: '0987654321',
        requestedDate: '2 Nov 2025',
        approvalDate: '3 Nov 2025',
        isBlock: true,
        bankInfo: {
            bankName: 'Bank of America',
            accountName: 'Jane Doe',
            accountNumber: '1234567890',
        },
        documents: [{ ImageUrl: image2 }],
        about: 'A pulmonologist focusing on respiratory diseases.',
        services: ['Asthma Care', 'COPD Management'],
        experience: [
            {
                hospital: 'Central Dental care',
                role: 'Senior Internal Medicine Consultant',
                period: '22 Jan 2025 - Present',
                duration: '4 years'
            },
            {
                hospital: 'Aurora Valley Medical Center',
                role: 'Senior Internal Medicine Consultant',
                period: '22 Jan 2021 - 31 Aug 2025',
                duration: '4 years'
            }
        ],
    },
    {
        id: '20215156472',
        name: 'Dr. John Appleseed',
        specialist: 'Cardiologist',
        hospital: 'Heartbeat Hospital',
        avatar: 'https://placehold.net/avatar.svg?text=JA&bg=212121',
        phone: '+1 123 456 7890',
        email: 'john.appleseed@email.com',
        nationalId: '9876543210',
        requestedDate: '10 Nov 2025',
        approvalDate: '11 Nov 2025',
        isBlock: false,
        about: 'Expert in cardiovascular diseases.',
        services: ['ECG', 'Echocardiogram'],
        bankInfo: {
            bankName: 'Chase Bank',
            accountName: 'John Appleseed',
            accountNumber: '1122334455',
        },
        experience: [],
        documents: [{ ImageUrl: image1 }],
    },
    {
        id: '20215156473',
        name: 'Dr. Sarah Connor',
        specialist: 'Neurologist',
        hospital: 'Mind Matters Clinic',
        avatar: 'https://placehold.net/avatar.svg?text=SC&bg=212121',
        phone: '+44 77 1234 5678',
        email: 'sarah.connor@email.com',
        nationalId: '5432109876',
        requestedDate: '12 Nov 2025',
        approvalDate: '13 Nov 2025',
        isBlock: false,
        about: 'Specializes in brain and nervous system disorders.',
        services: ['EEG', 'MRI Scan'],
        bankInfo: {
            bankName: 'Barclays',
            accountName: 'Sarah Connor',
            accountNumber: '6677889900',
        },
        experience: [],
        documents: [],
    },
    {
        id: '20215156474',
        name: 'Dr. Kyle Reese',
        specialist: 'Orthopedist',
        hospital: 'Bone & Joint Center',
        avatar: 'https://placehold.net/avatar.svg?text=KR&bg=212121',
        phone: '+1 987 654 3210',
        email: 'kyle.reese@email.com',
        nationalId: '6789012345',
        requestedDate: '14 Nov 2025',
        approvalDate: '15 Nov 2025',
        isBlock: true,
        about: 'Focused on musculoskeletal system.',
        services: ['X-Ray', 'Fracture Care'],
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Kyle Reese',
            accountNumber: '5544332211',
        },
        experience: [],
        documents: [{ ImageUrl: image2 }],
    },
];

const DoctorsPage = () => {
    const [Doctors, setDoctors] = useState(dummyDoctors);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);

    const handleDelete = (id) => {
        toast.success("Doctor deleted successfully!");
        setDoctors(prev => prev.filter(doctor => doctor.id !== id));
    };

    const toggleBlock = (id) => {
        setDoctors((prev) =>
            prev.map((doctor) =>
                doctor.id === id
                    ? { ...doctor, isBlock: !doctor.isBlock }
                    : doctor
            )
        );
        toast.success('Doctor status updated!');
    };

    const showModal = (doctor) => {
        setSelectedDoctor(doctor);
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedDoctor(null);
    };

    // Pagination logic
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = Doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-6">Doctor Management</h1>
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
                {currentDoctors.map((doctor) => (
                    <CustomCard
                        key={doctor.id}
                        className="grid grid-cols-6 items-center gap-10 py-4 px-8 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => navigate("/doctor-appointment-list", { state: { name: doctor.name, hospital: doctor.hospital, specialist: doctor.specialist } })}
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={doctor.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className=''>
                                <div className="font-medium">{doctor.name}</div>
                                <div className="text-xs">ID: {doctor.id}</div>
                            </div>
                        </div>

                        <div className="text-gray-600">{doctor.specialist}</div>
                        <div className="text-gray-600">{doctor.phone}</div>
                        <div className="text-gray-600">{doctor.email}</div>
                        <div className="text-gray-600">{doctor.requestedDate}</div>

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
                            <CustomPopconfirm
                                title={`Are you sure to ${doctor.isBlock ? 'unblock' : 'block'
                                    } this doctor?`}
                                onConfirm={() => toggleBlock(doctor.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <button title="Block / Unblock">
                                    {doctor.isBlock ? (

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
                                title="Are you sure to delete this doctor?"
                                onConfirm={() => handleDelete(doctor.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <button title='Delete Doctor' className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                                    <LuTrash2 size={24} />
                                </button>
                            </CustomPopconfirm>
                        </div>

                    </CustomCard>
                ))}
            </div>

            <div className='flex justify-end mt-6'>
                <CustomPagination
                    showSizeChanger={false}
                    total={Doctors.length}
                    pageSize={doctorsPerPage}
                    onChange={handlePageChange}
                    current={currentPage}
                />
            </div>

            <DoctorDetailsModal
                open={isModalVisible}
                onClose={handleClose}
                doctor={selectedDoctor}
            />
        </div>
    );
};

export default DoctorsPage;
