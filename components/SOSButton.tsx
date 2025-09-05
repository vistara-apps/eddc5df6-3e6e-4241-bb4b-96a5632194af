'use client';

import { useState } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';

interface SOSButtonProps {
  variant?: 'default' | 'pulsing';
  onActivate?: () => void;
}

export function SOSButton({ variant = 'default', onActivate }: SOSButtonProps) {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handlePress = () => {
    if (isActivated) return;

    // Start 3-second countdown
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActivated(true);
          onActivate?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => {
    setCountdown(0);
    setIsActivated(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main SOS Button */}
      <button
        onClick={handlePress}
        disabled={isActivated}
        className={`
          relative w-32 h-32 rounded-full font-bold text-white text-xl
          transition-all duration-200 shadow-lg hover:shadow-xl
          ${isActivated 
            ? 'bg-gray-600 cursor-not-allowed' 
            : countdown > 0
            ? 'bg-orange-500 animate-pulse'
            : variant === 'pulsing'
            ? 'bg-danger animate-pulse-slow hover:bg-danger/90'
            : 'bg-danger hover:bg-danger/90'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {countdown > 0 ? (
            <span className="text-3xl">{countdown}</span>
          ) : isActivated ? (
            <>
              <Phone className="w-8 h-8 mb-1" />
              <span className="text-sm">SENT</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-8 h-8 mb-1" />
              <span className="text-sm">SOS</span>
            </>
          )}
        </div>
      </button>

      {/* Cancel Button (shown during countdown) */}
      {countdown > 0 && (
        <button
          onClick={handleCancel}
          className="btn-secondary text-sm px-4 py-2"
        >
          Cancel
        </button>
      )}

      {/* Status Text */}
      <div className="text-center">
        {isActivated ? (
          <p className="text-accent font-medium">
            Emergency contacts notified
          </p>
        ) : countdown > 0 ? (
          <p className="text-orange-400 font-medium">
            Sending alert in {countdown}...
          </p>
        ) : (
          <p className="text-textSecondary text-sm">
            Hold to send emergency alert
          </p>
        )}
      </div>
    </div>
  );
}
