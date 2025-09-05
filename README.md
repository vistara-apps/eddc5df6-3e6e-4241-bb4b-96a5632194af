# KnowYourRights Cards

Your Pocket Guide to Police Encounters - A Base Mini App

## Overview

KnowYourRights Cards is a mobile-first application designed to help individuals quickly access their rights, scripts, and safety features during police interactions. The app provides state-specific information and includes emergency features for real-time protection.

## Features

### 🛡️ State-Specific Rights & Scripts
- One-page, mobile-optimized guides for your rights
- Pre-written scripts for common law enforcement interactions
- Location-based, state-specific legal information

### 🚨 Real-Time Safety Features
- Discreet audio/video recording capabilities
- SOS alert system to notify trusted contacts
- Emergency tips and best practices

### 📚 Educational Content
- Constitutional rights information
- Best practices for police encounters
- Common mistakes to avoid

### 📱 Shareable Content
- Auto-generated rights cards
- Easy sharing with support networks
- Save for personal documentation

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit)
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI/OpenRouter for content generation
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI or OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd knowyourrights-cards
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your API keys in `.env.local`:
- `OPENAI_API_KEY` or `OPENROUTER_API_KEY` for content generation
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` for Base integration

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Accessing Rights Information
1. Select your state from the dropdown
2. Choose the type of police interaction
3. Generate your personalized rights card
4. Copy scripts or share the card

### Emergency Features
1. Use the SOS button to alert trusted contacts
2. Start recording interactions discreetly
3. Access emergency tips and best practices

### Educational Content
- Learn about constitutional rights
- Review best practices for police encounters
- Understand common mistakes to avoid

## Design System

The app uses a dark theme optimized for mobile use:

- **Colors**: Dark background with accent colors for important actions
- **Typography**: Clear, readable fonts with proper contrast
- **Components**: Modular, reusable UI components
- **Responsive**: Mobile-first design with tablet/desktop support

## API Integration

### OpenAI/OpenRouter
- Generates state-specific rights content
- Creates contextual scripts for different scenarios
- Provides educational content

### OnchainKit (Base)
- Wallet integration for future features
- Base blockchain connectivity
- Decentralized identity support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Legal Disclaimer

This app provides general information about constitutional rights and is not a substitute for legal advice. Laws vary by jurisdiction and situation. Always consult with a qualified attorney for specific legal guidance.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Important**: This app is designed to help users understand their rights and stay safe during police encounters. It should be used responsibly and in accordance with local laws.
