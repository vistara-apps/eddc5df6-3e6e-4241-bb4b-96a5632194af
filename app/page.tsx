'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { RightsCard } from '@/components/RightsCard';
import { SOSButton } from '@/components/SOSButton';
import { InteractionRecorder } from '@/components/InteractionRecorder';
import { Shield, MapPin, Users, Settings2, Plus, Trash2, Edit } from 'lucide-react';
import { US_STATES, INTERACTION_TYPES } from '@/lib/constants';
import { generateRightsContent } from '@/lib/openai';
import { GeneratedContent, TrustedContact } from '@/lib/types';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedState, setSelectedState] = useState('California');
  const [selectedInteraction, setSelectedInteraction] = useState('traffic-stop');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedState = localStorage.getItem('selectedState');
    const savedContacts = localStorage.getItem('trustedContacts');
    
    if (savedState) setSelectedState(savedState);
    if (savedContacts) setTrustedContacts(JSON.parse(savedContacts));
  }, []);

  // Save state changes
  useEffect(() => {
    localStorage.setItem('selectedState', selectedState);
  }, [selectedState]);

  useEffect(() => {
    localStorage.setItem('trustedContacts', JSON.stringify(trustedContacts));
  }, [trustedContacts]);

  const handleGenerateRights = async () => {
    setIsGenerating(true);
    try {
      const content = await generateRightsContent(selectedState, selectedInteraction as any);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addTrustedContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: TrustedContact = {
        contactId: Date.now().toString(),
        userId: 'current-user',
        name: newContact.name,
        phoneNumber: newContact.phone,
        notificationPreference: 'both'
      };
      setTrustedContacts([...trustedContacts, contact]);
      setNewContact({ name: '', phone: '' });
      setIsAddingContact(false);
    }
  };

  const removeTrustedContact = (contactId: string) => {
    setTrustedContacts(trustedContacts.filter(c => c.contactId !== contactId));
  };

  const renderHomePage = () => (
    <div className="space-y-6 pb-20">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Shield className="h-16 w-16 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary mb-2">
            Know Your Rights
          </h1>
          <p className="text-textSecondary">
            Your pocket guide to police encounters. Stay informed, stay safe.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => setCurrentPage('rights')}
          className="glass-card p-6 text-left hover:bg-surface/80 transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-accent/20 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-textPrimary">View Your Rights</h3>
              <p className="text-sm text-textSecondary">
                Get state-specific rights and scripts
              </p>
            </div>
          </div>
        </button>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-danger/20 p-3 rounded-lg">
              <Users className="h-6 w-6 text-danger" />
            </div>
            <div>
              <h3 className="font-medium text-textPrimary">Emergency SOS</h3>
              <p className="text-sm text-textSecondary">
                Alert trusted contacts instantly
              </p>
            </div>
          </div>
          <SOSButton 
            contacts={trustedContacts}
            onAlert={(location) => {
              console.log('SOS triggered with location:', location);
            }}
          />
        </div>
      </div>

      {/* Current Location */}
      <div className="glass-card p-4">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium text-textPrimary">Current State</p>
            <p className="text-sm text-textSecondary">{selectedState}</p>
          </div>
          <button
            onClick={() => setCurrentPage('settings')}
            className="ml-auto text-accent hover:text-accent/80"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderRightsPage = () => (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-textPrimary mb-2">
          Your Rights & Scripts
        </h2>
        <p className="text-textSecondary">
          Select your situation to get specific guidance
        </p>
      </div>

      {/* State Selection */}
      <div className="glass-card p-4">
        <label className="block text-sm font-medium text-textPrimary mb-2">
          State
        </label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full input-field"
        >
          {US_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Interaction Type Selection */}
      <div className="glass-card p-4">
        <label className="block text-sm font-medium text-textPrimary mb-3">
          Interaction Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INTERACTION_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedInteraction(type.id)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                selectedInteraction === type.id
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface text-textSecondary border-gray-600 hover:border-accent'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateRights}
        disabled={isGenerating}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Get My Rights & Scripts'}
      </button>

      {/* Generated Content */}
      {generatedContent && (
        <RightsCard
          content={generatedContent}
          state={selectedState}
          interactionType={selectedInteraction}
          variant="shareable"
        />
      )}

      {/* Recording Section */}
      <InteractionRecorder
        onRecordingStart={() => console.log('Recording started')}
        onRecordingStop={(blob) => console.log('Recording stopped:', blob)}
      />
    </div>
  );

  const renderContactsPage = () => (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-textPrimary mb-2">
          Trusted Contacts
        </h2>
        <p className="text-textSecondary">
          People who will be notified in an emergency
        </p>
      </div>

      {/* Add Contact Form */}
      {isAddingContact ? (
        <div className="glass-card p-4 space-y-4">
          <h3 className="font-medium text-textPrimary">Add New Contact</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              className="w-full input-field"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              className="w-full input-field"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={addTrustedContact}
              className="flex-1 btn-primary"
            >
              Add Contact
            </button>
            <button
              onClick={() => {
                setIsAddingContact(false);
                setNewContact({ name: '', phone: '' });
              }}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingContact(true)}
          className="w-full glass-card p-4 border-2 border-dashed border-gray-600 hover:border-accent transition-colors duration-200"
        >
          <div className="flex items-center justify-center space-x-2 text-accent">
            <Plus className="h-5 w-5" />
            <span>Add Trusted Contact</span>
          </div>
        </button>
      )}

      {/* Contacts List */}
      <div className="space-y-3">
        {trustedContacts.map(contact => (
          <div key={contact.contactId} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-textPrimary">{contact.name}</h3>
                <p className="text-sm text-textSecondary">{contact.phoneNumber}</p>
              </div>
              <button
                onClick={() => removeTrustedContact(contact.contactId)}
                className="p-2 text-danger hover:bg-danger/20 rounded-md transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {trustedContacts.length === 0 && !isAddingContact && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-textSecondary mx-auto mb-3" />
          <p className="text-textSecondary">No trusted contacts added yet</p>
          <p className="text-sm text-textSecondary mt-1">
            Add contacts to enable SOS alerts
          </p>
        </div>
      )}
    </div>
  );

  const renderSettingsPage = () => (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-textPrimary mb-2">
          Settings
        </h2>
        <p className="text-textSecondary">
          Customize your app preferences
        </p>
      </div>

      {/* State Setting */}
      <div className="glass-card p-4">
        <h3 className="font-medium text-textPrimary mb-3">Default State</h3>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full input-field"
        >
          {US_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <p className="text-sm text-textSecondary mt-2">
          This will be used for generating state-specific rights information
        </p>
      </div>

      {/* App Info */}
      <div className="glass-card p-4">
        <h3 className="font-medium text-textPrimary mb-3">About</h3>
        <div className="space-y-2 text-sm text-textSecondary">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Purpose:</strong> Educational tool for understanding constitutional rights</p>
          <p><strong>Disclaimer:</strong> This app provides general information and does not constitute legal advice</p>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
        <h3 className="font-medium text-orange-400 mb-2">Important Notice</h3>
        <p className="text-sm text-orange-300">
          This app is for educational purposes only. Laws vary by jurisdiction and situation. 
          Always consult with a qualified attorney for specific legal advice.
        </p>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'rights':
        return renderRightsPage();
      case 'contacts':
        return renderContactsPage();
      case 'settings':
        return renderSettingsPage();
      default:
        return renderHomePage();
    }
  };

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </AppShell>
  );
}
