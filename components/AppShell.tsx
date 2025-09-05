'use client';

import { useState, useEffect } from 'react';
import { Shield, Menu, X, Home, FileText, Phone, Settings2 } from 'lucide-react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface AppShellProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function AppShell({ children, currentPage = 'home', onNavigate }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'rights', label: 'Rights', icon: FileText },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  const handleNavigate = (pageId: string) => {
    onNavigate?.(pageId);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="glass-card border-b border-gray-700 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-lg font-semibold text-textPrimary">KnowYourRights</h1>
              <p className="text-xs text-textSecondary">Your Pocket Guide</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-surface transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-textPrimary" />
            ) : (
              <Menu className="h-6 w-6 text-textPrimary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-700 bg-surface">
            <nav className="px-4 py-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors duration-200 ${
                      currentPage === item.id
                        ? 'bg-accent text-white'
                        : 'text-textSecondary hover:text-textPrimary hover:bg-primary'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Bottom Navigation for larger screens */}
      <nav className="hidden sm:block fixed bottom-0 left-0 right-0 glass-card border-t border-gray-700">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-accent'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
