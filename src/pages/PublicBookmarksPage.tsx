import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, Moon, Sun, LogIn, LogOut, Settings, Bookmark as BookmarkIcon, X, Filter } from 'lucide-react';
import { publicAPI } from '../services/api';
import { Bookmark, Tag } from '../types';
import BookmarkCard from '../components/BookmarkCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const PublicBookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPopularTags();
  }, []);

  useEffect(() => {
    fetchPublicBookmarks();
  }, [searchQuery, selectedTag]);

  const fetchPopularTags = async () => {
    try {
      const response = await publicAPI.getPopularTags(20);
      if (response.success && response.data) {
        setPopularTags(response.data);
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const fetchPublicBookmarks = async () => {
    try {
      setIsLoading(true);
      const response = await publicAPI.getBookmarks({
        search: searchQuery || undefined,
        tag: selectedTag || undefined,
        limit: 50
      });
      
      if (response.success && response.data) {
        setBookmarks(response.data);
      }
    } catch (err) {
      console.error('Error fetching public bookmarks:', err);
      setError('Failed to load bookmarks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const clearFilters = () => {
    setSelectedTag(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 shadow-sm">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <BookmarkIcon size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                Bookmark Manager
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/public')}
                className="text-primary-600 dark:text-primary-400 font-medium"
              >
                Public Bookmarks
              </button>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Filter size={20} className="text-gray-600 dark:text-gray-400" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Moon size={20} className="text-gray-600" />
                ) : (
                  <Sun size={20} className="text-gray-400" />
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

      <div className="flex">
        {/* Sidebar - Filters */}
        <aside className={`${
          showFilters ? 'fixed inset-y-0 left-0 z-40' : 'hidden'
        } lg:sticky lg:block lg:top-16 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto`}>
          
          {/* Mobile Close Button */}
          <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Active Filters */}
            {(selectedTag || searchQuery) && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    Active Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTag && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                      {selectedTag}
                      <button onClick={() => setSelectedTag(null)}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery('')}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Popular Tags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-3">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTag === tag.name
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag.name}
                    {tag.usage_count && (
                      <span className="ml-1 text-xs opacity-75">
                        ({tag.usage_count})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="sticky top-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-8 py-4 z-20">
            <div className="relative max-w-3xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search public bookmarks..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-4 lg:px-8 py-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Public Bookmarks
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover bookmarks shared by the community
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <Loader2 size={48} className="animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No public bookmarks found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || selectedTag
                    ? 'Try adjusting your filters or search query'
                    : 'Be the first to share a public bookmark!'}
                </p>
                {isAuthenticated && (
                  <button
                    onClick={() => navigate('/bookmarks')}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Go to My Bookmarks
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Found {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {bookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      showActions={false}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default PublicBookmarksPage;