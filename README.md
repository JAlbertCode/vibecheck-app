# VibeCheck

A fun, shareable browser dApp where communities can create vibe profiles, compare them with others, and receive a Lilypad-powered vibe match + suggested ways to collaborate.

> **Note**: This app has been optimized and cleaned up to make it more maintainable and easier to understand. The image generation functionality has been removed since it wasn't being used.

## 🎯 Core MVP Functionality

- ✅ **Create a Vibe Profile**
  - Community Name, Bio, Logo Upload (optional)
  - Select 5 Vibe Tags
  - Answer reflection questions to understand your community's values and preferences
  - Provide contact links (Twitter, LinkedIn, Website, and other links)

- ✅ **Browse + Compare**
  - Grid view of all communities with filtering
  - View detailed information before comparing
  - Select your community first, then browse others
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
- Lilypad Network for AI (LLM comparisons using phi4:14b)
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

- **Multi-Community Comparison**: Implement comparison of one community with multiple others
- **Advanced Search**: Implement full-text search across community profiles
- **Onboarding Improvements**: Guided tour for first-time users
- **Match History**: Save and display previous matches
- **Improved Community Cards**: Better visual representation of communities
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
   
   > **Note**: The app includes a mock mode that works without a Lilypad API key. If you don't provide a valid key, the app will automatically use realistic mock data for community comparisons.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Recent Updates

Our latest improvements have focused on streamlining the UI and enhancing the user experience:

- Redesigned the interface to focus on communities rather than the previous frog theme
- Simplified the user flow by focusing on single community selection for the MVP
- Enhanced visual design with improved card styling and consistent color scheme
- Fixed navigation issues throughout the application
- Improved loading indicators to match the overall design aesthetic
- Created a more intuitive search and filtering experience

These changes create a more focused MVP that delivers the core value proposition - matching communities based on their vibes - in a clean, modern interface.

## 🌟 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE)