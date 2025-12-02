import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogIn, LogOut, Settings, Bookmark as BookmarkIcon, Globe, Lock, Search, FolderOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const features = [
    {
      icon: <BookmarkIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />,
      title: "Smart Organization",
      description: "Organize bookmarks with folders, tags, and smart search"
    },
    {
      icon: <Globe className="w-8 h-8 text-green-600 dark:text-green-400" />,
      title: "Public Sharing",
      description: "Share your favorite links with the community"
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Privacy Control",
      description: "Keep bookmarks private or make them public"
    },
    {
      icon: <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      title: "Quick Search",
      description: "Find any bookmark instantly with powerful search"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 shadow-sm">
        <div className="absolute inset-0 flex justify-start c pointer-events-none">
          <div className="w-[400px] h-[400px] rounded-full blur-[133px] shadow-[0_0_200px_rgba(0,0,0,0.25)] bg-[linear-gradient(#1D86C2_58%,_#2B126F_10%)]"></div>
        </div>
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <BookmarkIcon size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Bookmark Manager
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className="text-primary-600 dark:text-primary-400 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/public')}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Public Bookmarks
              </button>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Sun size={20} className="text-gray-400" />
                  
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </button>

              {/* Auth Section */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20 animate-scale-in">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            {user.full_name || user.username}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            @{user.username}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/bookmarks');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <BookmarkIcon size={16} />
                          My Bookmarks
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/profile');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <Settings size={16} />
                          Settings
                        </button>

                        <div className="border-t border-gray-200 dark:border-gray-600" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-red-600 dark:text-red-400"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
        <div className="px-4 lg:px-8 py-20 lg:py-32 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-3xl mb-8">
            <BookmarkIcon size={40} className="text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Organize Your Web
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
            Save, organize, and discover amazing web resources. Never lose a great link again.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            {isAuthenticated ? (
              <>
                
                  <button
                    onClick={() => navigate("/bookmarks")}
                    className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
                    Go to My Bookmarks
                  </button>
        
                  <button
                  onClick={() => navigate("/public")}
                    className="px-8 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-semibold text-lg">
                    Browse Public
                  </button>
              </>
            ) : (
              <>
               
                    <button
                      onClick={() => navigate("/register")}
                      className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
                      Get Started Free
                    </button>
                 
                    <button
                      onClick={() => navigate("/public")}
                      className="px-8 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-semibold text-lg">
                      Browse Public
                    </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-end justify-end  pointer-events-none">
        <div className="w-[300px] h-[300px] rounded-full blur-[133px] shadow-[0_0_200px_rgba(0,0,0,0.25)] bg-[linear-gradient(140deg,_#DE4DBC_31%)]"></div>
      </div>

      {/* Features Section */}
      <div className="px-4 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-16">
            Everything you need to manage your bookmarks efficiently
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-primary-600 dark:bg-primary-700">
          <div className="px-4 lg:px-8 py-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users organizing their bookmarks
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
            >
              Create Free Account
            </button>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left text-gray-600 dark:text-gray-400">
              <p>© 2024 Bookmark Manager. Made with Hemnarayan</p>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => navigate('/privacy-policy')}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;