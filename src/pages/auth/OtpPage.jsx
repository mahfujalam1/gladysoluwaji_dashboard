import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input } from 'antd';
import toast from '../../utils/toast';
import CustomButton from '../../components/shared/Button';
import { useVerifyOtpMutation, useForgotPasswordMutation } from '../../RTK/auth/authApi';

const OtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const [form] = Form.useForm();
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
    const [resendOtp, { isLoading: isResending }] = useForgotPasswordMutation();

    const onFinish = async (values) => {
        try {
            const { otp } = values;
            const response = await verifyOtp({ email, otp }).unwrap();
            // Assuming the token is in response.data.resetToken or response.resetToken. 
            // Adjust based on actual API response. 
            // Based on typical patterns and the user request, we need this token for the next step.
            const resetToken = response?.data?.resetToken || response?.resetToken || response?.token;

            toast.success("OTP verified successfully!");
            navigate('/reset-password', { state: { resetToken } });
        } catch (error) {
            toast.error(error?.data?.message || "Invalid OTP. Please try again.");
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error("Email not found. Please try again from the start.");
            return;
        }
        try {
            await resendOtp(email).unwrap();
            toast.success("OTP resent to your email successfully!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to resend OTP.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[#006C93]">Enter OTP</h1>
                    <p className="text-gray-500 mt-2">A 6-digit code has been sent to your email.</p>
                </div>

                <Form
                    form={form}
                    name="otp_verification"
                    onFinish={onFinish}
                    className='justify-items-center'
                >
                    <Form.Item
                        name="otp"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the OTP!',
                            },
                            {
                                len: 6,
                                message: 'OTP must be 6 digits long!',
                            },
                        ]}
                    >
                        <Input.OTP
                            length={6}
                            className="w-full p-3 rounded-md tracking-[1em]"
                        />
                    </Form.Item>

                    <Form.Item className='w-full'>
                        <CustomButton type="primary" htmlType="submit" className="w-full py-3!" loading={isLoading} disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Verify"}
                        </CustomButton>
                    </Form.Item>
                </Form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Didn't receive the code?{' '}
                        <button onClick={handleResend} disabled={isResending} className="text-[#006C93] hover:underline cursor-pointer disabled:opacity-50">
                            {isResending ? "Resending..." : "Resend OTP"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OtpPage;
