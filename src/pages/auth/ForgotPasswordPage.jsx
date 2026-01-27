import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from 'antd';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';
import CustomInput from '../../components/shared/Input';
import { useForgotPasswordMutation } from '../../RTK/auth/authApi';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const onFinish = async (values) => {
        try {
            const { email } = values;
            await forgotPassword(email).unwrap();
            toast.success("OTP sent to your email!");
            // console.log('Password reset requested for:', email);
            navigate('/otp', { state: { email } });
        } catch (error) {
            toast.error(error?.data?.message || "Failed to send OTP. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#006C93]">Forgot Password</h1>
                    <p className="text-gray-500 mt-2">Enter your email to receive the OTP.</p>
                </div>

                <Form
                    form={form}
                    name="forgot_password"
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{
                        email: '',
                    }}
                >
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                        ]}
                    >
                        <CustomInput placeholder="Email Address" className="p-2" />
                    </Form.Item>

                    <Form.Item>
                        <CustomButton type="primary" htmlType="submit" className="w-full py-3!" loading={isLoading} disabled={isLoading}>
                            {isLoading ? "Sending..." : "GET OTP"}
                        </CustomButton>
                    </Form.Item>
                </Form>
                <div className="text-center mt-6">
                    <Link to="/login" className="text-sm text-[#006C93]! hover:underline!">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
