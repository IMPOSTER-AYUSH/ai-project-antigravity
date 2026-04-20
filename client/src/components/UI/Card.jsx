import React from 'react';
import './Card.css';

export default function Card({ 
  children, 
  className = '', 
  hoverable = false, 
  glass = true,
  padding = 'md',
  onClick
}) {
  const hoverClass = hoverable ? 'card-hoverable' : '';
  const glassClass = glass ? 'glass' : '';
  const paddingClass = `card-pd-${padding}`; // none, sm, md, lg
  
  return (
    <div 
      className={`card ${glassClass} ${hoverClass} ${paddingClass} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
