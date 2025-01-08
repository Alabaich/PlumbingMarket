'use client';

import React, { ReactNode } from 'react';

interface CustomLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children, onClick, className, ...props }) => {
  return (
    <a href={href} onClick={onClick} className={className} {...props}>
      {children}
    </a>
  );
};

export default CustomLink;
