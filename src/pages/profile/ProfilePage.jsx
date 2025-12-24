import React, { use } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { FiChevronRight, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import ProfileImage from '../../components/common/ProfileImage';

const ProfilePage = () => {
    const navigate = useNavigate();

    // Data
    const profileData = {
        name: "Faris Shafi",
        email: "rayyan6352@mail.com",
        phone: "0123456789",
        address: "Abu Dhabi, AB Road",
        avatar: "https://placehold.net/avatar.svg",
    };

    return (
        <div className=''>
            <h1 className="text-2xl font-bold mb-4">Profile</h1>

            <CustomCard className="p-8 w-full max-w-md">
                <div className="relative">

                    {/* Edit Button */}
                    <div className="absolute right-0">
                        <FaRegEdit onClick={() => navigate("/edit-profile")} title='Edit Profile' size={24} className='cursor-pointer' />
                    </div>

                    {/* Avatar + Name + Email */}
                    <div>
                        <ProfileImage
                            className="w-24 h-24 mb-4"
                        />
                        <div>
                            <h2 className="text-lg font-bold">{profileData.name}</h2>
                            <p className="text-gray-500 text-sm">{profileData.email}</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-10 space-y-4">

                        <button onClick={() => navigate('/change-password')} className="w-full p-4 bg-[#FBFBFB] rounded-xl flex justify-between items-center hover:bg-[#e2e8f0] transition duration-300 cursor-pointer">
                            <span className="font-medium">Change Password</span>
                            <FiChevronRight />
                        </button>

                        <button className="w-full p-4 bg-[#FBFBFB] rounded-xl flex justify-between items-center hover:bg-[#e2e8f0] transition duration-300 text-red-500 cursor-pointer">
                            <span className="font-medium">Log Out</span>
                            <FiLogOut />
                        </button>

                    </div>
                </div>
            </CustomCard>
        </div>
    );
};

export default ProfilePage;
