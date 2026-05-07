const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClass = variant === 'primary' ? 'btn-primary-custom' : `btn btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  
  return (
    <button 
      className={`${baseClass} ${sizeClass} ${className}`} 
      style={{ transition: 'all 0.2s ease' }} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
