import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../RTK/profile/profileApi';
import { FaUser } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUrl';

const AppHeader = () => {
  const navigate = useNavigate();
  const { data: profileData } = useGetProfileQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const user = profileData?.data || {};
  const [imageError, setImageError] = useState(false);

  const rawImage = user?.profileImage;
  const hasValidImage = rawImage && typeof rawImage === 'string' && rawImage.trim() !== '' && !rawImage.includes('placehold.net') && !imageError;
  const profileImageUrl = hasValidImage ? getImageUrl(rawImage) : null;

  return (
    <header className="w-full p-4">
      <div className="flex items-center justify-between shadow-xs bg-white px-4 rounded-xl py-5">
        <div className="flex items-start ml-5">
          <h1 className='text-2xl font-bold'>Welcome back,<span className='text-2xl font-bold text-[#006C93] ml-2'>{user?.name || "User"}</span></h1>
        </div>
        <div className="flex items-center space-x-3 mr-4">
          <h3 className='font-semibold'>{user?.name || "User"}</h3>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={user?.name || "User Profile"}
              className="h-12 w-12 cursor-pointer object-cover rounded-full border border-gray-200"
              onClick={() => navigate('/profile')}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              onClick={() => navigate('/profile')}
              className="h-12 w-12 cursor-pointer rounded-full bg-[#006C93]/10 text-[#006C93] flex items-center justify-center border border-[#006C93]/20 hover:bg-[#006C93]/20 transition-colors"
              title={user?.name || "User Profile"}
            >
              <FaUser className="text-xl" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;