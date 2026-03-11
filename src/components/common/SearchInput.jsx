import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchInput = ({ value, onChange, onSearch, placeholder = 'Search', style }) => {
  return (
    <Search
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      allowClear
      style={{ width: 300, ...style }}
    />
  );
};

export default SearchInput;