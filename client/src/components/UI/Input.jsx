import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  fullWidth = true,
  icon,
  ...props
}, ref) => {
  return (
    <div className={`input-group ${fullWidth ? 'input-full' : ''} ${error ? 'has-error' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input 
          ref={ref}
          type={type} 
          className={`input-field ${icon ? 'has-icon' : ''}`} 
          {...props} 
        />
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
