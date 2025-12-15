import React, { useState } from 'react';
import CustomButton from '../../components/shared/Button';
import CustomCard from '../../components/common/CustomCard';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import CustomPagination from '../../components/shared/Pagination';
import toast from '../../utils/toast';
import { Button } from 'antd';

const WellnessTipsPage = () => {
    const [tips, setTips] = useState([
        { id: 1, text: 'Stay hydrated by drinking at least 8 glasses of water daily to maintain energy levels.' },
        { id: 2, text: 'Incorporate at least 30 minutes of moderate exercise into your daily routine.' },
        { id: 3, text: 'Aim for 7-9 hours of quality sleep per night to support mental and physical health.' },
        { id: 4, text: 'Practice mindfulness or meditation for a few minutes each day to reduce stress.' },
        { id: 5, text: 'Eat a balanced diet rich in fruits, vegetables, lean proteins, and whole grains.' },
        { id: 6, text: 'Take short breaks from sitting every hour to stretch and move around.' },

    ]);
    const [newTip, setNewTip] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tipsPerPage] = useState(5);
    const maxChars = 180;

    const [editingTipId, setEditingTipId] = useState(null);
    const [editingTipText, setEditingTipText] = useState('');

    const handlePost = () => {
        if (newTip.trim() === '') return;
        toast.success("Tip posted successfully!");
        const newId = tips.length > 0 ? Math.max(...tips.map(tip => tip.id)) + 1 : 1;
        setTips([{ id: newId, text: newTip }, ...tips]);
        setNewTip('');
    };

    const handleDelete = (id) => {
        toast.success("Tip deleted successfully!");
        setTips(tips.filter(tip => tip.id !== id));
    };

    const handleEdit = (tip) => {
        setEditingTipId(tip.id);
        setEditingTipText(tip.text);
    };

    const handleUpdate = () => {
        if (editingTipText.trim() === '') return;
        toast.success("Tip updated successfully!");
        setTips(tips.map(tip => (tip.id === editingTipId ? { ...tip, text: editingTipText } : tip)));
        setEditingTipId(null);
        setEditingTipText('');
    };

    const handleCancelEdit = () => {
        setEditingTipId(null);
        setEditingTipText('');
    };

    const indexOfLastTip = currentPage * tipsPerPage;
    const indexOfFirstTip = indexOfLastTip - tipsPerPage;
    const currentTips = tips.slice(indexOfFirstTip, indexOfLastTip);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
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
                    <CustomButton type="primary" className='text-xl! py-5! px-7!' onClick={handlePost}>
                        Post
                    </CustomButton>
                </div>
            </CustomCard>

            <h2 className="text-xl font-bold mb-4">Previous Post</h2>

            <div className="space-y-4">
                {currentTips.map(tip => (
                    <div key={tip.id}>
                        {editingTipId === tip.id ? (
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
                                        <CustomButton type="primary" className='' onClick={handleUpdate}>
                                            Update
                                        </CustomButton>
                                    </div>
                                </div>
                            </CustomCard>
                        ) : (
                            <CustomCard className="p-4 flex justify-between items-center">
                                <p className="text-gray-700 truncate max-w-[1000px]">{tip.text}</p>
                                <div className="flex space-x-2">
                                    <CustomPopconfirm
                                        title="Are you sure to delete this tip?"
                                        onConfirm={() => handleDelete(tip.id)}
                                        okText="Yes"
                                        cancelText="No"

                                    > <CustomButton title="Delete Post" className='bg-red-500! text-white! hover:bg-red-600! border-none!'>
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
                <CustomPagination
                    total={tips.length}
                    pageSize={tipsPerPage}
                    onChange={handlePageChange}
                    current={currentPage}
                />
            </div>

        </div>
    );
};

export default WellnessTipsPage;