import React from 'react';
import { Clock, Calendar, Filter } from 'lucide-react';

interface TopBarProps {
  onDurationFilter: (duration: string) => void;
  onDateFilter: (date: string) => void;
}

export function TopBar({ onDurationFilter, onDateFilter }: TopBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Durée
          </label>
          <select
            onChange={(e) => onDurationFilter(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
          >
            <option value="">Toutes les durées</option>
            <option value="0-300">Moins de 5 minutes</option>
            <option value="300-900">5-15 minutes</option>
            <option value="900-1800">15-30 minutes</option>
            <option value="1800-3600">30-60 minutes</option>
            <option value="3600+">Plus d'une heure</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date de publication
          </label>
          <select
            onChange={(e) => onDateFilter(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
          >
            <option value="">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>
    </div>
  );
}