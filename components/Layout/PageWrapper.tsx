import React from 'react';
import { MainLayout } from './MainLayout';

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageWrapper({ children, title, subtitle, actions }: PageWrapperProps) {
  return (
    <MainLayout title={title}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {actions}
            </div>
          )}
        </div>

        {/* Page content */}
        <div>{children}</div>
      </div>
    </MainLayout>
  );
}