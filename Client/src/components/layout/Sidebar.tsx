import React, { useState } from 'react';
import { FolderTree, Youtube, Twitter, Rss, ChevronDown, ChevronRight, Trash2, Plus } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

interface ThemeItem {
  label: string;
  icon?: React.ElementType;
  children?: ThemeItem[];
  disabled?: boolean;
  permanent?: boolean;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  themeName: string;
}

interface AddThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (themeName: string) => void;
  parentCategory: string;
}

function DeleteModal({ isOpen, onClose, onConfirm, themeName }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Supprimer le thème
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Êtes-vous sûr de vouloir supprimer le thème "{themeName}" ?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function AddThemeModal({ isOpen, onClose, onConfirm, parentCategory }: AddThemeModalProps) {
  const [themeName, setThemeName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!themeName.trim()) {
      setError('Le nom du thème ne peut pas être vide');
      return;
    }

    onConfirm(themeName.trim());
    setThemeName('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ajouter un thème à {parentCategory}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="themeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom du thème
            </label>
            <input
              type="text"
              id="themeName"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Entrez le nom du thème"
            />
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen, onCategorySelect, selectedCategory }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Thèmes', 'Youtube']);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; theme: string }>({
    isOpen: false,
    theme: ''
  });
  const [addModal, setAddModal] = useState<{ isOpen: boolean; parentCategory: string }>({
    isOpen: false,
    parentCategory: ''
  });
  const [themes, setThemes] = useState<ThemeItem[]>([
    {
      label: 'Thèmes',
      icon: FolderTree,
      children: [
        {
          label: 'Youtube',
          icon: Youtube,
          children: [
            { label: 'All', permanent: true },
            { label: 'Ai' },
            { label: 'Crypto' },
            { label: 'Edu' }
          ]
        },
        {
          label: 'Twitter',
          icon: Twitter,
          children: [
            { label: 'Bientôt disponible', disabled: true, permanent: true }
          ]
        },
        {
          label: 'RSS',
          icon: Rss,
          children: [
            { label: 'Bientôt disponible', disabled: true, permanent: true }
          ]
        }
      ]
    }
  ]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleItemClick = (item: ThemeItem) => {
    if (item.disabled) return;
    
    if (!item.children) {
      onCategorySelect(item.label);
    } else {
      toggleExpand(item.label);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, theme: string) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, theme });
  };

  const handleDeleteConfirm = () => {
    const deleteTheme = (items: ThemeItem[]): ThemeItem[] => {
      return items.map(item => ({
        ...item,
        children: item.children
          ? item.children.filter(child => child.label !== deleteModal.theme)
          : undefined
      }));
    };

    setThemes(deleteTheme);
    setDeleteModal({ isOpen: false, theme: '' });
  };

  const handleAddClick = (e: React.MouseEvent, parentCategory: string) => {
    e.stopPropagation();
    setAddModal({ isOpen: true, parentCategory });
  };

  const handleAddConfirm = (themeName: string) => {
    const addTheme = (items: ThemeItem[]): ThemeItem[] => {
      return items.map(item => {
        if (item.children) {
          if (item.label === addModal.parentCategory) {
            return {
              ...item,
              children: [...item.children, { label: themeName }]
            };
          }
          return {
            ...item,
            children: addTheme(item.children)
          };
        }
        return item;
      });
    };

    setThemes(addTheme);
    setAddModal({ isOpen: false, parentCategory: '' });
  };

  const renderThemeItem = (item: ThemeItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const Icon = item.icon;
    const isSelected = item.label === selectedCategory;
    const canDelete = !item.permanent && !item.disabled && depth === 2;
    const canAddThemes = depth === 1 && !item.children?.some(child => child.label === 'Bientôt disponible');

    return (
      <li key={item.label}>
        <div className="relative group">
          <button
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            className={`
              w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200
              ${depth === 2 ? 'pl-12' : depth === 1 ? 'pl-8' : 'pl-4'}
              ${item.disabled 
                ? 'opacity-50 cursor-not-allowed text-gray-500 dark:text-gray-400' 
                : isSelected 
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
              }
              ${hasChildren ? 'font-medium' : ''}
            `}
          >
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )
            )}
            {Icon && <Icon className="w-5 h-5" />}
            <span>{item.label}</span>
          </button>
          {canDelete && (
            <button
              onClick={(e) => handleDeleteClick(e, item.label)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {canAddThemes && (
            <button
              onClick={(e) => handleAddClick(e, item.label)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900/50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <ul className="mt-1">
            {item.children.map(child => renderThemeItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <div 
        className={`
          fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden
          ${isOpen ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'}
        `}
      />

      <aside 
        className={`
          fixed top-16 bottom-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4">
          <ul className="space-y-1">
            {themes.map(item => renderThemeItem(item))}
          </ul>
        </nav>
      </aside>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, theme: '' })}
        onConfirm={handleDeleteConfirm}
        themeName={deleteModal.theme}
      />

      <AddThemeModal
        isOpen={addModal.isOpen}
        onClose={() => setAddModal({ isOpen: false, parentCategory: '' })}
        onConfirm={handleAddConfirm}
        parentCategory={addModal.parentCategory}
      />
    </>
  );
}