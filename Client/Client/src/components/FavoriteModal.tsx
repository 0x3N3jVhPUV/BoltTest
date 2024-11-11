import React, { useState } from 'react';
import { Star, Plus, X } from 'lucide-react';

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (theme: string) => void;
  favoriteThemes: string[];
  onAddTheme: (theme: string) => void;
}

export function FavoriteModal({ isOpen, onClose, onSave, favoriteThemes, onAddTheme }: FavoriteModalProps) {
  const [newTheme, setNewTheme] = useState('');
  const [showAddTheme, setShowAddTheme] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddTheme = () => {
    if (!newTheme.trim()) {
      setError('Le nom du thème ne peut pas être vide');
      return;
    }
    
    if (favoriteThemes.includes(newTheme.trim())) {
      setError('Ce thème existe déjà');
      return;
    }

    onAddTheme(newTheme.trim());
    setNewTheme('');
    setShowAddTheme(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Ajouter aux favoris
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {favoriteThemes.length === 0 && !showAddTheme ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Aucun thème favori n'existe encore.
            </p>
            <button
              onClick={() => setShowAddTheme(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer un thème
            </button>
          </div>
        ) : (
          <>
            {!showAddTheme && (
              <div className="mb-4">
                <div className="grid gap-2">
                  {favoriteThemes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => onSave(theme)}
                      className="w-full px-4 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Star className="w-4 h-4 text-yellow-500" />
                      {theme}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAddTheme(true)}
                  className="mt-4 w-full px-4 py-2 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau thème
                </button>
              </div>
            )}

            {showAddTheme && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom du thème
                </label>
                <input
                  type="text"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-2"
                  placeholder="Entrez le nom du thème"
                />
                {error && <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAddTheme(false);
                      setNewTheme('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddTheme}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}