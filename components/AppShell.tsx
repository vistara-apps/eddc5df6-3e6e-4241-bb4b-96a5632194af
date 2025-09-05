'use client';

import { useState } from 'react';
import { Shield, Book, AlertTriangle, Settings2 } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  variant?: 'default' | 'compact';
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  const [activeTab, setActiveTab] = useState('rights');

  const tabs = [
    { id: 'rights', label: 'Rights', icon: Shield },
    { id: 'education', label: 'Learn', icon: Book },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="glass-card m-4 mb-0 rounded-b-none border-b-0">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-textPrimary">
                KnowYourRights
              </h1>
              <p className="text-sm text-textSecondary mt-1">
                Your Pocket Guide to Police Encounters
              </p>
            </div>
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={variant === 'compact' ? 'px-2 py-2' : 'px-4 py-6 sm:px-6 lg:px-8'}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card m-4 mt-0 rounded-t-lg border-t-0">
        <div className="flex items-center justify-around py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive 
                    ? 'text-accent bg-accent/10' 
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
}
