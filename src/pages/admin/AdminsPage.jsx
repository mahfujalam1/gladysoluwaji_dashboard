import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { LuTrash2 } from 'react-icons/lu';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';
import ProfileImg from '../../assets/avater.png';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa6';
import AddAdmin from './modal/AddAdmin';

const Admin = () => {
    const [adminData, setAdminData] = useState([
        {
            id: 1,
            avatar: ProfileImg,
            name: 'Tiago Felipe',
            email: 'tiagofelipe@mail.com',
            phone: '0123456789',
            date: '21 Nov 2025',
            blocked: false,
        },
        {
            id: 2,
            avatar: ProfileImg,
            name: 'Tiago Felipe',
            email: 'tiagofelipe@mail.com',
            phone: '0123456789',
            date: '21 Nov 2025',
            blocked: false,
        },
        {
            id: 3,
            avatar: ProfileImg,
            name: 'Tiago Felipe',
            email: 'tiagofelipe@mail.com',
            phone: '0123456789',
            date: '21 Nov 2025',
            blocked: false,
        },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const handleDelete = (id) => {
        toast.success("Admin deleted successfully!");
        setAdminData(prev => prev.filter(admin => admin.id !== id));
    };

    const toggleBlock = (id) => {
        setAdminData(prev =>
            prev.map(item =>
                item.id === id ? { ...item, blocked: !item.blocked } : item
            )
        );
        toast.success("Admin status updated!");
    };

    const handleAddAdmin = (values) => {
        const newAdmin = {
            id: adminData.length > 0 ? Math.max(...adminData.map(admin => admin.id)) + 1 : 1,
            avatar: ProfileImg,
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            phone: values.phone,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            blocked: false,
        };
        setAdminData(prev => [...prev, newAdmin]);
        toast.success("Admin added successfully!");
        setIsModalVisible(false);
    };

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <h1 className="p-2 font-bold text-xl">Admin Management</h1>
                <div className='items-center py-1'>
                    <CustomButton type="primary" title="Add Admin" className="text-sm! font-bold! p-4!" onClick={showModal}>
                        Add Admin
                    </CustomButton>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-5 gap-6 text-gray-500 font-semibold mb-2 px-8">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Phone</div>
                    <div>Added Date</div>
                    <div className="text-center">Action</div>
                </div>

                {adminData.map((admin) => (
                    <CustomCard
                        key={admin.id}
                        className="grid grid-cols-5 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <img
                                src={admin.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="font-medium">{admin.name}</div>
                        </div>
                        <div className="text-gray-600">{admin.email}</div>
                        <div className="text-gray-600">{admin.phone}</div>
                        <div className="text-gray-600">{admin.date}</div>

                        <div
                            className="flex justify-center items-center space-x-4"
                            onClick={(e) => e.stopPropagation()}
                        >

                            {/* BLOCK / UNBLOCK */}
                            <CustomPopconfirm
                                title={`Are you sure to ${admin.blocked ? "unblock" : "block"} this admin?`}
                                onConfirm={() => toggleBlock(admin.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <button title='Block/Unblock'>
                                    {admin.blocked ? (
                                        <FaUserSlash size={24} className="text-red-400 hover:text-red-500 transition-colors cursor-pointer" />
                                    ) : (
                                        <FaUserCheck size={24} className="text-green-400 hover:text-green-500 transition-colors cursor-pointer" />
                                    )}
                                </button>
                            </CustomPopconfirm>

                            {/* DELETE */}
                            <CustomPopconfirm
                                title="Are you sure to delete this admin?"
                                onConfirm={() => handleDelete(admin.id)}
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

            {/* Modal */}
            <AddAdmin
                visible={isModalVisible}
                onCancel={handleCancel}
                onAdd={handleAddAdmin}
            />

        </div>
    );
};

export default Admin;
