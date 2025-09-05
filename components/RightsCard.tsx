'use client';

import { useState } from 'react';
import { Copy, Share2, ExternalLink } from 'lucide-react';
import { RightsCard as RightsCardType } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';

interface RightsCardProps {
  card: RightsCardType;
  variant?: 'default' | 'shareable';
}

export function RightsCard({ card, variant = 'default' }: RightsCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyScript = async () => {
    try {
      await copyToClipboard(card.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy script:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: `${card.content}\n\nScript: ${card.script}`,
          url: card.sharingURL || window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      await copyToClipboard(card.sharingURL || window.location.href);
    }
  };

  return (
    <div className={`card-content ${variant === 'shareable' ? 'border-2 border-accent' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-textPrimary mb-2">
            {card.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-textSecondary">
            <span>{card.state}</span>
            <span>•</span>
            <span>{card.interactionType.replace('-', ' ')}</span>
          </div>
        </div>
        
        {variant === 'shareable' && (
          <button
            onClick={handleShare}
            className="p-2 text-textSecondary hover:text-accent transition-colors duration-200"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-medium text-textPrimary mb-2">
            Your Rights:
          </h4>
          <p className="text-base leading-6 text-textSecondary">
            {card.content}
          </p>
        </div>

        {/* Script */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-base font-medium text-textPrimary">
              What to Say:
            </h4>
            <button
              onClick={handleCopyScript}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                copied 
                  ? 'bg-accent/20 text-accent' 
                  : 'bg-primary/50 text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className="script-text">
            "{card.script}"
          </div>
        </div>

        {/* Additional Resources */}
        {card.linkToFullLaw && (
          <div className="pt-2 border-t border-gray-700">
            <a
              href={card.linkToFullLaw}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">View Full Legal Text</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
