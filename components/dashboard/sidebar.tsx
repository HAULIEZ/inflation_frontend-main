'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiCalendar, 
  FiBarChart2, 
  FiTrendingUp, 
  FiPieChart, 
  FiInfo, 
  FiChevronRight, 
  FiChevronLeft,
  FiHome,
  FiActivity,
  FiFileText
} from 'react-icons/fi'
import { useEffect, useState } from 'react'

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  tooltip?: string;
};

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
  toggleCollapse?: () => void;
  mobileVisible?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, collapsed = false, toggleCollapse, mobileVisible = false }) => {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <FiHome className="h-5 w-5" />
    },
    {
      name: 'Forecasts',
      href: '/dashboard/Forecast',
      icon: <FiTrendingUp className="h-5 w-5" />
    },
    {
      name: 'Comparisons',
      href: '/dashboard/comparisons',
      icon: <FiBarChart2 className="h-5 w-5" />
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: <FiFileText className="h-5 w-5" />
    },
    {
      name: 'About',
      href: '/dashboard/about',
      icon: <FiInfo className="h-5 w-5" />,
      tooltip: 'Learn about the system, team, and data sources',
    },
  ]

  return (
    <div className={`
      ${mobileVisible ? 'flex' : 'hidden'} md:flex
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-20' : 'w-72'}
      bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl
      fixed md:relative inset-y-0 left-0 z-40
      flex-col h-screen
    `}>
      {/* Collapse/Expand Button */}
      {toggleCollapse && (
        <button
          onClick={toggleCollapse}
          className={`
            absolute top-6 -right-4 z-50 p-2 rounded-xl bg-white shadow-lg border border-gray-200/80
            hover:bg-gray-50 transition-all duration-200 group
            ${collapsed ? 'left-full right-auto' : ''}
          `}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <FiChevronRight className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
          ) : (
            <FiChevronLeft className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
          )}
        </button>
      )}
      
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200/50">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'}`}>
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
                  <FiTrendingUp className="text-white h-6 w-6" />
                </div>
              </div>
              {!collapsed && (
                <div className="ml-4">
                  <h1 className="text-lg font-bold text-blue-700">
                    InflaForecast
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className={`space-y-2 ${collapsed ? 'px-2' : 'px-4'}`} aria-label="Main navigation">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center relative
                    ${collapsed ? 'justify-center px-2 py-3 rounded-xl mx-1' : 'px-4 py-3 rounded-xl mx-1'}
                    text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg font-bold'
                      : 'text-gray-700 hover:bg-blue-50 hover:shadow-md'}
                  `}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={collapsed ? item.name : (item.tooltip || undefined)}
                >
                  {/* Active indicator */}
                  {isActive && !collapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-sm"></div>
                  )}
                  
                  <span className={`
                    flex items-center justify-center
                    ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}
                    ${collapsed ? 'mx-auto' : 'mr-3'}
                    transition-colors duration-200
                  `}>
                    {item.icon}
                  </span>
                  
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <span className={`block text-sm ${isActive ? 'font-bold' : 'font-semibold'}`}>
                        {item.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && hoveredItem === index && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 whitespace-nowrap">
                      {item.name}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
