// Default frog avatars to use when a community doesn't have a custom image
export const DEFAULT_FROG_AVATARS = [
  // These are colorful, base64-encoded SVG images in data URL format
  // Each represents a different style of frog avatar
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImdyYWQxIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiIGZ4PSI1MCUiIGZ5PSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMGNjODgiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwYWE2NiIgc3RvcC1vcGFjaXR5PSIxIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIgZmlsbD0idXJsKCNncmFkMSkiIHN0cm9rZT0iIzAwODg1NSIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI4MCIgcj0iMTUiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTM1IiBjeT0iODAiIHI9IjE1IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iODAiIHI9IjUiIGZpbGw9IiMwMDAiLz48Y2lyY2xlIGN4PSIxMzUiIGN5PSI4MCIgcj0iNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik03MCwxMjAgQTQwLDQwIDAgMCwwIDEzMCwxMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=",
  
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImdyYWQxIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiIGZ4PSI1MCUiIGZ5PSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NmNjZmYiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzMzOTlmZiIgc3RvcC1vcGFjaXR5PSIxIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIgZmlsbD0idXJsKCNncmFkMSkiIHN0cm9rZT0iIzAwNjZjYyIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI4MCIgcj0iMTUiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTM1IiBjeT0iODAiIHI9IjE1IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iODAiIHI9IjUiIGZpbGw9IiMwMDAiLz48Y2lyY2xlIGN4PSIxMzUiIGN5PSI4MCIgcj0iNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik02MCwxMjUgQTUwLDUwIDAgMCwwIDE0MCwxMjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=",
  
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImdyYWQxIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiIGZ4PSI1MCUiIGZ5PSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjk5NjYiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmNjYwMCIgc3RvcC1vcGFjaXR5PSIxIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIgZmlsbD0idXJsKCNncmFkMSkiIHN0cm9rZT0iI2NjMzMwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI4MCIgcj0iMTUiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTM1IiBjeT0iODAiIHI9IjE1IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iODAiIHI9IjUiIGZpbGw9IiMwMDAiLz48Y2lyY2xlIGN4PSIxMzUiIGN5PSI4MCIgcj0iNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik03MCwxMzAgQTQwLDQwIDAgMCwxIDEzMCwxMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=",
  
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImdyYWQxIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiIGZ4PSI1MCUiIGZ5PSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNhZDhhZmYiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzljNjZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIgZmlsbD0idXJsKCNncmFkMSkiIHN0cm9rZT0iIzcwMzNmZiIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI4MCIgcj0iMTUiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTM1IiBjeT0iODAiIHI9IjE1IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iODAiIHI9IjUiIGZpbGw9IiMwMDAiLz48Y2lyY2xlIGN4PSIxMzUiIGN5PSI4MCIgcj0iNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik03MCwxMjAgQTQwLDQwIDAgMCwwIDEzMCwxMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=",
  
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImdyYWQxIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiIGZ4PSI1MCUiIGZ5PSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmQ3MDAiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmYmIwMCIgc3RvcC1vcGFjaXR5PSIxIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIgZmlsbD0idXJsKCNncmFkMSkiIHN0cm9rZT0iI2NjNzIwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI4MCIgcj0iMTUiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTM1IiBjeT0iODAiIHI9IjE1IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iODAiIHI9IjUiIGZpbGw9IiMwMDAiLz48Y2lyY2xlIGN4PSIxMzUiIGN5PSI4MCIgcj0iNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik02NSwxMDUgUTEwMCwxNDUgMTM1LDEwNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg=="
];

// Helper function to get a default frog avatar based on a string (like a name or ID)
export function getDefaultFrogAvatar(key: string): string {
  // Generate a consistent index based on the key
  const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % DEFAULT_FROG_AVATARS.length;
  return DEFAULT_FROG_AVATARS[index];
}

// Default colors for community logos
export const DEFAULT_LOGO_COLORS = [
  '#00cc88', // Teal/Green
  '#3399ff', // Blue
  '#ff6600', // Orange
  '#9c66ff', // Purple
  '#ffbb00', // Yellow
  '#ff4466', // Pink
  '#44cc44', // Green
  '#ff9966', // Coral
];

// Helper function to get a default color based on a string
export function getDefaultLogoColor(key: string): string {
  const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % DEFAULT_LOGO_COLORS.length;
  return DEFAULT_LOGO_COLORS[index];
}

// Helper to generate a more visually appealing default logo with initial
export function generateLogoSvg(name: string): string {
  const initial = name.charAt(0).toUpperCase();
  const color = getDefaultLogoColor(name);
  
  // Create an SVG with a colored background and the initial
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color}" stop-opacity="1" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0.8" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#grad)" stroke="#fff" stroke-width="2" />
      <text x="50" y="50" dy=".35em" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="45" 
        font-weight="bold" 
        fill="#ffffff">${initial}</text>
      <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" stroke-width="2" stroke-opacity="0.5" />
    </svg>
  `;
  
  // Convert to a data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
