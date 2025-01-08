'use client';

import React, { useEffect } from 'react';
import { useUnsavedChanges } from '../context/UnsavedChangesContext';
import CustomLink from './CustomLink';

interface CustomLinkWrapperProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const CustomLinkWrapper: React.FC<CustomLinkWrapperProps> = ({ href, children, className }) => {
  const { hasUnsavedChanges, triggerShake, confirmNavigation } = useUnsavedChanges();



  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    

    if (hasUnsavedChanges) {

      triggerShake();
      confirmNavigation(href); // Save the pending navigation
    } else {

      confirmNavigation(href); // Navigate immediately
    }
  };

  return (
    <CustomLink href={href} onClick={handleNavigation} className={className}>
      {children}
    </CustomLink>
  );
};

export default CustomLinkWrapper;
