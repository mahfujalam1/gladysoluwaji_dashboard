import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { Button, Input, Form } from 'antd';
import avatar from '../../assets/avater.png';
import { FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import toast from '../../utils/toast';

const EditProfile = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [preview, setPreview] = useState('https://placehold.net/avatar.svg');

    // Initial Data
    const profileData = {
        firstName: "Faris",
        lastName: "Shafi",
        email: "rayyan6352@mail.com",
        phone: "0123456789",
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (values) => {
        toast.success("Profile updated successfully!");
        console.log("Updated Profile Data:", values);

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
                <div>

                    {/* Profile Image */}
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={preview}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                        />

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
                            label="First Name"
                            name="firstName"
                            rules={[{ required: true, message: "Enter first name" }]}
                        >
                            <Input placeholder="First name" />
                        </Form.Item>

                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[{ required: true, message: "Enter last name" }]}
                        >
                            <Input placeholder="Last name" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Enter email" },
                                { type: "email", message: "Enter valid email" }
                            ]}
                        >
                            <Input placeholder="Email" />
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
            </CustomCard>
        </div>
    );
};

export default EditProfile;
