import React from 'react';

const CustomCard = ({ title, children, className = '', onClick, ...rest }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-4 ${className}`}
      {...rest}
    >
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  );
};

export default CustomCard;
