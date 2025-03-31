# VibeCheck 🐸

A fun, shareable browser dApp where communities can create vibe profiles (as frogs), compare them with others, and receive a Lilypad-powered vibe match + suggested ways to collaborate.

## 🎯 Core MVP Functionality

- **Create a Vibe Profile (aka "your frog")**
  - Community Name, Bio, Logo Upload (optional)
  - Select 5 Vibe Tags from an expanded predefined list (including Web3 gaming and SDK categories)
  - Answer 2 reflection questions
  - Provide contact links

- **Browse + Compare ("The Pond")**
  - View all submitted frogs
  - Compare with your frog
  - Get AI-powered match results via Lilypad's phi4:14b model

- **Shareable Output**
  - Download match cards as PNG
  - Copy to clipboard
  - Share on Twitter

## 🧱 Tech Stack

- React + Next.js
- Tailwind CSS
- Framer Motion for animations
- Supabase for storage
- Lilypad Network for AI (LLM and image generation)
- html2canvas for PNG generation

## ✅ Implemented Features

- Basic functionality for creating frogs and comparing them
- Mock implementation for development without API keys
- Improved navigation with persistent header
- Enhanced loading indicators with animations
- API retry logic with exponential backoff
- Expanded vibe tag options
- Visual enhancements for share cards

## 🔜 Future Enhancements

- **Frog Editing**: Allow users to edit their frog profiles after creation
- **Dynamic Styling**: Generate custom UI themes based on each frog's visual identity
- **Improved Image Quality**: Better frog image generation with logo incorporation
- **Community Features**: Comments, reactions, and more social features
- **Analytics**: Track and display match statistics

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

## 🎨 Dynamic Styling Implementation Plan

For the dynamic styling feature, we plan to:

1. Extract primary colors from each frog's logo using a color extraction library
2. Generate a custom color palette for each frog based on their primary color
3. Apply these colors dynamically to UI elements when viewing or comparing frogs
4. Create unique visual identities that reflect each community's brand
5. Blend colors from both frogs when displaying match results

This will make the app more visually engaging and reinforce the connection between a community's brand and their frog identity.

## 🌟 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE)
