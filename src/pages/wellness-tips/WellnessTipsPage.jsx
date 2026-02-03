import React, { useState } from 'react';
import CustomButton from '../../components/shared/Button';
import CustomCard from '../../components/common/CustomCard';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import CustomPagination from '../../components/shared/Pagination';
import toast from '../../utils/toast';
import { Button } from 'antd';
import { useGetWellnessQuery, useAddWellnessMutation, useUpdateWellnessMutation, useDeleteWellnessMutation } from '../../RTK/wellness/wellnessApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Loader from '../../components/shared/Loader';

const WellnessTipsPage = () => {
    const { data: wellnessTips, isLoading, isFetching } = useGetWellnessQuery();
    const [addWellness, { isLoading: isAdding }] = useAddWellnessMutation();
    const [updateWellness, { isLoading: isUpdating }] = useUpdateWellnessMutation();
    const [deleteWellness, { isLoading: isDeleting }] = useDeleteWellnessMutation();

    const [newTip, setNewTip] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tipsPerPage] = useState(5);
    const maxChars = 180;

    const [editingTipId, setEditingTipId] = useState(null);
    const [editingTipText, setEditingTipText] = useState('');

    const handlePost = async () => {
        if (newTip.trim() === '') return;
        try {
            await addWellness({ content: newTip, isActive: true }).unwrap();
            toast.success("Tip posted successfully!");
            setNewTip('');
        } catch (error) {
            toast.error(error?.data?.message || "Failed to post tip.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteWellness(id).unwrap();
            toast.success("Tip deleted successfully!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete tip.");
        }
    };

    const handleEdit = (tip) => {
        setEditingTipId(tip._id);
        setEditingTipText(tip.content);
    };

    const handleUpdate = async () => {
        if (editingTipText.trim() === '') return;
        try {
            await updateWellness({ id: editingTipId, data: { content: editingTipText } }).unwrap();
            toast.success("Tip updated successfully!");
            setEditingTipId(null);
            setEditingTipText('');
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update tip.");
        }
    };

    const handleToggleStatus = async (tip) => {
        try {
            await updateWellness({ id: tip._id, data: { isActive: !tip.isActive } }).unwrap();
            toast.success(`Tip ${tip.isActive ? 'hidden' : 'activated'} successfully!`);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleCancelEdit = () => {
        setEditingTipId(null);
        setEditingTipText('');
    };

    const tips = wellnessTips?.data || [];
    const indexOfLastTip = currentPage * tipsPerPage;
    const indexOfFirstTip = indexOfLastTip - tipsPerPage;
    const currentTips = tips.slice(indexOfFirstTip, indexOfLastTip);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Loader size="large" spinning={isLoading || isFetching || isAdding || isUpdating || isDeleting} tip="Loading...">
            <div>
                <h1 className="text-2xl font-bold mb-6">Daily Wellness Tips</h1>

                <CustomCard className="p-4 mb-6">
                    <textarea
                        value={newTip}
                        onChange={(e) => setNewTip(e.target.value)}
                        placeholder="Write here..."
                        maxLength={maxChars}
                        className="w-full h-32 p-2 border rounded-md border-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-[#008dc0]"
                    ></textarea>
                    <div className="flex justify-between mt-2">
                        <p className="text-xs text-gray-400">
                            Maximum {maxChars} Character
                        </p>
                        <CustomButton type="primary" className='text-xl! py-5! px-7!' onClick={handlePost} loading={isAdding} disabled={isAdding}>
                            {isAdding ? "Posting..." : "Post"}
                        </CustomButton>
                    </div>
                </CustomCard>

                <h2 className="text-xl font-bold mb-4">Previous Post</h2>

                <div className="space-y-4">
                    {currentTips.map(tip => (
                        <div key={tip._id}>
                            {editingTipId === tip._id ? (
                                <CustomCard className="p-4 mb-6">
                                    <textarea
                                        value={editingTipText}
                                        onChange={(e) => setEditingTipText(e.target.value)}
                                        placeholder="Write here..."
                                        maxLength={maxChars}
                                        className="w-full h-26 p-2 border rounded-md border-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-[#008dc0]"
                                    ></textarea>
                                    <div className="flex justify-between mt-2">
                                        <p className="text-xs text-gray-400">
                                            Maximum {maxChars} Character
                                        </p>
                                        <div className='flex items-center gap-4'>
                                            <Button danger onClick={handleCancelEdit}>
                                                Cancel
                                            </Button>
                                            <CustomButton type="primary" className='' onClick={handleUpdate} loading={isUpdating} disabled={isUpdating}>
                                                {isUpdating ? "Updating..." : "Update"}
                                            </CustomButton>
                                        </div>
                                    </div>
                                </CustomCard>
                            ) : (
                                <CustomCard className="p-4 flex justify-between items-center">
                                    <p className="text-gray-700 truncate max-w-[1000px]">{tip.content}</p>
                                    <div className="flex space-x-4 items-center">
                                        {tip.isActive ? (
                                            <CustomPopconfirm
                                                title="Are you sure to hide this tip?"
                                                onConfirm={() => handleToggleStatus(tip)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <FaEye
                                                    size={24}
                                                    className="text-[#0087b8] cursor-pointer"
                                                    title="Hide Tip"
                                                />
                                            </CustomPopconfirm>
                                        ) : (
                                            <CustomPopconfirm
                                                title="Are you sure to activate this tip?"
                                                onConfirm={() => handleToggleStatus(tip)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <FaEyeSlash
                                                    size={24}
                                                    className="text-gray-400 cursor-pointer"
                                                    title="Activate Tip"
                                                />
                                            </CustomPopconfirm>
                                        )}
                                        <CustomPopconfirm
                                            title="Are you sure to delete this tip?"
                                            onConfirm={() => handleDelete(tip._id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <CustomButton title="Delete Post" className='bg-red-500! text-white! hover:bg-red-600! border-none!'>
                                                Delete
                                            </CustomButton>
                                        </CustomPopconfirm>

                                        <CustomButton title="Edit Post" type="primary" onClick={() => handleEdit(tip)}>
                                            Edit
                                        </CustomButton>
                                    </div>
                                </CustomCard>
                            )}
                        </div>
                    ))}
                    {!isLoading && tips.length === 0 && (
                        <div className="text-center text-gray-500 py-10">No wellness tips found.</div>
                    )}
                    {tips.length > 0 && (
                        <CustomPagination
                            showSizeChanger={false}
                            total={tips.length}
                            pageSize={tipsPerPage}
                            onChange={handlePageChange}
                            current={currentPage}
                        />
                    )}
                </div>

            </div>
        </Loader>
    );
};

export default WellnessTipsPage;