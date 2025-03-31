/**
 * Utility for generating consistent, visually appealing default avatars 
 * based on community names
 */

// Generate a consistent color from a string
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate vibrant, saturated colors in the lily-green and pond-dark family
  const hue = Math.abs(hash) % 60 + 140; // 140-200 range to keep in blue-green spectrum
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 40 + (Math.abs(hash) % 25); // 40-65%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Generate a background gradient from a string
export function generateGradient(str: string): string {
  const baseColor = stringToColor(str);
  
  // Parse the HSL color to get components
  const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!hslMatch) return baseColor;
  
  const h = parseInt(hslMatch[1], 10);
  const s = parseInt(hslMatch[2], 10);
  const l = parseInt(hslMatch[3], 10);
  
  // Create a complementary color for gradient by shifting hue
  const h2 = (h + 30) % 360;
  const s2 = Math.min(100, s + 10);
  const l2 = Math.max(30, l - 10);
  
  const secondColor = `hsl(${h2}, ${s2}%, ${l2}%)`;
  
  return `linear-gradient(135deg, ${baseColor}, ${secondColor})`;
}

// Generate SVG data URI for default avatar
export function generateDefaultAvatar(name: string): string {
  if (!name || typeof name !== 'string') {
    name = 'Anon';
  }
  
  const initial = name.charAt(0).toUpperCase();
  const bgColor = stringToColor(name);
  
  // Create a sophisticated SVG with a gradient background and the initial
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor}" />
          <stop offset="100%" stop-color="${stringToColor(name + name)}" />
        </linearGradient>
        <mask id="mask">
          <rect width="100" height="100" fill="white" rx="50" ry="50" />
        </mask>
      </defs>
      <g mask="url(#mask)">
        <rect width="100" height="100" fill="url(#grad)" />
        <circle cx="50" cy="25" r="15" fill="rgba(255,255,255,0.25)" />
        <path d="M 30 110 Q 50 70 70 110" stroke="rgba(255,255,255,0.2)" stroke-width="5" fill="none" />
      </g>
      <text x="50" y="62" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">${initial}</text>
    </svg>
  `;
  
  // Convert SVG to a data URI
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
