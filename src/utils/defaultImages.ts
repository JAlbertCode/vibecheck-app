/**
 * Generates a default image for a community when no logo is provided
 * Uses the first letter of the name and a gradient that matches the site header
 */

// Cache for generated images to avoid recreating them
const imageCache: Record<string, string> = {};

export const generateDefaultImage = (name: string): string => {
  // Check cache first
  if (imageCache[name]) {
    return imageCache[name];
  }

  // Generate a deterministic hash based on the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  
  // Define colors from the header gradient (from-pink-400 via-purple-300 to-pink-300)
  const colorStart = '#F472B6'; // pink-400
  const colorMiddle = '#D8B4FE'; // purple-300
  const colorEnd = '#F9A8D4';   // pink-300
  
  // Create an in-memory canvas
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    const fallback = `https://via.placeholder.com/100/f472b6/FFFFFF?text=${name.charAt(0).toUpperCase()}`;
    imageCache[name] = fallback;
    return fallback;
  }
  
  // Create a circular clip path
  ctx.beginPath();
  ctx.arc(50, 50, 50, 0, Math.PI * 2);
  ctx.clip();
  
  // Use the hash to slightly rotate the gradient direction for variety
  const rotation = (hash % 60) - 30; // -30 to +30 degrees
  const angleRad = (rotation * Math.PI) / 180;
  
  // Calculate gradient start and end points based on rotation
  const gradientLength = 140; // Slightly longer than diameter for full coverage
  const centerX = 50;
  const centerY = 50;
  const startX = centerX - Math.cos(angleRad) * (gradientLength / 2);
  const startY = centerY - Math.sin(angleRad) * (gradientLength / 2);
  const endX = centerX + Math.cos(angleRad) * (gradientLength / 2);
  const endY = centerY + Math.sin(angleRad) * (gradientLength / 2);
  
  // Create gradient matching the header's gradient
  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(0.5, colorMiddle);
  gradient.addColorStop(1, colorEnd);
  
  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 100, 100);
  
  // Add subtle light effect at top-left corner for dimension
  ctx.globalCompositeOperation = 'lighter';
  const shine = ctx.createRadialGradient(35, 35, 0, 35, 35, 60);
  shine.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  shine.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
  shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, 100, 100);
  ctx.globalCompositeOperation = 'source-over';
  
  // Draw letter with subtle shadow for better readability
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name.charAt(0).toUpperCase(), 50, 48);
  
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
    // Use header colors for consistency
    const headerColors = ['f472b6', 'd8b4fe', 'f9a8d4'];
    
    // Create a deterministic hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
    }
    const index = Math.abs(hash) % headerColors.length;
    return `https://via.placeholder.com/100/${headerColors[index]}/FFFFFF?text=${name.charAt(0).toUpperCase()}`;
  }
  
  // For client-side, use the canvas-based generator
  return generateDefaultImage(name);
};