import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onCategoryAdd: (category: Category) => void;
  onCategoryDelete: (categoryId: string) => void;
}

export function Sidebar({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  onCategoryAdd, 
  onCategoryDelete 
}: SidebarProps) {
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onCategoryAdd({
        id: Date.now().toString(),
        name: newCategory.trim(),
        videos: []
      });
      setNewCategory('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 pt-20 px-4">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">YouTube Categories</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Create Category
          </button>
        </div>

        {isAdding && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="New category"
                className="flex-1 px-3 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                autoFocus
              />
              <button
                onClick={handleAddCategory}
                className="px-3 py-1 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <nav className="space-y-1 overflow-y-auto flex-1">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center justify-between group px-3 py-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer ${
                selectedCategory === category.id ? 'bg-zinc-200 dark:bg-zinc-800' : ''
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <span className="text-zinc-700 dark:text-zinc-300">
                {category.name}
                {category.videos.length > 0 && (
                  <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
                    ({category.videos.length})
                  </span>
                )}
              </span>
              {category.id !== '1' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryDelete(category.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                  aria-label={`Delete ${category.name} category`}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}