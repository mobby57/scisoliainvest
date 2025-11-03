import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Calculator, 
  FileText, 
  Settings, 
  BarChart3, 
  Users, 
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed?: boolean;
}

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: Home, badge: null },
  { name: 'Projets SCI', href: '/projects', icon: TrendingUp, badge: '3' },
  { name: 'Simulateur', href: '/simulator', icon: Calculator, badge: null },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: null },
  { name: 'Investisseurs', href: '/investors', icon: Users, badge: null },
  { name: 'Transactions', href: '/transactions', icon: CreditCard, badge: '12' },
  { name: 'Documents', href: '/documents', icon: FileText, badge: null },
  { name: 'Paramètres', href: '/settings', icon: Settings, badge: null },
];

export function Sidebar({ isOpen, onToggle, isCollapsed = false }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        transition-all duration-300 ease-in-out
      `}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SCI</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Solia Invest</span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">SCI</span>
              </div>
            )}
            <button
              onClick={onToggle}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md
                    text-gray-700 hover:bg-gray-100 hover:text-gray-900
                    transition-colors duration-200
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute left-8 top-1 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">U</span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Utilisateur</p>
                  <p className="text-xs text-gray-500 truncate">user@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed inset-0 z-50 
        ${isOpen ? 'block' : 'hidden'}
      `}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onToggle}
        />
        
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SCI</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Solia Invest</span>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                    onClick={onToggle}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Utilisateur</p>
                  <p className="text-xs text-gray-500 truncate">user@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}