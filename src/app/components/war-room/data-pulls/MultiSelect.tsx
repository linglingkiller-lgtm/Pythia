import React, { useState } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  isDarkMode: boolean;
  textColor: string;
  textMuted: string;
  borderColor: string;
  allowCustom?: boolean;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder,
  isDarkMode,
  textColor,
  textMuted,
  borderColor,
  allowCustom = false
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

  function toggleOption(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  function addCustom() {
    if (customInput.trim() && !selected.includes(customInput.trim())) {
      onChange([...selected, customInput.trim()]);
      setCustomInput('');
    }
  }

  function removeSelected(option: string) {
    onChange(selected.filter(s => s !== option));
  }

  return (
    <div className="relative">
      <label className={`block text-sm font-semibold ${textColor} mb-2`}>
        {label}
      </label>
      
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(item => (
            <span
              key={item}
              className={`px-2 py-1 ${isDarkMode ? 'bg-blue-950/40 text-blue-400' : 'bg-blue-100 text-blue-700'} rounded text-xs font-semibold flex items-center gap-1`}
            >
              {item}
              <button
                onClick={() => removeSelected(item)}
                className="hover:opacity-70"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg text-left flex items-center justify-between`}
      >
        <span className={selected.length === 0 ? textMuted : textColor}>
          {selected.length === 0 ? (placeholder || 'Select...') : `${selected.length} selected`}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={`absolute z-50 mt-2 w-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${borderColor} rounded-lg shadow-xl max-h-60 overflow-y-auto`}>
          {options.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`w-full px-4 py-2 text-left text-sm ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'} ${selected.includes(option) ? (isDarkMode ? 'bg-blue-950/40 text-blue-400' : 'bg-blue-50 text-blue-700') : textColor}`}
            >
              {option}
            </button>
          ))}
          
          {allowCustom && (
            <div className={`border-t ${borderColor} p-2`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustom()}
                  placeholder="Add custom..."
                  className={`flex-1 px-2 py-1 text-sm ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'} border ${borderColor} rounded`}
                />
                <button
                  type="button"
                  onClick={addCustom}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
