import React from 'react';
import { Spin } from 'antd';

const Loader = ({ spinning, children, tip }) => {
  return (
    <Spin spinning={spinning} tip={tip}>
      {children}
    </Spin>
  );
};

export default Loader;
