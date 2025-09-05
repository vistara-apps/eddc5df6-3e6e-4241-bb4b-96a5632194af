'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppShell } from '@/components/AppShell';
import { RightsCard } from '@/components/RightsCard';
import { SOSButton } from '@/components/SOSButton';
import { InteractionRecorder } from '@/components/InteractionRecorder';
import { StateSelector } from '@/components/StateSelector';
import { InteractionTypeSelector } from '@/components/InteractionTypeSelector';
import { generateRightsContent } from '@/lib/openai';
import { generateCardId } from '@/lib/utils';
import { DEFAULT_RIGHTS_CONTENT } from '@/lib/constants';
import { RightsCard as RightsCardType } from '@/lib/types';
import { Loader2, Shield, AlertTriangle, Book } from 'lucide-react';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [currentCard, setCurrentCard] = useState<RightsCardType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'rights' | 'emergency' | 'education'>('rights');

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleGenerateCard = async () => {
    if (!selectedState || !selectedType) return;

    setIsGenerating(true);
    
    try {
      // Try to generate with AI first, fallback to default content
      let content, script;
      
      try {
        const generated = await generateRightsContent(selectedState, selectedType);
        content = generated.content;
        script = generated.script;
      } catch (error) {
        console.error('AI generation failed, using default content:', error);
        const defaultContent = DEFAULT_RIGHTS_CONTENT[selectedType as keyof typeof DEFAULT_RIGHTS_CONTENT];
        content = defaultContent?.content || 'Rights information not available.';
        script = defaultContent?.script || 'I am exercising my right to remain silent.';
      }

      const card: RightsCardType = {
        cardId: generateCardId(),
        state: selectedState,
        interactionType: selectedType,
        title: DEFAULT_RIGHTS_CONTENT[selectedType as keyof typeof DEFAULT_RIGHTS_CONTENT]?.title || 'Your Rights',
        content,
        script,
        createdAt: new Date(),
      };

      setCurrentCard(card);
    } catch (error) {
      console.error('Failed to generate card:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSOSActivate = () => {
    console.log('SOS Alert activated!');
    // In a real app, this would send notifications to trusted contacts
    alert('Emergency alert sent to your trusted contacts!');
  };

  const handleRecordingStart = () => {
    console.log('Recording started');
  };

  const handleRecordingStop = (recordingData: any) => {
    console.log('Recording stopped:', recordingData);
    // In a real app, this would save the recording
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-20">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1">
          {[
            { id: 'rights', label: 'Rights', icon: Shield },
            { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
            { id: 'education', label: 'Education', icon: Book },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-accent text-white shadow-lg' 
                    : 'text-textSecondary hover:text-textPrimary hover:bg-primary/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Rights Tab */}
        {activeTab === 'rights' && (
          <div className="space-y-6">
            {/* State Selection */}
            <div className="card-content">
              <h2 className="text-lg font-semibold text-textPrimary mb-4">
                Get Your Rights Information
              </h2>
              <StateSelector
                selectedState={selectedState}
                onStateChange={setSelectedState}
              />
            </div>

            {/* Interaction Type Selection */}
            {selectedState && (
              <div className="card-content">
                <InteractionTypeSelector
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                />
              </div>
            )}

            {/* Generate Button */}
            {selectedState && selectedType && (
              <div className="text-center">
                <button
                  onClick={handleGenerateCard}
                  disabled={isGenerating}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Get My Rights Card</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Generated Rights Card */}
            {currentCard && (
              <RightsCard card={currentCard} variant="shareable" />
            )}
          </div>
        )}

        {/* Emergency Tab */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            {/* SOS Alert */}
            <div className="card-content text-center">
              <h2 className="text-lg font-semibold text-textPrimary mb-4">
                Emergency Alert
              </h2>
              <p className="text-textSecondary mb-6">
                Press and hold to send an immediate alert to your trusted contacts
              </p>
              <SOSButton onActivate={handleSOSActivate} />
            </div>

            {/* Recording */}
            <InteractionRecorder
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
            />

            {/* Emergency Tips */}
            <div className="card-content">
              <h3 className="text-lg font-semibold text-textPrimary mb-4">
                Emergency Tips
              </h3>
              <div className="space-y-3 text-sm text-textSecondary">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p>Stay calm and keep your hands visible</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p>Clearly state you are recording for safety</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p>Do not resist, even if you believe the stop is unlawful</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ask "Am I free to go?" if you're unsure about detention</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            {/* Constitutional Rights */}
            <div className="card-content">
              <h2 className="text-lg font-semibold text-textPrimary mb-4">
                Your Constitutional Rights
              </h2>
              <div className="space-y-4 text-textSecondary">
                <div>
                  <h4 className="font-medium text-textPrimary mb-2">Fifth Amendment</h4>
                  <p className="text-sm">You have the right to remain silent. You don't have to answer questions about where you're going, where you've been, or what you're doing.</p>
                </div>
                <div>
                  <h4 className="font-medium text-textPrimary mb-2">Fourth Amendment</h4>
                  <p className="text-sm">You have the right to be free from unreasonable searches and seizures. Police generally need a warrant or your consent to search you or your property.</p>
                </div>
                <div>
                  <h4 className="font-medium text-textPrimary mb-2">Sixth Amendment</h4>
                  <p className="text-sm">You have the right to an attorney. If you can't afford one, one will be appointed for you.</p>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="card-content">
              <h3 className="text-lg font-semibold text-textPrimary mb-4">
                Best Practices
              </h3>
              <div className="space-y-3">
                {[
                  'Keep your hands visible at all times',
                  'Speak clearly and respectfully',
                  'Don\'t argue or resist, even if you disagree',
                  'Remember details for later legal proceedings',
                  'Ask for a lawyer if you\'re arrested',
                  'Don\'t consent to searches without a warrant'
                ].map((practice, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-textSecondary">{practice}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="card-content">
              <h3 className="text-lg font-semibold text-textPrimary mb-4">
                Common Mistakes to Avoid
              </h3>
              <div className="space-y-3">
                {[
                  'Don\'t run or make sudden movements',
                  'Don\'t lie or provide false information',
                  'Don\'t consent to searches you\'re not required to allow',
                  'Don\'t argue about your rights during the encounter',
                  'Don\'t touch the officer or their equipment',
                  'Don\'t volunteer information beyond what\'s required'
                ].map((mistake, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-danger rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-textSecondary">{mistake}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
