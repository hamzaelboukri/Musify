'use client';

import { SVGProps } from 'react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<IconSize, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'size'> {
  size?: IconSize;
}

export function createIcon(
  displayName: string,
  path: string | string[],
  viewBox = '0 0 24 24'
) {
  const IconComponent = ({ size = 'md', className = '', ...props }: IconProps) => {
    const paths = Array.isArray(path) ? path : [path];
    return (
      <svg
        viewBox={viewBox}
        fill="currentColor"
        className={`${sizeMap[size]} ${className}`}
        aria-hidden
        {...props}
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  };
  IconComponent.displayName = displayName;
  return IconComponent;
}
