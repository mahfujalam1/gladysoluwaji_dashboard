import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { useNavigate } from 'react-router-dom';
import CustomPagination from '../../components/shared/Pagination';
import { IoIosArrowBack } from 'react-icons/io';
import { Button } from 'antd';
import { GrDocumentDownload } from 'react-icons/gr';

const dummyDoctors = [
    {
        id: '1',
        name: 'Taigo Felipe',
        avatar: 'https://placehold.net/avatar.svg?text=TF&bg=212121',
        email: 'tiagofelipe@email.com',
        transferAmount: '120.00',
        date: '2025-12-25',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Taigo Felipe',
            accountNumber: '5544332211',
        },
    },
    {
        id: '2',
        name: 'Jane Doe',
        avatar: 'https://placehold.net/avatar.svg?text=JD&bg=212121',
        email: 'janedoe@email.com',
        transferAmount: '142.00',
        date: '2025-12-31',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Jane Doe',
            accountNumber: '5544332211',
        },
    },
    {
        id: '3',
        name: 'John Smith',
        avatar: 'https://placehold.net/avatar.svg?text=JS&bg=212121',
        email: 'johnsmith@email.com',
        transferAmount: '1542.00',
        date: '2025-12-01',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'John Smith',
            accountNumber: '5544332211',
        },
    },
    {
        id: '4',
        name: 'Emily Jones',
        avatar: 'https://placehold.net/avatar.svg?text=EJ&bg=212121',
        email: 'emilyjones@email.com',
        transferAmount: '212.00',
        date: '2025-12-20',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Emily Jones',
            accountNumber: '5544332211',
        },
    },
    {
        id: '5',
        name: 'Michael Brown',
        avatar: 'https://placehold.net/avatar.svg?text=MB&bg=212121',
        email: 'michael.brown@email.com',
        transferAmount: '1112.00',
        date: '2025-12-08',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Michael Brown',
            accountNumber: '5544332211',
        },
    },
    {
        id: '6',
        name: 'Sarah Wilson',
        avatar: 'https://placehold.net/avatar.svg?text=SW&bg=212121',
        email: 'sarah.wilson@email.com',
        transferAmount: '4812.00',
        date: '2025-12-05',
        bankInfo: {
            bankName: 'Citi Bank',
            accountName: 'Sarah Wilson',
            accountNumber: '5544332211',
        },
    },

];

const FundTransfer = () => {
    const [doctors] = useState(dummyDoctors);
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
                <h1 className="flex items-center text-2xl font-bold mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-3 flex items-center justify-center h-10 w-10 rounded-full bg-white cursor-pointer"
                        aria-label="Go back"
                    >
                        <IoIosArrowBack size={28} />
                    </button>
                    <span>Fund Transfer to Doctor</span>
                </h1>
                <Button className='py-4! px-2! text-lg! hover:border-[#006C93]! hover:text-[#006C93]!'>
                    <GrDocumentDownload />Download
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Header */}
                <div className="grid grid-cols-6 gap-6 text-gray-500 font-semibold mb-2 px-8">
                    <div>Doctors</div>
                    <div>Bank Name</div>
                    <div>Account Name</div>
                    <div>Account Number</div>
                    <div>Email Address</div>
                    <div className='text-center'>Transfer Amount</div>
                </div>

                {/* Rows */}
                {currentDoctors.map((doctor) => (
                    <CustomCard
                        key={doctor.id}
                        className="grid grid-cols-6 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={doctor.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="font-medium">{doctor.name}</div>
                        </div>

                        <div className="text-gray-600">{doctor.bankInfo.bankName}</div>
                        <div className="text-gray-600">{doctor.bankInfo.accountName}</div>
                        <div className="text-gray-600">{doctor.bankInfo.accountNumber}</div>
                        <div className="text-gray-600">{doctor.email}</div>
                        <div className="text-gray-600 text-center">${doctor.transferAmount}</div>
                    </CustomCard>
                ))}
            </div>
            <div className='flex justify-end mt-6'>
                <CustomPagination
                    total={doctors.length}
                    pageSize={doctorsPerPage}
                    onChange={handlePageChange}
                    current={currentPage}
                />
            </div>
        </div>
    );
};

export default FundTransfer;