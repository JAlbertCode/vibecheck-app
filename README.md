# VibeCheck 🐸

A fun, shareable browser dApp where communities can create vibe profiles (as frogs), compare them with others, and receive a Lilypad-powered vibe match + suggested ways to collaborate.

## 🎯 Core MVP Functionality

- ✅ **Create a Vibe Profile (aka "your frog")**
  - Community Name, Bio, Logo Upload (optional)
  - Select 5 Vibe Tags with emojis
  - Answer reflection questions to understand your community's values and preferences
  - Provide contact links (Twitter, LinkedIn, Website, and other links)

- ✅ **Browse + Compare ("The Pond")**
  - Grid view of all communities with filtering
  - View detailed information before comparing (NEW!)
  - Select your community first, then browse others
  - Multi-select capabilities for future multi-frog comparison
  - Get AI-powered match results via Lilypad's phi4:14b model

- ✅ **Shareable Output**
  - Download match cards as PNG
  - Copy to clipboard
  - Tweet your match results with percentage and dynamic emoji based on match quality

## 🧱 Tech Stack

- React + Next.js
- Tailwind CSS
- Framer Motion for animations
- Supabase for storage
- Lilypad Network for AI (LLM and image generation)
- html2canvas for PNG generation

## ✅ Implemented Features

- **Enhanced Onboarding**: Added landing page with clear explanation of how VibeCheck works
- **Improved Interface**: Better visual hierarchy and clearer user guidance throughout the app
- **Variable Match Scores**: Implemented a sophisticated algorithm that calculates meaningful match percentages
- **Community Details View**: Added ability to preview complete community profiles before matching
- **Wiki-style approach**: Anyone can create and edit community profiles
- **Streamlined user flow**: select community → browse others → compare
- **Progressive disclosure UI**: Only shows what's needed at each step
- **Reflection Question Selection**: Users can now see and choose reflection questions
- **Enhanced Community Cards**: Show all 5 tags visually rather than truncating
- **Smart Match Algorithm**: Calculates match percentage based on tag overlap, bio similarity, and reflection compatibility
- **Mock implementation**: For development without API keys
- **API retry logic**: With exponential backoff

## 🔜 To-Do Items

- **Multi-Frog Comparison**: Implement comparison of one community with multiple others
- **Advanced Search**: Implement full-text search across community profiles
- **Onboarding Improvements**: Guided tour for first-time users
- **Match History**: Save and display previous matches
- **Improved Image Quality**: Better frog image generation with logo incorporation
- **Community Features**: Upvoting successful collaborations, case studies
- **Analytics**: Track and display match statistics and collaboration successes
- **External Integrations**: Connect with Twitter/Discord for easier sharing
- **User Accounts**: Optional authentication for managing multiple communities
- **Collaborative Mode**: Allow multiple editors for a single community profile

## 🚀 Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/vibecheck-app.git
   cd vibecheck-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_LILYPAD_API_URL=https://anura-testnet.lilypad.tech/api/v1
   NEXT_PUBLIC_LILYPAD_API_KEY=your_lilypad_api_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 🏆 Recently Completed

- ✅ **Enhanced Visual Variety**: Added colorful and randomized card styles for greater visual appeal
- ✅ **Fixed Download Functionality**: Fixed image download to preserve rounded corners and styling
- ✅ **Improved Twitter Share**: Enhanced Twitter sharing with better image capabilities
- ✅ **Fixed UI Layout**: Cleaned up match percentage display for better clarity
- ✅ **Improved Mobile Responsiveness**: Better card layout for all screen sizes
- ✅ **Enhanced Match Algorithm**: Adjusted match scoring for more varied and meaningful percentages
- ✅ **Added "View Details" Button**: Users can now view full community details before running a comparison
- ✅ **Enhanced Landing Page**: New landing hero with clear explanation of VibeCheck's value
- ✅ **Fixed Tag Display**: Now properly shows all tags on community cards
- ✅ **Reflection Question Preview**: Users can now see and choose from available reflection questions
- ✅ **Intelligent Match Percentage**: Implemented sophisticated algorithm for meaningful match scores

## 🌟 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE)
