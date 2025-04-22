import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded font-medium transition duration-200 inline-flex items-center justify-center';

  const variants = {
    primary: 'bg-[#252324] text-white hover:opacity-90',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-[#252324] text-[#252324] hover:bg-gray-100',
    ghost: 'text-[#252324] hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const combined = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button onClick={onClick} className={combined} {...props}>
      {children}
    </button>
  );
};

export default Button;
