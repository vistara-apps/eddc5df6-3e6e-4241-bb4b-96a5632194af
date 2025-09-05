export interface User {
  userId: string;
  walletAddress?: string;
  darkModeEnabled: boolean;
  preferredLanguage: string;
}

export interface RightsCard {
  cardId: string;
  state: string;
  interactionType: string;
  title: string;
  content: string;
  script: string;
  linkToFullLaw?: string;
  sharingURL?: string;
  createdAt: Date;
}

export interface TrustedContact {
  contactId: string;
  userId: string;
  name: string;
  phoneNumber: string;
  notificationPreference: 'sms' | 'call' | 'both';
}

export interface InteractionLog {
  logId: string;
  userId: string;
  timestamp: Date;
  location?: string;
  recordingURL?: string;
  notes?: string;
}

export interface InteractionType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface USState {
  code: string;
  name: string;
}
