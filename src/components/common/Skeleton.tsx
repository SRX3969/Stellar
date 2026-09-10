import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`stellar-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--surface-secondary)',
        backgroundImage: 'linear-gradient(90deg, var(--surface-secondary) 0%, var(--surface-hover) 50%, var(--surface-secondary) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.8s infinite ease-in-out',
        ...style,
      }}
    />
  );
};
