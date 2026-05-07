const Card = ({ children, className = '', noPadding = false, ...props }) => {
  const paddingClass = noPadding ? '' : 'p-4';
  
  return (
    <div className={`fintech-card ${paddingClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
