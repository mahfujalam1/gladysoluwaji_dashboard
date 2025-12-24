import React from 'react';
import { LuBell } from 'react-icons/lu';
import SearchInput from '../components/common/SearchInput';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '../components/common/ProfileImage';

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full p-4">
      <div className="flex items-center justify-between shadow-xs bg-white px-4 rounded-xl py-5">
        <div className="flex items-start ml-5">
          <SearchInput />
        </div>
        <div className="flex items-center space-x-3 mr-4">
          {/* <LuBell className="h-7 w-7 text-gray-600 cursor-pointer" /> */}
          <h3 className='font-semibold'>Faris Shafi</h3>
          <ProfileImage
            className="h-12 w-12 cursor-pointer"
            onClick={() => navigate('/profile')}
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;