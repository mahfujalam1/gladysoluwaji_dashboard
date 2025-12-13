import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchInput = () => {
  return (
    <Search
      placeholder="Search"
      onSearch={(value) => console.log(value)}
      style={{ width: 300 }}
    />
  );
};

export default SearchInput;