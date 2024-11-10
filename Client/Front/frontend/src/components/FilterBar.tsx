import React from 'react';

interface FilterBarProps {
  onDurationChange: (duration: string) => void;
  onDateChange: (date: string) => void;
  onAuthorChange: (author: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onDurationChange,
  onDateChange,
  onAuthorChange,
}) => {
  return (
    <div className="filter-bar">
      <div>
        <label>Durée :</label>
        <select onChange={(e) => onDurationChange(e.target.value)}>
          <option value="">Toutes</option>
          <option value="short">Courte (&lt; 4 minutes)</option>
          <option value="medium">Moyenne (4 - 20 minutes)</option>
          <option value="long">Longue (&gt; 20 minutes)</option>
        </select>
      </div>
      <div>
        <label>Date de publication :</label>
        <input type="date" onChange={(e) => onDateChange(e.target.value)} />
      </div>
      <div>
        <label>Auteur :</label>
        <input
          type="text"
          placeholder="Nom de l'auteur"
          onChange={(e) => onAuthorChange(e.target.value)}
        />
      </div>
    </div>
  );
};
