import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import image1 from '../../assets/_n.jpg'
import image2 from '../../assets/n.jpg'
import { useNavigate } from 'react-router-dom';
import CustomPagination from '../../components/shared/Pagination';

const dummyDoctors = [
    {
        id: '1',
        name: 'Taigo Felipe',
        Specialties: 'Dentist',
        avatar: 'https://placehold.net/avatar.svg?text=TF&bg=212121',
        doctorContact: '+234 54564 5565',
        email: 'tiagofelipe@email.com',
        requestDate: '2 Nov 2025',
        doctorId: '6415966589',
        hospital: 'Central Dental Care',
        documents: [{ ImageUrl: image1 }, { ImageUrl: image2, }, { ImageUrl: image2, }, { ImageUrl: image2, }, { ImageUrl: image2, }, { ImageUrl: image2, }],
    },
    {
        id: '2',
        name: 'Jane Doe',
        Specialties: 'Dentist',
        avatar: 'https://placehold.net/avatar.svg?text=JD&bg=212121',
        doctorContact: '+1 555 123 4567',
        email: 'janedoe@email.com',
        requestDate: '2 Nov 2025',
        doctorId: '6565841589',
        hospital: 'Central Dental Care',
        documents: [{ ImageUrl: image2 }, { ImageUrl: image2, }, { ImageUrl: image2, }],
    },
    {
        id: '3',
        name: 'John Smith',
        Specialties: 'Dentist',
        avatar: 'https://placehold.net/avatar.svg?text=JS&bg=212121',
        doctorContact: '+44 20 7946 0958',
        email: 'johnsmith@email.com',
        requestDate: '1 Nov 2025',
        doctorId: '6565966589',
        hospital: 'Central Dental Care',
        documents: [{ ImageUrl: image1 }, { ImageUrl: image2 }, { ImageUrl: image2, }, { ImageUrl: image2, }, { ImageUrl: image2, }],
    },
    {
        id: '4',
        name: 'Emily Jones',
        Specialties: 'Dentist',
        avatar: 'https://placehold.net/avatar.svg?text=EJ&bg=212121',
        doctorContact: '+61 2 9876 5432',
        email: 'emilyjones@email.com',
        requestDate: '31 Oct 2025',
        doctorId: '6565964589',
        hospital: 'Central Dental Care',
        documents: [{ ImageUrl: image2 }, { ImageUrl: image2, }],
    },
    {
        id: '5',
        name: 'Michael Brown',
        Specialties: 'Cardiologist',
        avatar: 'https://placehold.net/avatar.svg?text=MB&bg=212121',
        doctorContact: '+1 555 987 6543',
        email: 'michael.brown@email.com',
        requestDate: '30 Oct 2025',
        doctorId: '9876543210',
        hospital: 'City Heart Clinic',
        documents: [{ ImageUrl: image1 }],
    },
    {
        id: '6',
        name: 'Sarah Wilson',
        Specialties: 'Neurologist',
        avatar: 'https://placehold.net/avatar.svg?text=SW&bg=212121',
        doctorContact: '+44 20 1234 5678',
        email: 'sarah.wilson@email.com',
        requestDate: '29 Oct 2025',
        doctorId: '0123456789',
        hospital: 'General Hospital',
        documents: [{ ImageUrl: image2 }],
    },

];

const DoctorRequestsPage = () => {
    const [doctors, setDoctors] = useState(dummyDoctors);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);

    // Get current doctors
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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
                {currentDoctors.map((doctor) => (
                    <CustomCard
                        key={doctor.id}
                        onClick={() => navigate("/doctor-requests-details", { state: { doctor } })}
                        className="grid grid-cols-5 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={doctor.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="font-medium">{doctor.name}</div>
                        </div>

                        <div className="text-gray-600">{doctor.Specialties}</div>
                        <div className="text-gray-600">{doctor.doctorContact}</div>
                        <div className="text-gray-600">{doctor.email}</div>
                        <div className="text-gray-600">{doctor.requestDate}</div>
                    </CustomCard>
                ))}
            </div>
            <div className='flex justify-end mt-6'>
                <CustomPagination
                    showSizeChanger={false}
                    total={doctors.length}
                    pageSize={doctorsPerPage}
                    onChange={handlePageChange}
                    current={currentPage}
                />
            </div>
        </div>
    );
};

export default DoctorRequestsPage;