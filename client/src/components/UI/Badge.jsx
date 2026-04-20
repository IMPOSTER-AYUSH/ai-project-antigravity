import React from 'react';

export default function Badge({ children, variant = 'primary', className = '' }) {
  const styles = {
    primary: { background: 'var(--accent-bg)', color: 'var(--accent-primary)', border: '1px solid var(--accent-border)' },
    secondary: { background: 'var(--bg-glass)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' },
    success: { background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)' },
    warning: { background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.3)' },
    error: { background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.3)' },
    info: { background: 'var(--info-bg)', color: 'var(--info)', border: '1px solid rgba(59, 130, 246, 0.3)' },
  };

  return (
    <span 
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
}
