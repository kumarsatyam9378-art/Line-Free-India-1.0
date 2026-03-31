import React from 'react';
import { BusinessCategoryInfo } from '../../constants/businessRegistry';

export default function ThemeProvider({
  businessInfo,
  children
}: {
  businessInfo: BusinessCategoryInfo;
  children: React.ReactNode
}) {
  return (
    <div className={businessInfo.designTheme}>
      {children}
    </div>
  );
}
