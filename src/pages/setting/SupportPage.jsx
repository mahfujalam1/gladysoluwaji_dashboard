import React, { useEffect, useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { LuTrash2 } from 'react-icons/lu';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import { Modal } from 'antd';
import CustomButton from '../../components/shared/Button';
import { FaEye } from 'react-icons/fa';
import toast from '../../utils/toast';
import Loader from '../../components/shared/Loader';
import { useGetContactSupportQuery, useDeleteContactSupportMutation } from '../../RTK/contact/contactSupport';
import CustomPagination from '../../components/shared/Pagination';

const SupportPage = () => {
    const { data, isLoading, isFetching } = useGetContactSupportQuery();
    const [deleteContactSupport, { isLoading: isDeleting }] = useDeleteContactSupportMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const openModal = (request) => {
        setSelectedData(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedData(null);
    };

    const handleDelete = async (id) => {
        try {
            await deleteContactSupport(id).unwrap();
            toast.success("Support request deleted successfully!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete request.");
        }
    };

    return (
        <Loader size="large" spinning={isLoading || isFetching || isDeleting} tip="Loading...">
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

                    {data?.data?.map((request) => (
                        <CustomCard
                            key={request._id}
                            className="grid grid-cols-5 items-center gap-8 py-6 px-8 hover:shadow-md transition-all duration-300"
                        >
                            <div className="font-medium">{request?.name}</div>
                            <div className="text-gray-600">{request.email}</div>

                            <div className="text-gray-600 truncate max-w-[250px]">
                                {request.message}
                            </div>

                            <div className="text-gray-600">{new Date(request.createdAt).toLocaleDateString()}</div>

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
                                    onConfirm={() => handleDelete(request._id)}
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
                    <CustomPagination
                        current={data?.page}
                        total={data?.total}
                        pageSize={data?.limit}
                        onChange={(page) => {
                            navigate(`/support?page=${page}`);
                        }}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    />
                    {!isLoading && (!data?.data || data?.data?.length === 0) && (
                        <div className="text-center text-gray-500 py-10">No support requests found.</div>
                    )}
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
                                {selectedData.message}
                            </p>
                        </div>
                    )}
                </Modal>
            </div>
        </Loader>
    );
};

export default SupportPage;
