import React from 'react';

const IconButton = ({
  icon,
  label,
  onClick,
  iconPosition = 'left', // 'left' or 'right'
  variant = 'default',    // 'default', 'outline', etc.
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-3 py-2 rounded transition duration-200 font-medium';
  const variants = {
    default: 'bg-[#252324] text-white hover:bg-[#141313]',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50',
  };

  const content = iconPosition === 'right'
    ? (
        <>
          {label && <span>{label}</span>}
          <span className="ml-2">{icon}</span>
        </>
      )
    : (
        <>
          <span className="mr-2">{icon}</span>
          {label && <span>{label}</span>}
        </>
      );

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
};

export default IconButton;
