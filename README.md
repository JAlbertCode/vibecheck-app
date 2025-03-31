# VibeCheck 🐸

A fun, shareable browser dApp where communities can create vibe profiles (as frogs), compare them with others, and receive a Lilypad-powered vibe match + suggested ways to collaborate.

## 🎯 Core MVP Functionality

- ✅ **Create a Vibe Profile (aka "your frog")**
  - Community Name, Bio, Logo Upload (optional)
  - Select 5 Vibe Tags with emojis
  - "Secret sauce" question to understand community's unique value
  - Provide contact links (Twitter, LinkedIn, Website, and other links)

- ✅ **Browse + Compare ("The Pond")**
  - Grid view of all communities with filtering
  - Select your community first, then browse others
  - Multi-select capabilities for future multi-frog comparison
  - Get AI-powered match results via Lilypad's phi4:14b model

- ✅ **Shareable Output**
  - Download match cards as PNG
  - Copy to clipboard
  - Tweet your match results 

## 🧱 Tech Stack

- React + Next.js
- Tailwind CSS
- Framer Motion for animations
- Supabase for storage
- Lilypad Network for AI (LLM and image generation)
- html2canvas for PNG generation

## ✅ Implemented Features

- Wiki-style approach where anyone can create and edit community profiles
- Streamlined user flow: select community → browse others → compare
- Progressive disclosure UI that only shows what's needed
- Display of both communities' logos in match card
- Focus on practical collaboration ideas between communities
- Enhanced grid-based browsing with search & tag filtering
- Improved card with community contact methods
- Shared tags visualization between communities
- Mock implementation for development without API keys
- API retry logic with exponential backoff

## 🔜 To-Do Items

- **Multi-Frog Comparison**: Implement comparison of one community with multiple others
- **Search Functionality**: Advanced search beyond filtering
- **Frog Editing**: Complete edit functionality for the wiki model
- **Improved Image Quality**: Better frog image generation with logo incorporation
- **Community Features**: Upvoting successful collaborations, case studies
- **Analytics**: Track and display match statistics and collaboration successes

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

## 🔍 Future Search Implementation

For the advanced search functionality, we plan to:

1. Implement text-based search across all profile fields
2. Add advanced filters for tag combinations, creation date, etc.
3. Create saved search functionality for frequent queries
4. Enable semantic search using embeddings for more relevant results
5. Add sorting options for search results (match potential, activity, etc.)

This will make it easier for communities to find the most relevant collaboration partners.

## 🌟 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE)
