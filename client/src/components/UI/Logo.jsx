import React from 'react';

export default function Logo({ size = 40, className = '', color = 'white' }) {
  return (
    <div
      className={`logo-container ${className}`}
      style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={color}
        viewBox="0 0 24 24"
        width={size}
        height={size}
      >
        <path d="M17 9h-2v13h-2v-6h-2v6H9V9H7V7h10v2Zm-6 5h2V9h-2v5Zm-6-1H3v-2h2v2Zm16 0h-2v-2h2v2ZM7 11H5V9h2v2Zm12 0h-2V9h2v2Zm-5-5h-4V2h4v4Z" />
      </svg>
    </div>
  );
}
