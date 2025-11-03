import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavigation } from '../Navigation/TopNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        isCollapsed={sidebarCollapsed}
      />

      {/* Main content area */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${!isMobile ? (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64') : ''}
      `}>
        {/* Top Navigation */}
        <TopNavigation
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}