import React from 'react';
import { Pagination } from 'antd';

const CustomPagination = ({ total, current, pageSize, onChange, showSizeChanger = true }) => {
  return (
    <Pagination
      total={total}
      current={current}
      pageSize={pageSize}
      onChange={onChange}
      // showSizeChanger={showSizeChanger}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
    />
  );
};

export default CustomPagination;
