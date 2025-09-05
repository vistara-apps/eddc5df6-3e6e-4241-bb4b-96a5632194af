'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin } from 'lucide-react';
import { TrustedContact } from '@/lib/types';
import { getCurrentLocation } from '@/lib/utils';

interface SOSButtonProps {
  contacts: TrustedContact[];
  variant?: 'default' | 'pulsing';
  onAlert?: (location?: string) => void;
}

export function SOSButton({ contacts, variant = 'default', onAlert }: SOSButtonProps) {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            triggerAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const getLocation = async () => {
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      setLocation(locationString);
      return locationString;
    } catch (error) {
      console.error('Failed to get location:', error);
      return 'Location unavailable';
    }
  };

  const handleSOSPress = async () => {
    if (isActivated) {
      // Cancel the alert
      setIsActivated(false);
      setCountdown(0);
      return;
    }

    // Get location first
    const currentLocation = await getLocation();
    
    // Start countdown
    setIsActivated(true);
    setCountdown(5); // 5 second countdown
  };

  const triggerAlert = async () => {
    setIsActivated(false);
    setCountdown(0);

    // In a real app, this would send SMS/calls to trusted contacts
    console.log('SOS Alert triggered!');
    console.log('Contacts to notify:', contacts);
    console.log('Location:', location);

    // Simulate sending alerts
    for (const contact of contacts) {
      console.log(`Alerting ${contact.name} at ${contact.phoneNumber}`);
      // Here you would integrate with SMS/calling service
    }

    onAlert?.(location);

    // Show confirmation
    alert(`SOS alert sent to ${contacts.length} contact(s)!\nLocation: ${location}`);
  };

  const isPulsing = variant === 'pulsing' || isActivated;

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleSOSPress}
        disabled={contacts.length === 0}
        className={`
          relative w-32 h-32 rounded-full font-bold text-white shadow-lg
          transition-all duration-200 transform active:scale-95
          ${contacts.length === 0 
            ? 'bg-gray-600 cursor-not-allowed' 
            : isActivated
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-danger hover:bg-danger/90'
          }
          ${isPulsing ? 'animate-pulse-slow' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <AlertTriangle className="h-8 w-8 mb-2" />
          {countdown > 0 ? (
            <div className="text-center">
              <div className="text-2xl font-bold">{countdown}</div>
              <div className="text-xs">TAP TO CANCEL</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg">SOS</div>
              <div className="text-xs">EMERGENCY</div>
            </div>
          )}
        </div>

        {/* Pulse ring effect */}
        {isPulsing && (
          <div className="absolute inset-0 rounded-full border-4 border-danger animate-ping opacity-75" />
        )}
      </button>

      {/* Status and Info */}
      <div className="text-center space-y-2">
        {countdown > 0 && (
          <p className="text-sm text-orange-400 font-medium">
            Sending alert in {countdown} seconds...
          </p>
        )}
        
        {contacts.length === 0 ? (
          <p className="text-sm text-textSecondary">
            Add trusted contacts to enable SOS alerts
          </p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-textSecondary">
              Will alert {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-textSecondary">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>Call/SMS</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>Location</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center max-w-xs">
        <p className="text-xs text-textSecondary">
          Press and hold for 5 seconds to send emergency alert with your location to trusted contacts.
        </p>
      </div>
    </div>
  );
}
