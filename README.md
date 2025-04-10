# VibeCheck

A fun, shareable browser dApp where communities can create vibe profiles, compare them with others, and receive a Lilypad-powered vibe match + suggested ways to collaborate.

> **Note**: This app has been optimized and cleaned up to make it more maintainable and easier to understand. The image generation functionality has been removed since it wasn't being used.

## 🤖 Using This Project with an LLM

This project was designed to be LLM-friendly and easily customizable. Here's how you can use an LLM (like Claude, GPT, etc.) to help you adapt this project to your needs:

### 1. Key Files and Components You Can Modify

- **AI Prompt in `lilypad-jobs/vibe-compare/job.json`** - Customize the system prompt to generate different kinds of comparisons and matches
- **Match Display in `src/components/VibeMatch.tsx`** - Modify how matches are displayed and what elements are included in the match card
- **Vibe Tags in `src/utils/constants.ts`** - Change the list of available tags to match your community's categories
- **Mock Data in `src/utils/supabase.ts`** - Update the mock data to include examples relevant to your use case
- **UI Components in `src/components/`** - Customize the look and feel of the application

### 2. How to Use an LLM for Customization

Here are some prompts you can give an LLM to help modify the project:

- "Help me modify the system prompt in job.json to generate [specific type of matches]"
- "Update the VibeMatch component to include [new feature]"
- "Create a new set of tags for [your industry/community type]"
- "Generate mock data for [your type of communities]"
- "Suggest improvements to the UI for [specific audience]"

### 3. Customizing the Lilypad Integration

This project uses Lilypad's phi4:14b model, but you can easily modify it to use other models:

1. Open `src/utils/lilypad.ts`
2. Find the `compareVibes` function
3. Update the model name in the payload object
4. Adjust the prompt format and parsing as needed

### 4. Testing Your Modifications

After making changes with help from an LLM, you can test them using the mock mode:

1. Start the development server without providing a Lilypad API key
2. The app will automatically use mock data and simulate API responses
3. Check that your customized prompts, UI, and data flow work as expected

Remember that while LLMs can help you modify code, always review and test the changes to ensure they function correctly.

### 5. Forking and Deploying Your Own Version

To create your own version of this project:

1. Fork the repository on GitHub
2. Clone your fork: `git clone https://github.com/your-username/vibecheck-app.git`
3. Make your desired modifications with LLM assistance
4. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Set up the environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for storage
     - `NEXT_PUBLIC_LILYPAD_API_URL` and `NEXT_PUBLIC_LILYPAD_API_KEY` for AI
   - Deploy the application

You can run without a Lilypad API key in development for testing, but you'll need a valid key for production deployments to use the actual AI comparison functionality.

## 📚 Example LLM Prompts for Common Modifications

Here are specific examples of how to use an LLM to help you customize the project:

### Modifying the AI Prompt

```
Please help me modify the system prompt in the Lilypad job configuration found in lilypad-jobs/vibe-compare/job.json. Currently, it's set up to compare two Web3 communities, but I want to change it to compare [your use case, e.g., "tech startups", "nonprofit organizations", "academic research groups"].

Show me what changes I should make to the system prompt to make it more relevant for this use case.
```

### Creating Custom Vibe Tags

```
I'm modifying the VibeCheck app to use it for [your industry/context]. Can you help me create a new set of vibe tags that would be relevant for [industry] communities? These will replace the existing VIBE_TAGS array in src/utils/constants.ts.
```

### Customizing the Match Card Display

```
I'd like to modify how the match results are displayed in the VibeMatch.tsx component. Instead of the current format, I want to show [your desired changes, e.g., "a radar chart comparing the two profiles", "specific collaboration areas with percentage matches", "a timeline of suggested collaboration milestones"].

Can you show me what changes I need to make to the component?
```

These examples should help you get started with using LLMs to customize the project for your specific needs.

### Learn More About Lilypad

This project uses the [Lilypad Network](https://lilypad.tech) for AI inference. To learn more about Lilypad and how it provides distributed AI compute capabilities, check out their [documentation](https://docs.lilypad.tech).

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