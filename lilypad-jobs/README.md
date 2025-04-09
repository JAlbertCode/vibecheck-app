# Lilypad Integration

This directory contains configuration files for the Lilypad AI inference API that powers the community compatibility matching in VibeCheck.

## Available Jobs

### vibe-compare

This job uses the `phi4:14b` language model to analyze two community profiles and generate a compatibility assessment with the following output structure:

```json
{
  "match_score": 84,
  "summary": "Your communities would vibe at a whimsical online space for builders.",
  "possibility_spark": "Build a tool around collaborative governance.",
  "vibe_path": [
    "Invite them to co-host a Twitter Space.",
    "Write a shared blog post about your approaches.",
    "Start a joint working group on a shared challenge."
  ]
}
```

#### How to Use

In the application, the vibe comparison is handled by the `compareVibes` function in `src/utils/lilypad.ts`. This function:

1. Creates a payload with two community profiles
2. Sends the request to the Lilypad API
3. Parses the response to extract the match data
4. Handles errors and provides fallback responses if needed

The application includes a mock mode that works without a Lilypad API key. If you don't provide a valid key in your `.env.local` file, the app will automatically use realistic mock data for community comparisons.

#### Prompt Engineering

The system prompt for the vibe comparison has been carefully designed to generate:

1. Consistent and meaningful match scores (typically between 65-95)
2. Short, creative summaries with emojis
3. Specific project ideas that communities could implement together
4. A progression of steps for collaboration (from casual to deeper engagement)

Feel free to modify the prompt in `vibe-compare/job.json` to customize the output format or adjust the style of the generated suggestions.
