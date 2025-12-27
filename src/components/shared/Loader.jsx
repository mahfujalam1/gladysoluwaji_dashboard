import React from 'react';
import { Spin } from 'antd';

const Loader = ({ spinning, children, tip, size }) => {
  return (
    <Spin spinning={spinning} size={size} tip={tip}>
      {children}
    </Spin>
  );
};

export default Loader;
