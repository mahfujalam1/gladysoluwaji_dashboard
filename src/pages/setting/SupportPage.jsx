import React, { useEffect, useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { LuTrash2 } from 'react-icons/lu';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import { Modal } from 'antd';
import CustomButton from '../../components/shared/Button';
import { FaEye } from 'react-icons/fa';
import toast from '../../utils/toast';
import Loader from '../../components/shared/Loader';

const SupportPage = () => {
    const [supportRequests, setSupportRequests] = useState([
        {
            id: 1,
            name: 'Tiago Felipe',
            email: 'tiagofelipe@mail.com',
            reportContent:
                'Full report content for Tiago Felipe - Request 1. This could be a much longer text detailing the support request issue and resolution.',
            date: '21 Nov 2025',
        },
        {
            id: 2,
            name: 'Tiago Felipe',
            email: 'tiagofelipe@mail.com',
            reportContent:
                'Full report content for Tiago Felipe - Request 2. Another detailed support request.',
            date: '21 Nov 2025',
        },
        {
            id: 3,
            name: 'Tiago Felipe',
            email: 'tiagofelipe@mail.com',
            reportContent:
                'Full report content for Tiago Felipe - Request 3. Yet another support request.',
            date: '21 Nov 2025',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const openModal = (request) => {
        setSelectedData(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedData(null);
    };

    const handleDelete = (id) => {
        toast.success("Support request deleted successfully!");
        setSupportRequests(prev => prev.filter(request => request.id !== id));
    };

    return (
        <Loader size="large" spinning={isLoading} tip="Loading...">
            <div>
                <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

                <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-5 gap-8 text-gray-500 font-semibold mb-2 px-8">
                        <div>Name</div>
                        <div>Email</div>
                        <div>Report</div>
                        <div>Date</div>
                        <div className="text-center">Action</div>
                    </div>

                    {supportRequests.map((request) => (
                        <CustomCard
                            key={request.id}
                            className="grid grid-cols-5 items-center gap-8 py-6 px-8 hover:shadow-md transition-all duration-300"

                        >
                            <div className="font-medium">{request.name}</div>
                            <div className="text-gray-600">{request.email}</div>

                            <div className="text-gray-600 truncate max-w-[250px]">
                                {request.reportContent}
                            </div>

                            <div className="text-gray-600">{request.date}</div>

                            <div className="flex justify-center items-center space-x-4">

                                {/* VIEW BUTTON */}
                                <FaEye
                                    size={24}
                                    className="text-[#0087b8] cursor-pointer"
                                    onClick={() => {
                                        openModal(request);
                                    }}
                                />

                                {/* DELETE BUTTON */}
                                <CustomPopconfirm
                                    title="Are you sure to delete this request?"
                                    onConfirm={() => handleDelete(request.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <button
                                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                    >
                                        <LuTrash2 size={24} />
                                    </button>
                                </CustomPopconfirm>
                            </div>
                        </CustomCard>
                    ))}
                </div>

                {/* MODAL */}
                <Modal
                    open={isModalOpen}
                    onCancel={closeModal}
                    footer={[
                        <CustomButton
                            key="close"
                            type="primary"
                            onClick={closeModal}
                            className="bg-red-500! text-white! hover:bg-red-600!"
                        >
                            Close
                        </CustomButton>
                    ]}
                >
                    {selectedData && (
                        <div className="p-2 min-h-40 overflow-y-auto">
                            <h1 className="text-xl font-semibold mb-1">{selectedData.name}</h1>
                            <h2 className="text-gray-600 mb-3">{selectedData.email}</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {selectedData.reportContent}
                            </p>
                        </div>
                    )}
                </Modal>
            </div>
        </Loader>
    );
};

export default SupportPage;
