import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input } from 'antd';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // Handle password reset logic
        toast.success("Password reset successfully!");
        console.log('New password:', values.password);
        // On success, navigate to the login page
        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#006C93]">Reset Password</h1>
                    <p className="text-gray-500 mt-2">Enter your new password below.</p>
                </div>

                <Form
                    form={form}
                    name="reset_password"
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{
                        password: '',
                        confirmPassword: '',
                    }}
                >
                    <Form.Item
                        label="New Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new Password!',
                            },
                            {
                                min: 6,
                                message: 'Password must be at least 6 characters long',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="New Password" className="p-2" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your Password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm New Password" className="p-2" />
                    </Form.Item>

                    <Form.Item>
                        <CustomButton type="primary" htmlType="submit" className="w-full py-3!">
                            Reset Password
                        </CustomButton>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
