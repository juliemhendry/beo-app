// Science-backed wellness interventions
export const INTERVENTIONS = [
  {
    id: 'breathing',
    name: 'Breathing Exercise',
    duration: 3,
    icon: '🌬️',
    description: 'Take slow, deep breaths. Inhale for 4 seconds, hold for 4, exhale for 4.',
  },
  {
    id: 'window',
    name: 'Window Fresh Air',
    duration: 2,
    icon: '🪟',
    description: 'Go to a window or step outside. Take in fresh air and observe your surroundings.',
  },
  {
    id: 'walk',
    name: 'Short Walk',
    duration: 10,
    icon: '🚶',
    description: 'Take a brief walk around your space. Move your body and clear your mind.',
  },
  {
    id: 'water',
    name: 'Cold Water Splash',
    duration: 1,
    icon: '💧',
    description: 'Splash cold water on your face. Feel refreshed and reset your focus.',
  },
  {
    id: 'stretch',
    name: 'Stretching',
    duration: 5,
    icon: '🧘',
    description: 'Stretch your arms, neck, and back. Release tension from your body.',
  },
];

// Get a random intervention
export const getRandomIntervention = () => {
  const randomIndex = Math.floor(Math.random() * INTERVENTIONS.length);
  return INTERVENTIONS[randomIndex];
};
