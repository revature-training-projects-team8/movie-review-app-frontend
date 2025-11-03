import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context.jsx'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const { context, updatedContext } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSignOut = () => {
    updatedContext({ currentUser: null })
    navigate('/')
  }

  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Company Logo - Left Side */}
          <div className="flex-shrink-0">
            {context?.currentUser ? (<Link to={context?.currentUser.role === "ADMIN" ? "/dashboard" : "/"} className="text-xl font-bold text-orange-500">
              <span className="text-white">Rev</span><span className="text-orange-500">Cine</span>
            </Link>) : (
              <Link to="/" className="text-xl font-bold">
              <span className="text-white">Rev</span><span className="text-orange-500">Cine</span>
            </Link>
            )

            }
            
          </div>

          {/* Navigation Links - Right Side */}
          <div className="flex space-x-6">
            {context?.currentUser ? 
            (context.currentUser.role === "ADMIN" ? (
              <Link 
              to="/dashboard"
              className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ADMIN DASHBOARD
            </Link>
            ):(
              <Link 
              to="/" 
              className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            )) : 
              <Link 
              to="/" 
              className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            }
            
            {context?.currentUser ? (
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <UserIcon className="h-5 w-5" />
                  <span>{context.currentUser.username}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </MenuButton>
                
                <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    {/* {context.currentUser.role === "USER" && (
                      <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/profile"
                          className={`${
                            focus ? 'bg-gray-100' : ''
                          } flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                        >
                          <UserIcon className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      )}
                    </MenuItem>
                    )}                   */}
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={handleSignOut}
                          className={`${
                            focus ? 'bg-gray-100' : ''
                          } flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                
                <Link 
                  to="/register" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}
