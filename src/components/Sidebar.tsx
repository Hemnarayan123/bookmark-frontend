import React from 'react';
import { Folder, Tag, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  folders: Array<{ folder: string; count: number }>;
  tags: Array<{ id: number; name: string; usage_count?: number }>;
  selectedFolder: string | null;
  selectedTag: string | null;
  onFolderSelect: (folder: string | null) => void;
  onTagSelect: (tag: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  tags,
  selectedFolder,
  selectedTag,
  onFolderSelect,
  onTagSelect,
  isOpen,
  onClose,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bookmarks
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun size={20} className="text-gray-400" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Folders */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Folder size={18} className="text-gray-500 dark:text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Folders
              </h2>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => onFolderSelect(null)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedFolder === null
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>All Bookmarks</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {folders.reduce((sum, f) => sum + f.count, 0)}
                  </span>
                </div>
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.folder}
                  onClick={() => onFolderSelect(folder.folder)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedFolder === folder.folder
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{folder.folder}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {folder.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={18} className="text-gray-500 dark:text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Tags
              </h2>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => onTagSelect(null)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedTag === null
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                All Tags
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onTagSelect(tag.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedTag === tag.name
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{tag.name}</span>
                    {tag.usage_count !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {tag.usage_count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;