import React from 'react';

const CATEGORIES = [
  'All',
  'Monsoon',
  'Easy',
  'Moderate',
  'Moderate-Hard',
  'Waterfalls',
  'Weekend',
  'One Day'
];

export default function FilterChips({ activeCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-forest-900 text-white shadow-md shadow-forest-900/10 scale-105'
                  : 'bg-white text-slate-700 hover:bg-forest-50 border border-slate-200'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
