'use client';

import { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { US_STATES } from '@/lib/constants';
import { USState } from '@/lib/types';

interface StateSelectorProps {
  selectedState?: string;
  onStateChange: (state: string) => void;
}

export function StateSelector({ selectedState, onStateChange }: StateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStates = US_STATES.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStateName = US_STATES.find(state => state.code === selectedState)?.name;

  const handleStateSelect = (stateCode: string) => {
    onStateChange(stateCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-gray-600 rounded-lg text-textPrimary hover:border-accent transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-textSecondary" />
          <span>
            {selectedStateName || 'Select your state'}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-textSecondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-600 rounded-lg shadow-card z-50 max-h-64 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-700">
            <input
              type="text"
              placeholder="Search states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-field"
              autoFocus
            />
          </div>

          {/* States List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredStates.map((state) => (
              <button
                key={state.code}
                onClick={() => handleStateSelect(state.code)}
                className={`w-full text-left px-4 py-3 hover:bg-primary/50 transition-colors duration-200 ${
                  selectedState === state.code ? 'bg-accent/20 text-accent' : 'text-textPrimary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{state.name}</span>
                  <span className="text-sm text-textSecondary">{state.code}</span>
                </div>
              </button>
            ))}
          </div>

          {filteredStates.length === 0 && (
            <div className="p-4 text-center text-textSecondary">
              No states found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
