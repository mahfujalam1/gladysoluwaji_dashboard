import React, { useState, useEffect } from 'react';
import { Input, Form } from 'antd';
import CustomButton from '../../components/shared/Button';
import CustomCard from '../../components/common/CustomCard';
import toast from '../../utils/toast';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useChangePasswordMutation } from '../../RTK/auth/authApi';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleSubmit = async (values) => {
        try {
            const { currentPassword, newPassword } = values;
            await changePassword({ oldPassword: currentPassword, newPassword }).unwrap();
            toast.success("Password updated successfully!");
            form.resetFields();
            navigate('/profile');
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update password.");
        }
    };

    return (
        <div className="">
            <h1 className="flex items-center text-2xl font-bold mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-3 flex items-center justify-center h-8 w-8 rounded-full bg-white cursor-pointer"
                    aria-label="Go back"
                >
                    <IoIosArrowBack size={20} />
                </button>
                <span>Change Password</span>
            </h1>

            <CustomCard className="p-8 w-full max-w-md">
                <div className="">
                    {/* Form */}
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>

                        <Form.Item
                            label="Current Password"
                            name="currentPassword"
                            rules={[{ required: true, message: "Enter current password" }]}
                        >
                            <Input.Password placeholder="Enter current password" />
                        </Form.Item>

                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            rules={[{ required: true, message: "Enter new password" }]}
                        >
                            <Input.Password placeholder="Enter new password" />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Confirm new password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject("Passwords do not match");
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm new password" />
                        </Form.Item>

                        <CustomButton
                            htmlType="submit"
                            className="w-full py-4! text-sm!"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Password"}
                        </CustomButton>
                    </Form>
                </div>
            </CustomCard>
        </div>
    );
};

export default ChangePasswordPage;
