import React, { useState, useEffect } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { Button, Input, Form, Skeleton, Space } from 'antd';
import { FaCamera, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import toast from '../../utils/toast';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../RTK/profile/profileApi';
import { getImageUrl } from '../../utils/imageUrl';

const EditProfile = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [preview, setPreview] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { data: profileData, isLoading: profileLoading, error: profileError } = useGetProfileQuery(undefined, {
        refetchOnFocus: false,
        refetchOnReconnect: false,
    });
    const [updateProfile] = useUpdateProfileMutation();


    useEffect(() => {
        if (profileData?.data) {
            form.setFieldsValue({
                name: profileData.data.name,
                phone: profileData.data.phone,
            });
            const img = profileData.data.profileImage;
            if (img && typeof img === 'string' && img.trim() !== '' && !img.includes('placehold.net')) {
                setPreview(getImageUrl(img));
            } else {
                setPreview('');
            }
        }
    }, [profileData, form]);


    const [selectedFile, setSelectedFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('phone', values.phone);
        if (selectedFile) {
            formData.append('profileImage', selectedFile);
        }

        try {
            await updateProfile(formData).unwrap();
            toast.success("Profile updated successfully!");
            navigate('/profile');
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };


    return (
        <div>
            <h1 className="flex items-center text-2xl font-bold mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-3 flex items-center justify-center h-8 w-8 rounded-full bg-white cursor-pointer"
                    aria-label="Go back"
                >
                    <IoIosArrowBack size={20} />
                </button>
                <span>Update Profile</span>
            </h1>

            <CustomCard className="p-8 w-full max-w-md">
                {profileLoading ? (
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <Skeleton.Avatar active size={96} shape="circle" />
                            <div className="flex flex-col gap-2">
                                <Skeleton.Button active size="small" style={{ width: 100 }} />
                            </div>
                        </div>
                        <Space direction="vertical" size="large" style={{ width: '100%', gap: '20px' }}>
                            <div>
                                <div className="mb-2"><Skeleton.Input active size="small" style={{ width: 60 }} /></div>
                                <Skeleton.Input active block size="large" />
                            </div>
                            <div>
                                <div className="mb-2"><Skeleton.Input active size="small" style={{ width: 60 }} /></div>
                                <Skeleton.Input active block size="large" />
                            </div>
                            <Skeleton.Button active block size="large" style={{ height: 48 }} />
                        </Space>
                    </div>
                ) : (
                    <div>

                        {/* Profile Image */}
                        <div className="flex items-center gap-4 mb-6">
                            {preview ? (
                                <img
                                    src={preview}
                                    className="w-24 h-24 rounded-full object-cover border border-gray-200"
                                    alt="Profile"
                                    onError={() => setPreview('')}
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-[#006C93]/10 text-[#006C93] flex items-center justify-center border border-[#006C93]/20">
                                    <FaUser className="text-4xl" />
                                </div>
                            )}

                            <label className="cursor-pointer flex items-center gap-2 text-sm text-[#005877] font-medium">
                                <FaCamera size={18} />
                                Edit Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        {/* Form */}
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={profileData}
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: "Enter name" }]}
                            >
                                <Input placeholder="Name" />
                            </Form.Item>

                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[{ required: true, message: "Enter phone number" }]}
                            >
                                <Input placeholder="Phone" />
                            </Form.Item>

                            <Button
                                htmlType="submit"
                                className="w-full bg-[#005877]! text-white! py-4! text-sm!"
                            >
                                Save Changes
                            </Button>
                        </Form>
                    </div>
                )}
            </CustomCard>
        </div>
    );
};

export default EditProfile;
