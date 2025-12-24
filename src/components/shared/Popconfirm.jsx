import React from 'react';
import { Popconfirm } from 'antd';

const CustomPopconfirm = ({ children, title, onConfirm, onCancel, okText = 'Yes', cancelText = 'No' }) => {
  return (
    <Popconfirm
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      placement="topRight"
      okButtonProps={{
        style: {
          backgroundColor: '#006C93',
          borderColor: '#006C93',
          color: '#fff',
        },
      }}
    >
      {children}
    </Popconfirm>
  );
};

export default CustomPopconfirm;
