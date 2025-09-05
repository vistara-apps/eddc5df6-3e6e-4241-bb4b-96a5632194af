import { InteractionType, USState } from './types';

export const INTERACTION_TYPES: InteractionType[] = [
  {
    id: 'traffic-stop',
    name: 'Traffic Stop',
    description: 'Pulled over while driving',
    icon: 'Car'
  },
  {
    id: 'home-visit',
    name: 'Home Visit',
    description: 'Police at your door',
    icon: 'Home'
  },
  {
    id: 'street-encounter',
    name: 'Street Encounter',
    description: 'Approached while walking',
    icon: 'MapPin'
  },
  {
    id: 'arrest',
    name: 'Arrest Situation',
    description: 'Being detained or arrested',
    icon: 'AlertTriangle'
  }
];

export const US_STATES: USState[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

export const DEFAULT_RIGHTS_CONTENT = {
  'traffic-stop': {
    title: 'Traffic Stop Rights',
    content: 'You have the right to remain silent. You are required to provide your driver\'s license, registration, and proof of insurance when requested.',
    script: 'Officer, I am exercising my right to remain silent. I do not consent to any searches. Am I free to go?'
  },
  'home-visit': {
    title: 'Home Visit Rights',
    content: 'Police cannot enter your home without a warrant, your consent, or exigent circumstances. You do not have to let them in.',
    script: 'I do not consent to any search. I am exercising my right to remain silent. Do you have a warrant?'
  },
  'street-encounter': {
    title: 'Street Encounter Rights',
    content: 'You have the right to remain silent and the right to walk away unless you are being detained.',
    script: 'Am I being detained or am I free to go? I am exercising my right to remain silent.'
  },
  'arrest': {
    title: 'Arrest Rights',
    content: 'You have the right to remain silent and the right to an attorney. Anything you say can be used against you in court.',
    script: 'I am exercising my right to remain silent. I want to speak to a lawyer.'
  }
};
