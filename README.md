# VibeCheck

A fun, shareable browser dApp where communities can create vibe profiles, compare them with others, and receive a Lilypad-powered vibe match + suggested ways to collaborate.

[![VibeCheck Screenshot](public/vibecheck-preview.png)](https://vibecheck-app.vercel.app/)

**[Try the live app →](https://vibecheck-app.vercel.app/)**

## 🎯 Core Features

- **Create a Vibe Profile**
  - Community Name, Bio, Logo Upload (optional)
  - Select 5 Vibe Tags
  - Answer reflection questions to understand your community's values and preferences
  - Provide contact links (Twitter, LinkedIn, Website, and other links)

- **Browse + Compare**
  - Grid view of all communities with filtering
  - View detailed information before comparing
  - Select your community first, then browse others
  - Get AI-powered match results via Lilypad's phi4:14b model

- **Shareable Output**
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

- **Enhanced Onboarding**: Clean landing page with clear explanation of how VibeCheck works
- **Improved Interface**: Better visual hierarchy and clearer user guidance throughout the app
- **Variable Match Scores**: Sophisticated algorithm that calculates meaningful match percentages
- **Community Details View**: Preview complete community profiles before matching
- **Wiki-style approach**: Anyone can create and edit community profiles
- **Streamlined user flow**: select community → browse others → compare
- **Progressive disclosure UI**: Only shows what's needed at each step
- **Reflection Question Selection**: Users can see and choose reflection questions
- **Enhanced Community Cards**: Shows all 5 tags visually rather than truncating
- **Smart Match Algorithm**: Calculates match percentage based on tag overlap, bio similarity, and reflection compatibility
- **Mock implementation**: For development without API keys
- **API retry logic**: With exponential backoff

## 📁 Project Structure

This project is organized to be modular and easy to understand:

```
vibecheck-app/
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── FrogCard.tsx       # Community card component
│   │   ├── FrogDetails.tsx    # Detailed view of community
│   │   ├── FrogForm.tsx       # Form for creating/editing communities
│   │   ├── FrogGrid.tsx       # Grid of community cards
│   │   ├── FrogSelection.tsx  # Selection component for your community
│   │   ├── Header.tsx         # App header
│   │   ├── LandingHero.tsx    # Landing page hero section
│   │   └── VibeMatch.tsx      # Match results display
│   ├── pages/          # Next.js pages
│   │   ├── index.tsx          # Main app page
│   │   └── _app.tsx           # App wrapper
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
│       ├── avatarGenerator.ts  # Generate default avatars
│       ├── constants.ts        # App constants like vibe tags
│       ├── defaultImages.ts    # Default image generation
│       ├── lilypad.ts          # Lilypad API integration
│       ├── placeholderUtils.ts # Placeholder utilities
│       └── supabase.ts         # Supabase database integration
└── lilypad-jobs/      # Lilypad job configurations
    └── vibe-compare/   # Vibe comparison job
        └── job.json    # Job configuration
```

### Key Development Information

#### Lilypad Integration

The core of this application is the AI-powered vibe comparison, which uses the Lilypad Network. The integration is primarily handled in `src/utils/lilypad.ts`. The main function is `compareVibes`, which takes two community profiles and returns a compatibility assessment.

The comparison is performed using the `phi4:14b` language model, configured in `lilypad-jobs/vibe-compare/job.json`. This file contains the system prompt that guides the AI in generating meaningful comparisons.

#### Mock Mode

One of the most useful features for development is the built-in mock mode. When no valid Lilypad API key is provided in the environment variables, the app automatically switches to mock mode, which:

1. Uses predefined mock data for communities
2. Simulates API responses with realistic match data
3. Calculates actual similarity metrics between communities

This allows you to develop and test without needing actual API credentials. The mock implementation is in `src/utils/lilypad.ts` and `src/utils/supabase.ts`.

#### Responsive Design

The app is fully responsive and works well on mobile, tablet, and desktop screens. The UI components use Tailwind CSS for styling, with some Framer Motion animations for enhanced UX.

#### State Management

The app uses React's built-in state management with useState and useEffect hooks, without external state management libraries. The main state is managed in the index.tsx page component, which serves as the central orchestrator for the application flow.

#### Repurposing for Different Industries or Use Cases

To repurpose this project for a different industry or use case:

1. **Modify the vibe tags** in `src/utils/constants.ts` to match your domain
2. **Update the system prompt** in `lilypad-jobs/vibe-compare/job.json` to generate matches relevant to your use case
3. **Customize the UI components** in the `src/components` directory, particularly:
   - `FrogCard.tsx` - Rename and redesign to represent your domain entities
   - `VibeMatch.tsx` - Modify to display matches in a way that makes sense for your use case
4. **Adjust the mock data** in `src/utils/supabase.ts` to include examples from your domain

The entire codebase uses the term "frog" as a legacy from the original theme. You may want to find and replace this term with something more relevant to your domain (like "company", "team", "project", etc.) for clarity.

#### Data Flow

Understanding the data flow helps when modifying the app:

1. **User creates/selects their profile** → Stored in Supabase → Local state management in `index.tsx` (`myFrog` state)
2. **User browses other profiles** → Loaded from Supabase → Displayed in `FrogGrid.tsx`
3. **User selects a profile to compare** → `compareVibes` function in `lilypad.ts` is called → Lilypad API processes the match
4. **Match results received** → Displayed in `VibeMatch.tsx` → User can share/download results

This flow can be customized at any point to add additional steps or modify the behavior.

#### Deployment

The app is configured for easy deployment on Vercel:

1. Fork or clone the repository to your GitHub account
2. Connect the repository to Vercel
3. Set up the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for storage
   - `NEXT_PUBLIC_LILYPAD_API_URL` and `NEXT_PUBLIC_LILYPAD_API_KEY` for AI
4. Deploy the application

The production build is automatically optimized for performance.

#### Advanced Customization Tips

- **Changing the AI Model**: The project uses Lilypad's phi4:14b model, but you can use any model supported by the Lilypad API by modifying the model name in the `compareVibes` function in `lilypad.ts`
- **Adding Authentication**: The current app uses wiki-style open editing, but you could add authentication using Supabase's built-in auth services
- **Adding More AI Features**: Beyond just comparing profiles, you could add additional AI-powered features like content generation or recommendations by creating new job configurations in the `lilypad-jobs` directory
- **Custom Theming**: The app uses Tailwind CSS, which makes it easy to customize the look and feel by modifying the `tailwind.config.js` file

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

## 🧰 Troubleshooting

Here are solutions to common issues developers might encounter:

### API Connection Issues

- **Lilypad API errors**: If you encounter errors with the Lilypad API, check your API key in the `.env.local` file. Remember that the app works in mock mode without an API key.
- **Supabase connection issues**: Verify your Supabase URL and key. In development, the app can function with mock data even without a Supabase connection.

### Development Problems

- **Next.js build errors**: If you encounter build errors after making changes, check the console for specific error messages. Most commonly these occur in the components that have been modified.
- **Style issues**: If Tailwind styles aren't applying correctly, make sure you're using the proper class names and that you haven't modified the Tailwind configuration accidentally.
- **Component state issues**: If the app flow isn't working as expected, check the state management in `index.tsx`, which orchestrates the flow between different screens.

### Deployment Problems

- **Vercel deployment failures**: Ensure all environment variables are correctly set in your Vercel project settings.
- **Missing images or resources**: Check that all assets are properly included in the `public` directory.
- **API connection in production**: Verify that your production API keys have the correct permissions and rate limits.

## 🔜 Possible Enhancements

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

## 🤖 Using This Project with an LLM

This project was designed to be LLM-friendly and easily customizable. Here's how you can use an LLM (like Claude, GPT, etc.) to help you adapt this project to your needs:

### Key Files and Components You Can Modify

- **AI Prompt in `lilypad-jobs/vibe-compare/job.json`** - Customize the system prompt to generate different kinds of comparisons and matches
- **Match Display in `src/components/VibeMatch.tsx`** - Modify how matches are displayed and what elements are included in the match card
- **Vibe Tags in `src/utils/constants.ts`** - Change the list of available tags to match your community's categories
- **Mock Data in `src/utils/supabase.ts`** - Update the mock data to include examples relevant to your use case
- **UI Components in `src/components/`** - Customize the look and feel of the application

### Example LLM Prompts for Customization

Here are some prompts you can give an LLM to help modify the project:

```
Please help me modify the system prompt in lilypad-jobs/vibe-compare/job.json. 
Currently, it's set up to compare Web3 communities, but I want to change it to 
compare [your use case, e.g., "tech startups", "nonprofit organizations", etc].
```

```
I'm modifying the VibeCheck app for [your industry]. Can you help me create 
vibe tags relevant for [industry] communities to replace the existing VIBE_TAGS 
array in src/utils/constants.ts?
```

```
I'd like to modify how match results are displayed in VibeMatch.tsx. Instead of 
the current format, I want to show [your desired changes, e.g., "a radar chart", 
"specific collaboration areas", etc].
```

### Customizing the Lilypad Integration

This project uses Lilypad's phi4:14b model, but you can easily modify it to use other models:

1. Open `src/utils/lilypad.ts`
2. Find the `compareVibes` function
3. Update the model name in the payload object
4. Adjust the prompt format and parsing as needed

You can learn more about Lilypad at their [documentation site](https://docs.lilypad.tech).

## 🌟 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE)