/**
 * Generates a default image for a community when no logo is provided
 * Uses the first letter of the name and a deterministic color
 */

// Cache for generated images to avoid recreating them
const imageCache: Record<string, string> = {};

export const generateDefaultImage = (name: string): string => {
  // Check cache first
  if (imageCache[name]) {
    return imageCache[name];
  }

  // Generate a deterministic color based on the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  
  // Use hash to determine a hue (0-360)
  const hue = hash % 360;
  // Use a fixed saturation and lightness for consistent appearance
  const saturation = 70;
  const lightness = 55;
  
  // Create an in-memory canvas
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    const fallback = `https://via.placeholder.com/100/${Math.floor(Math.random() * 16777215).toString(16)}/FFFFFF?text=${name.charAt(0).toUpperCase()}`;
    imageCache[name] = fallback;
    return fallback;
  }
  
  // Draw a colored circle
  ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  ctx.beginPath();
  ctx.arc(50, 50, 50, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw the first letter
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name.charAt(0).toUpperCase(), 50, 50);
  
  // Save to cache and return
  const imageUrl = canvas.toDataURL('image/png');
  imageCache[name] = imageUrl;
  return imageUrl;
};

/**
 * Get a default image for a community - handles both client and server environments
 */
export const getDefaultImage = (name: string): string => {
  // For server-side rendering where canvas isn't available
  if (typeof window === 'undefined') {
    // Use a placeholder service as fallback
    const color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    return `https://via.placeholder.com/100/${color}/FFFFFF?text=${name.charAt(0).toUpperCase()}`;
  }
  
  // For client-side, use the canvas-based generator
  return generateDefaultImage(name);
};
