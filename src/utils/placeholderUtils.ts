/**
 * Utility functions for generating placeholder images
 */

// Color palette for brand-consistent placeholders
export const PALETTE = {
  primary: ['#00cc88', '#00b377', '#009966', '#008055', '#006644'], // Green shades
  secondary: ['#4158D0', '#3A4EC0', '#3344B0', '#2C3AA0', '#253090'], // Blue shades
  accent: ['#FFCC33', '#FFB800', '#FFA500', '#FF9200', '#FF8000']     // Gold/orange shades
};

/**
 * Generates a deterministic color from a string (like a name)
 * @param text Input string to derive color from
 * @param palette Color palette to use
 * @returns HEX color code
 */
export function getColorFromText(text: string, palette = PALETTE.primary): string {
  // Create a simple hash from the text
  const hash = text.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Use the hash to deterministically select a color
  return palette[hash % palette.length];
}

/**
 * Create a canvas-based identicon/placeholder for a community
 * @param name Community name
 * @param size Canvas size
 * @returns DataURL string containing image data
 */
export function createFrogPlaceholder(name: string, size = 200): string {
  // Create a canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Background
  const bgColor = getColorFromText(name);
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Get initials (up to 2 characters)
  let initials = name.charAt(0).toUpperCase();
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  
  // Add subtle pattern based on name
  const patternHash = name.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
  const patternType = patternHash % 5; // 5 different pattern types
  
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#ffffff';
  
  // Draw different pattern based on hash
  switch (patternType) {
    case 0: // Dots
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if ((i + j) % 2 === 0) {
            ctx.beginPath();
            ctx.arc(i * size/8 + size/16, j * size/8 + size/16, size/32, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      break;
    case 1: // Stripes
      for (let i = 0; i < size; i += size/10) {
        ctx.fillRect(i, 0, size/20, size);
      }
      break;
    case 2: // Circles
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2 - (i * size/6), 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case 3: // Cross pattern
      for (let i = 0; i < size; i += size/8) {
        ctx.fillRect(0, i, size, size/16);
        ctx.fillRect(i, 0, size/16, size);
      }
      break;
    case 4: // Triangles
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(size/2, size/2);
        const angle = (Math.PI * 2 / 6) * i;
        ctx.lineTo(size/2 + Math.cos(angle) * size/2, size/2 + Math.sin(angle) * size/2);
        const nextAngle = (Math.PI * 2 / 6) * ((i + 1) % 6);
        ctx.lineTo(size/2 + Math.cos(nextAngle) * size/2, size/2 + Math.sin(nextAngle) * size/2);
        ctx.closePath();
        if (i % 2 === 0) ctx.fill();
      }
      break;
  }
  
  // Reset alpha
  ctx.globalAlpha = 1.0;
  
  // Add a subtle frog outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  
  // Simple frog silhouette
  drawSimpleFrogSilhouette(ctx, size);
  
  // Text overlay with initials
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size/3}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size/2, size/2);
  
  // Convert to data URL
  return canvas.toDataURL('image/png');
}

/**
 * Create a logo placeholder for communities without logos
 */
export function createLogoPlaceholder(name: string, size = 100): string {
  // Create a canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Get first letter (or first two letters if two-word name)
  let letters = name.charAt(0).toUpperCase();
  const words = name.split(/\s+/);
  if (words.length > 1) {
    letters = words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  } else if (name.length > 1) {
    // For single word names, use first two letters if it's one word
    letters = name.substring(0, 2).toUpperCase();
  }
  
  // Background
  const bgColor = getColorFromText(name);
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Add a subtle pattern
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#ffffff';
  
  // Create a pattern based on name hash
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const patternType = nameHash % 3;
  
  switch (patternType) {
    case 0: // Grid
      for (let i = 0; i < size; i += size/10) {
        ctx.fillRect(0, i, size, 1);
        ctx.fillRect(i, 0, 1, size);
      }
      break;
    case 1: // Radiating circles
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(size/2, size/2, (size/2) * (i/4), 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case 2: // Diagonal lines
      for (let i = -size; i < size*2; i += size/8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
      }
      break;
  }
  
  // Reset alpha
  ctx.globalAlpha = 1.0;
  
  // Text overlay
  ctx.fillStyle = 'white';
  // Adjust font size based on letters length
  const fontSize = letters.length > 1 ? size/3 : size/2; 
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letters, size/2, size/2);
  
  // Convert to data URL
  return canvas.toDataURL('image/png');
}

/**
 * Draw a simple frog silhouette on the canvas
 */
function drawSimpleFrogSilhouette(ctx: CanvasRenderingContext2D, size: number): void {
  const centerX = size / 2;
  const centerY = size / 2;
  const scaleFactor = size / 200; // Based on a 200px reference design
  
  ctx.save();
  
  // Head
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.4, 0, Math.PI * 2);
  ctx.stroke();
  
  // Eyes (just circles)
  const eyeRadius = size * 0.08;
  const eyeOffsetX = size * 0.15;
  const eyeOffsetY = size * -0.1;
  
  ctx.beginPath();
  ctx.arc(centerX - eyeOffsetX, centerY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX + eyeOffsetX, centerY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Mouth (simple curve)
  ctx.beginPath();
  ctx.arc(centerX, centerY + size * 0.15, size * 0.2, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();
  
  ctx.restore();
}
