import React from 'react';
import { LuBell } from 'react-icons/lu';
import SearchInput from '../components/common/SearchInput';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const avatar = 'https://i.pravatar.cc/200';
  const navigate = useNavigate();

  return (
    <header className="w-full p-4">
      <div className="flex items-center justify-between shadow-xs bg-white px-4 rounded-xl py-5">
        <div className="flex items-start ml-5">
          <SearchInput />
        </div>
        <div className="flex items-center space-x-5 mr-4">
          {/* <LuBell className="h-7 w-7 text-gray-600 cursor-pointer" /> */}
          <img
            src={avatar}
            alt="User Avatar"
            className="h-12 w-12 rounded-full object-cover cursor-pointer"
            onClick={() => navigate('/profile')}
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;