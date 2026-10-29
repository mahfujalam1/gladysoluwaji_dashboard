import React, { useState, useEffect } from 'react';
import CustomCard from '../../components/common/CustomCard';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';
import { LuTrash2 } from 'react-icons/lu';
import { FaPen } from 'react-icons/fa6';
import AddSpecialty from './modal/AddSpecialty';
import Loader from '../../components/shared/Loader';
import { getImageUrl, defaultAvatar } from '../../utils/imageUrl';
import { 
    useGetSpecialistsQuery, 
    useAddSpecialistMutation, 
    useUpdateSpecialistMutation, 
    useDeleteSpecialistMutation 
} from '../../RTK/specialist/specialistApi';

const SpecialtiesPage = () => {
    const { data: specialists, isLoading } = useGetSpecialistsQuery();
    const [specialtiesData, setSpecialtiesData] = useState([]);

    const [addSpecialist, { isLoading: isAdding }] = useAddSpecialistMutation();
    const [updateSpecialist, { isLoading: isUpdating }] = useUpdateSpecialistMutation();
    const [deleteSpecialist] = useDeleteSpecialistMutation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState(null);

    useEffect(() => {
        if (specialists?.data) {
            const mapped = specialists.data.map(item => ({
                id: item._id,
                image: getImageUrl(item.thumbnail),
                name: item.name,
                date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
                status: item.isActive ? 'ACTIVE' : 'INACTIVE',
                isActive: item.isActive,
                description: item.description,
            }));
            setSpecialtiesData(mapped);
        }
    }, [specialists]);

    const showModal = (specialty = null) => {
        setEditingSpecialty(specialty);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setEditingSpecialty(null);
        setIsModalVisible(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteSpecialist(id).unwrap();
            toast.success("Specialty deleted successfully!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete specialty");
        }
    };

    const handleSaveSpecialty = async (values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('isActive', values.status ? 'true' : 'false');
            if (values.image) {
                formData.append('image', values.image);
            }

            if (editingSpecialty) {
                await updateSpecialist({ id: editingSpecialty.id, data: formData }).unwrap();
                toast.success("Specialty updated successfully!");
            } else {
                await addSpecialist(formData).unwrap();
                toast.success("Specialty added successfully!");
            }
            handleCancel();
        } catch (error) {
            toast.error(error?.data?.message || `Failed to ${editingSpecialty ? 'update' : 'add'} specialty`);
        }
    };

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold mb-6">Specialties Management</h1>
                <div className='items-center py-1'>
                    <CustomButton type="primary" title="Add Specialty" className="text-sm! font-bold! p-4!" onClick={() => showModal(null)}>
                        Add Specialty
                    </CustomButton>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-4 gap-6 text-gray-500 font-semibold mb-2 px-8">
                    <div>Name</div>
                    <div>Status</div>
                    <div>Added Date</div>
                    <div className="text-center">Action</div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader spinning={isLoading} />
                    </div>
                ) : (
                    specialtiesData.map((specialty) => (
                        <CustomCard
                            key={specialty.id}
                            className="grid grid-cols-4 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <img
                                    src={specialty.image}
                                    alt="specialty"
                                    className="w-10 h-10 rounded object-cover"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = defaultAvatar;
                                    }}
                                />
                                <div className="font-medium">{specialty.name}</div>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${specialty.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {specialty.status}
                                </span>
                            </div>
                            <div className="text-gray-600">{specialty.date}</div>

                            <div
                                className="flex justify-center items-center space-x-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* EDIT */}
                                <button 
                                    title="Edit Specialty" 
                                    className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                                    onClick={() => showModal(specialty)}
                                >
                                    <FaPen size={20} />
                                </button>

                                {/* DELETE */}
                                <CustomPopconfirm
                                    title="Are you sure to delete this specialty?"
                                    onConfirm={() => handleDelete(specialty.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <button title='Delete Specialty' className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                                        <LuTrash2 size={22} />
                                    </button>
                                </CustomPopconfirm>
                            </div>
                        </CustomCard>
                    ))
                )}
            </div>

            {/* Modal */}
            <AddSpecialty
                visible={isModalVisible}
                onCancel={handleCancel}
                onAdd={handleSaveSpecialty}
                loading={isAdding || isUpdating}
                initialData={editingSpecialty}
            />
        </div>
    );
};

export default SpecialtiesPage;
