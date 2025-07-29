'use client'
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { base_url } from '../constants/base_url'

interface TopbarProps {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

interface UserData {
  user_id: number
  first_name: string
  last_name: string
  email: string
  role?: string
}

export default function Topbar({ onMenuClick, isSidebarOpen }: TopbarProps) {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const fetchUserData = async () => {
      try {
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('inflation-user='))
          ?.split('=')[1]

        if (!cookieValue) {
          throw new Error('User ID not found in cookies')
        }

        const userId = parseInt(cookieValue)
        const response = await fetch(`${base_url}/users/${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        if (data.success) {
          setUserData(data.user)
        } else {
          throw new Error(data.message || 'Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        router.push('/sign-in')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()

    return () => {
      clearInterval(timer)
    }
  }, [router])

  const handleLogout = () => {
    document.cookie = 'inflation-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/sign-in')
  }

  if (loading) {
    return (
      <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </header>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Mobile Menu Toggle */}
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 md:hidden"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {isSidebarOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Current Time */}
            <div className="hidden lg:flex items-center px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-600 font-medium">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {userData.first_name} {userData.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userData.role || 'User'}
                  </p>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/50 backdrop-blur-xl z-50">
                  <div className="p-4 border-b border-gray-200/50">
                    <p className="text-sm font-medium text-gray-900">
                      {userData.first_name} {userData.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                  <div className="py-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 group"
                    >
                      <FiLogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowUserMenu(false)
          }}
        />
      )}
    </header>
  )
}