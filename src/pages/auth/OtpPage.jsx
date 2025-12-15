import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input } from 'antd';
import toast from '../../utils/toast';
import CustomButton from '../../components/shared/Button';

const OtpPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // Handle OTP verification logic
        toast.success("OTP verified successfully!");
        console.log('OTP submitted:', values.otp);
        // On success, navigate to the reset password page
        setTimeout(() => {
            navigate('/reset-password');
        }, 1500);
    };

    const handleResend = () => {
        // Handle resend OTP logic
        toast.success("OTP resent to your email successfully!");
        console.log('Resend OTP requested');
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
                    initialValues={{
                        otp: '651',
                    }}
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
                        <CustomButton type="primary" htmlType="submit" className="w-full py-3!">
                            Verify
                        </CustomButton>
                    </Form.Item>
                </Form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Didn't receive the code?{' '}
                        <button onClick={handleResend} className="text-[#006C93] hover:underline cursor-pointer">
                            Resend OTP
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OtpPage;
