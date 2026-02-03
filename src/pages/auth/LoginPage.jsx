import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Checkbox } from 'antd';
import CustomButton from '../../components/shared/Button';
import CustomInput from '../../components/shared/Input';
import WeCureLogo from '../../assets/logo.png'
import toast from '../../utils/toast';
import { useLoginMutation } from '../../RTK/auth/authApi';

const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const onFinish = async (values) => {
        try {
            const { email, password } = values;
            const userData = await login({ email, password }).unwrap();

            if (userData?.data?.role === 'ADMIN' || userData?.data?.role === 'SUPER_ADMIN') {
                const token = userData?.data?.token || userData?.token || userData?.data?.accessToken;
                if (token) {
                    localStorage.setItem('authToken', token);
                    toast.success('Login Successful!');
                    navigate('/');
                } else {
                    toast.error('Login failed: Token missing.');
                }
            }
            else {
                toast.error('You are not authorized to access this page.');
                localStorage.removeItem('authToken');
            }

        } catch (err) {
            toast.error(err.data?.message || 'Invalid credentials!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <img className='w-50 h-auto mx-auto'
                        src={WeCureLogo} alt="WeCure Logo"
                    />
                </div>

                <Form
                    form={form}
                    name="login"
                    initialValues={{
                        remember: false,
                        email: 'uno61@yopmail.com',
                        password: 'securepass',
                    }}
                    onFinish={onFinish}
                    layout="vertical"
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
                        <CustomInput placeholder="Enter your email" className="p-2" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Enter your password" className="p-2" />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex items-center justify-between">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-[#006C93]! hover:underline!"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <CustomButton type="primary" htmlType="submit" className="w-full py-3! text-lg!" loading={isLoading}>
                            Login
                        </CustomButton>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
