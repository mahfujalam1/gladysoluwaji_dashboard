import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import CustomCard from '../../components/common/CustomCard';
import { FiChevronRight, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import toast from '../../utils/toast';
import { useGetProfileQuery } from '../../RTK/profile/profileApi';

const ProfilePage = () => {
    const { data: profileData, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
    const navigate = useNavigate();

    const user = profileData?.data || profileData || {};

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    return (
        <div className=''>
            <h1 className="text-2xl font-bold mb-4">Profile</h1>

            <CustomCard className="p-8 w-full max-w-md">
                {profileLoading ? (
                    <div className="flex flex-col items-start">
                        <div className="mb-4">
                            <Skeleton.Avatar active size={96} shape="circle" />
                        </div>
                        <div className="space-y-2 mb-8 w-full">
                            <Skeleton.Input active size="default" style={{ width: 200, height: 28 }} />
                            <Skeleton.Input active size="small" style={{ width: 250 }} />
                            <Skeleton.Input active size="small" style={{ width: 150 }} />
                        </div>

                        <div className="w-full space-y-4 mt-2">
                            <Skeleton.Button active block style={{ height: 56, borderRadius: 12 }} />
                            <Skeleton.Button active block style={{ height: 56, borderRadius: 12 }} />
                        </div>
                    </div>
                ) : (
                    <div className="relative">

                        {/* Edit Button */}
                        <div className="absolute right-0">
                            <FaRegEdit onClick={() => navigate("/edit-profile")} title='Edit Profile' size={24} className='cursor-pointer' />
                        </div>

                        {/* Avatar + Name + Email */}
                        <div>
                            <img
                                className="w-24 h-24 mb-4 rounded-full object-cover"
                                src={user?.profileImage || 'https://placehold.net/avatar.svg'}
                                alt={user?.name || 'Profile'}
                            />
                            <div>
                                <h2 className="text-lg font-bold">{user?.name || 'N/A'}</h2>
                                <p className="text-gray-500 text-sm">{user?.email || 'N/A'}</p>
                                <p className="text-gray-500 text-sm">{user?.phone || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-10 space-y-4">

                            <button onClick={() => navigate('/change-password')} className="w-full p-4 bg-[#FBFBFB] rounded-xl flex justify-between items-center hover:bg-[#e2e8f0] transition duration-300 cursor-pointer">
                                <span className="font-medium">Change Password</span>
                                <FiChevronRight />
                            </button>

                            <button onClick={handleLogout} className="w-full p-4 bg-[#FBFBFB] rounded-xl flex justify-between items-center hover:bg-[#e2e8f0] transition duration-300 text-red-500 cursor-pointer">
                                <span className="font-medium">Log Out</span>
                                <FiLogOut />
                            </button>

                        </div>
                    </div>
                )}
            </CustomCard>
        </div>
    );
};

export default ProfilePage;
