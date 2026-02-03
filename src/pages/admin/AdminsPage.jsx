import React, { useState, useEffect } from 'react';
import { useGetAdminsQuery, useToggleAdminStatusMutation, useAddAdminMutation } from '../../RTK/admin/adminApi';
import CustomCard from '../../components/common/CustomCard';
// import { LuTrash2 } from 'react-icons/lu';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';
// import ProfileImg from '../../assets/avater.png';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa6';
import AddAdmin from './modal/AddAdmin';
import Loader from '../../components/shared/Loader';

const Admin = () => {
    const { data: admins, isLoading } = useGetAdminsQuery();
    const [adminData, setAdminData] = useState([]);

    useEffect(() => {
        if (admins) {
            const mappedAdmins = (admins.users || admins.data || admins || []).map(admin => ({
                id: admin._id,
                avatar: admin.avatar || 'https://placehold.net/avatar.svg',
                name: admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim(),
                email: admin.email,
                phone: admin.phoneNumber || admin.phone,
                date: admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
                status: admin.status || (admin.isBlocked ? 'BLOCKED' : 'ACTIVE'),
            }));
            setAdminData(mappedAdmins);
        }
    }, [admins]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const [toggleAdminStatus] = useToggleAdminStatusMutation();
    const [addAdmin, { isLoading: isAdding }] = useAddAdminMutation();

    // const handleDelete = (id) => {
    //     toast.success("Admin deleted successfully!");
    //     setAdminData(prev => prev.filter(admin => admin.id !== id));
    // };

    const toggleBlock = async (id) => {
        try {
            await toggleAdminStatus(id).unwrap();
            toast.success("Admin status updated!");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleAddAdmin = async (values) => {
        try {
            await addAdmin(values).unwrap();
            toast.success("Admin added successfully!");
            setIsModalVisible(false);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to add admin");
        }
    };

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
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



                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader spinning={isLoading} />
                    </div>
                ) : (
                    adminData.map((admin) => (
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
                                    title={`Are you sure to ${admin.status === "BLOCKED" ? "unblock" : "block"} this admin?`}
                                    onConfirm={() => toggleBlock(admin.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <button title={admin.status === "BLOCKED" ? "Unblock Admin" : "Block Admin"}>
                                        {admin.status === "BLOCKED" ? (
                                            <FaUserSlash size={24} className="text-red-400 hover:text-red-500 transition-colors cursor-pointer" />
                                        ) : (
                                            <FaUserCheck size={24} className="text-green-400 hover:text-green-500 transition-colors cursor-pointer" />
                                        )}
                                    </button>
                                </CustomPopconfirm>

                                {/* DELETE */}
                                {/* <CustomPopconfirm
                                    title="Are you sure to delete this admin?"
                                    onConfirm={() => handleDelete(admin.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <button title='Delete Admin' className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                                        <LuTrash2 size={24} />
                                    </button>
                                </CustomPopconfirm> */}

                            </div>
                        </CustomCard>
                    )))}
            </div>

            {/* Modal */}
            <AddAdmin
                visible={isModalVisible}
                onCancel={handleCancel}
                onAdd={handleAddAdmin}
                loading={isAdding}
            />

        </div >
    );
};

export default Admin;
