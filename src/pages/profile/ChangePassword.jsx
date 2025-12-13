import React from 'react';
import CustomCard from '../../components/common/CustomCard';
import { Input, Form } from 'antd';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        toast.success("Password updated successfully!");
        console.log("Password Updated:", values);
    };

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-4 flex">
                <span onClick={() => navigate(-1)} className='rounded-full h-10 w-10 bg-white mr-4 cursor-pointer'>
                    <IoIosArrowBack size={38} />
                </span>
                Change Password
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
                        >
                            Update Password
                        </CustomButton>
                    </Form>
                </div>
            </CustomCard>
        </div>
    );
};

export default ChangePasswordPage;
