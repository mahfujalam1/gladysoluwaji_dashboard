import React from 'react';
import { Select } from 'antd';

const CustomSelect = ({ options, value, onChange, className = '' }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      className={className}
      style={{ width: 120 }}
    />
  );
};

export default CustomSelect;
