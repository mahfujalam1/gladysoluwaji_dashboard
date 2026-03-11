import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../RTK/profile/profileApi';


const AppHeader = () => {
  const navigate = useNavigate();
  const { data: profileData } = useGetProfileQuery();
  const user = profileData?.data || {};


  return (
    <header className="w-full p-4">
      <div className="flex items-center justify-between shadow-xs bg-white px-4 rounded-xl py-5">
        <div className="flex items-start ml-5">
          <h1 className='text-2xl font-bold'>Welcome back,<span className='text-2xl font-bold text-[#006C93] ml-2'>{user?.name || "User"}</span></h1>
        </div>
        <div className="flex items-center space-x-3 mr-4">
          <h3 className='font-semibold'>{user?.name || "User"}</h3>
          <img
            src={user?.profileImage || 'https://placehold.net/avatar.svg'}
            alt={user?.name || "User Profile"}
            className="h-12 w-12 cursor-pointer object-cover rounded-full"
            onClick={() => navigate('/profile')}
          />

        </div>
      </div>
    </header>
  );
};

export default AppHeader;