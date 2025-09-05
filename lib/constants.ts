export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

export const INTERACTION_TYPES = [
  { id: 'traffic-stop', label: 'Traffic Stop', icon: '🚗' },
  { id: 'home-visit', label: 'Home Visit', icon: '🏠' },
  { id: 'street-encounter', label: 'Street Encounter', icon: '🚶' },
  { id: 'arrest', label: 'Arrest Situation', icon: '⚖️' }
] as const;

export const EMERGENCY_SCRIPTS = {
  'traffic-stop': {
    opening: "Officer, I'm exercising my right to remain silent. I do not consent to any searches.",
    questions: "Am I free to go? If not, what am I being detained for?",
    recording: "I am recording this interaction for my safety and yours."
  },
  'home-visit': {
    opening: "I do not consent to any search. Do you have a warrant?",
    questions: "What is this regarding? Am I under arrest?",
    recording: "I am recording this interaction as is my right."
  },
  'street-encounter': {
    opening: "I'm exercising my right to remain silent.",
    questions: "Am I free to go? Am I being detained?",
    recording: "I am recording this interaction."
  },
  'arrest': {
    opening: "I invoke my right to remain silent and my right to an attorney.",
    questions: "I want to speak to a lawyer immediately.",
    recording: "I am being arrested. Please contact my emergency contacts."
  }
};
