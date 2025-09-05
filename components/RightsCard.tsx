'use client';

import { useState } from 'react';
import { Copy, Share2, ExternalLink, CheckCircle } from 'lucide-react';
import { RightsCard as RightsCardType, GeneratedContent } from '@/lib/types';
import { copyToClipboard, generateShareableURL } from '@/lib/utils';

interface RightsCardProps {
  card?: RightsCardType;
  content?: GeneratedContent;
  state: string;
  interactionType: string;
  variant?: 'default' | 'shareable';
  onShare?: () => void;
}

export function RightsCard({ 
  card, 
  content, 
  state, 
  interactionType, 
  variant = 'default',
  onShare 
}: RightsCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      await copyToClipboard(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = () => {
    if (card) {
      const shareURL = generateShareableURL(card.cardId);
      if (navigator.share) {
        navigator.share({
          title: card.title,
          text: `Know your rights: ${card.title}`,
          url: shareURL,
        });
      } else {
        copyToClipboard(shareURL);
      }
    }
    onShare?.();
  };

  const displayContent = content || {
    rights: card?.content.split('\n') || [],
    script: card?.script || '',
    tips: [],
    warnings: []
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-textPrimary mb-1">
            {card?.title || `${interactionType.replace('-', ' ')} Rights`}
          </h2>
          <p className="text-sm text-textSecondary">
            {state} • {interactionType.replace('-', ' ')}
          </p>
        </div>
        
        {variant === 'shareable' && (
          <button
            onClick={handleShare}
            className="p-2 rounded-md hover:bg-surface transition-colors duration-200"
          >
            <Share2 className="h-5 w-5 text-accent" />
          </button>
        )}
      </div>

      {/* Your Rights */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-textPrimary">Your Rights</h3>
        <div className="space-y-2">
          {displayContent.rights.map((right, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <p className="text-sm text-textSecondary">{right}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What to Say */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-textPrimary">What to Say</h3>
          <button
            onClick={() => handleCopy(displayContent.script, 'script')}
            className="flex items-center space-x-1 text-accent hover:text-accent/80 transition-colors duration-200"
          >
            {copied === 'script' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="text-sm">Copy</span>
          </button>
        </div>
        <div className="bg-primary p-4 rounded-md border border-gray-600">
          <p className="text-sm font-medium text-textPrimary leading-relaxed">
            "{displayContent.script}"
          </p>
        </div>
      </div>

      {/* Tips */}
      {displayContent.tips.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-textPrimary">Safety Tips</h3>
          <div className="space-y-2">
            {displayContent.tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-textSecondary">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {displayContent.warnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-danger">Important Warnings</h3>
          <div className="space-y-2">
            {displayContent.warnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-danger rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-textSecondary">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div className="border-t border-gray-700 pt-4">
        <p className="text-xs text-textSecondary">
          This information is for educational purposes only and does not constitute legal advice. 
          Laws may vary by jurisdiction. Consult with a qualified attorney for specific legal guidance.
        </p>
      </div>

      {/* External Link */}
      {card?.linkToFullLaw && (
        <div className="flex items-center justify-center">
          <a
            href={card.linkToFullLaw}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">View Full Legal Text</span>
          </a>
        </div>
      )}
    </div>
  );
}
