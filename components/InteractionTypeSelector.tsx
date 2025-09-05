'use client';

import { Car, Home, MapPin, AlertTriangle } from 'lucide-react';
import { INTERACTION_TYPES } from '@/lib/constants';

interface InteractionTypeSelectorProps {
  selectedType?: string;
  onTypeChange: (type: string) => void;
}

const iconMap = {
  Car,
  Home,
  MapPin,
  AlertTriangle,
};

export function InteractionTypeSelector({ selectedType, onTypeChange }: InteractionTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-textPrimary">
        Select Interaction Type
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {INTERACTION_TYPES.map((type) => {
          const Icon = iconMap[type.icon as keyof typeof iconMap];
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={`
                flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200
                ${isSelected 
                  ? 'bg-accent/20 border-accent text-accent' 
                  : 'bg-surface border-gray-600 text-textPrimary hover:border-accent/50 hover:bg-accent/5'
                }
              `}
            >
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${isSelected ? 'bg-accent/30' : 'bg-primary/50'}
              `}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 text-left">
                <h4 className="font-medium">{type.name}</h4>
                <p className={`text-sm ${isSelected ? 'text-accent/80' : 'text-textSecondary'}`}>
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
