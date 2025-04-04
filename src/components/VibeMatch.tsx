import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import type { Frog, VibeMatch as VibeMatchType } from '../utils/supabase';
import { toPng } from 'html-to-image';

// Helper function to ensure stable image capture
const captureElement = async (element: HTMLElement) => {
  await document.fonts.ready;
  element.classList.add('vibe-export', 'html2canvas-element');
  try {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      scale: 3,
      logging: false,
      onclone: (clonedDoc) => {
        const cloned = clonedDoc.querySelector('[data-match-card]');
        if (cloned) {
          cloned.classList.add('html2canvas-element');
        }
      }
    });
    return canvas;
  } finally {
    element.classList.remove('vibe-export', 'html2canvas-element');
  }
};


interface VibeMatchProps {
  myFrog: Frog;
  otherFrog: Frog;
  match: VibeMatchType;
}

export default function VibeMatch({ myFrog, otherFrog, match }: VibeMatchProps) {
  const matchCardRef = useRef<HTMLDivElement>(null);
  
  // State for team colors and visual elements
  const [myLogoColor, setMyLogoColor] = useState<string>('#10b981');
  const [otherLogoColor, setOtherLogoColor] = useState<string>('#0ea5e9');
  
  // Website color scheme to ensure consistency
  const siteColors = {
    primary: '#10b981', // Main green from Lilypad
    secondary: '#0ea5e9', // Secondary blue
    accent1: '#f59e0b', // Amber accent
    accent2: '#8b5cf6', // Purple accent
    dark: '#334155', // Slate dark
    light: '#f8fafc' // Slate light
  };

  // Random vibrant colors from Lilypad's palette for visual variety
  const vibrantColors = [
    siteColors.primary,
    siteColors.secondary,
    siteColors.accent1,
    siteColors.accent2,
    '#ef4444', // Red
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#14b8a6', // Teal
  ];

  useEffect(() => {
    // Generate random colors for variety if we're not extracting them from logos
    const randomColor1 = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    const randomColor2 = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    
    setMyLogoColor(randomColor1);
    setOtherLogoColor(randomColor2);
    
    // Force re-render to ensure proper html2canvas capture
    const timer = setTimeout(() => {
      if (matchCardRef.current) {
        const parent = matchCardRef.current.parentElement;
        if (parent) {
          // This causes a re-flow which often helps html2canvas capture properly
          parent.style.display = 'none';
          setTimeout(() => {
            if (parent) parent.style.display = '';
          }, 10);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleShareOnTwitter = async () => {
    await handleDownload(); // reuse the working image export
  
    const matchQuality =
      match.match_score >= 85 ? '🔥 Perfect Match' :
      match.match_score >= 70 ? '✨ Strong Alignment' :
      match.match_score >= 50 ? '👍 Good Vibes' : '🌱 Growing Potential';
  
    const text = `${myFrog.name} × ${otherFrog.name} - ${matchQuality}! Check out our collab potential on @Lilypad_Tech #VibeCheck`;
    const url = 'https://vibecheck.lilypad.tech';
  
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };
  
  
  
  
  
  
  
  
  
  // Helper function to show image preview with Twitter link
  const showPreviewDialog = (canvas: HTMLCanvasElement, text: string, url: string) => {
    try {
      const blobUrl = canvas.toDataURL('image/png');
      const img = document.createElement('img');
      img.src = blobUrl;
      
      // Create popup with image preview
      const popup = document.createElement('div');
      popup.style.position = 'fixed';
      popup.style.top = '0';
      popup.style.left = '0';
      popup.style.width = '100%';
      popup.style.height = '100%';
      popup.style.backgroundColor = 'rgba(0,0,0,0.8)';
      popup.style.zIndex = '10000';
      popup.style.display = 'flex';
      popup.style.flexDirection = 'column';
      popup.style.alignItems = 'center';
      popup.style.justifyContent = 'center';
      popup.style.padding = '20px';
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '20px';
      closeBtn.style.right = '20px';
      closeBtn.style.padding = '8px 16px';
      closeBtn.style.backgroundColor = siteColors.primary;
      closeBtn.style.color = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '4px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.onclick = () => {
        document.body.removeChild(popup);
      };
      
      // Add image preview
      img.style.maxWidth = '80%';
      img.style.maxHeight = '60%';
      img.style.borderRadius = '8px';
      img.style.marginBottom = '20px';
      
      // Add twitter share link
      const twitterLink = document.createElement('a');
      twitterLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      twitterLink.target = '_blank';
      twitterLink.style.display = 'inline-block';
      twitterLink.style.padding = '10px 20px';
      twitterLink.style.backgroundColor = '#1DA1F2';
      twitterLink.style.color = 'white';
      twitterLink.style.borderRadius = '4px';
      twitterLink.style.textDecoration = 'none';
      twitterLink.style.fontWeight = 'bold';
      twitterLink.innerHTML = '🐦 Share on Twitter';
      
      // Add save image link
      const saveLink = document.createElement('a');
      saveLink.href = canvas.toDataURL('image/png');
      saveLink.download = `vibecheck-${myFrog.name}-${otherFrog.name}.png`;
      saveLink.style.display = 'inline-block';
      saveLink.style.padding = '10px 20px';
      saveLink.style.backgroundColor = siteColors.primary;
      saveLink.style.color = 'white';
      saveLink.style.borderRadius = '4px';
      saveLink.style.textDecoration = 'none';
      saveLink.style.fontWeight = 'bold';
      saveLink.style.marginRight = '10px';
      saveLink.innerHTML = '💾 Save Image';
      
      // Add message
      const message = document.createElement('p');
      message.textContent = 'Save the image and share it with your tweet for better engagement!';
      message.style.color = 'white';
      message.style.marginBottom = '20px';
      
      // Add controls div
      const controls = document.createElement('div');
      controls.style.display = 'flex';
      controls.style.gap = '10px';
      controls.appendChild(saveLink);
      controls.appendChild(twitterLink);
      
      // Assemble popup
      popup.appendChild(closeBtn);
      popup.appendChild(img);
      popup.appendChild(message);
      popup.appendChild(controls);
      
      // Add to body
      document.body.appendChild(popup);
    } catch (error) {
      console.error('Error creating image preview:', error);
      shareTextOnly();
    }
  };
  
  
  // Fallback to text-only Twitter sharing
  const shareTextOnly = () => {
    let matchQuality = '';
    if (match.match_score >= 85) matchQuality = '🔥 Perfect Match';
    else if (match.match_score >= 70) matchQuality = '✨ Strong Alignment';
    else if (match.match_score >= 50) matchQuality = '👍 Good Vibes';
    else matchQuality = '🌱 Growing Potential';
    
    const text = `${myFrog.name} × ${otherFrog.name} - ${matchQuality}! Check out our collab potential on @Lilypad_Tech #VibeCheck`;
    const url = 'https://vibecheck.lilypad.tech';
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const handleDownload = async () => {
    if (!matchCardRef.current) return;
  
    const element = matchCardRef.current;
  
    // Temporarily override styles that affect layout during capture
    const originalMargin = element.style.margin;
    const originalTransform = element.style.transform;
    const originalPosition = element.style.position;
    element.style.margin = '0';
    element.style.transform = 'translateX(0)';
    element.style.position = 'static';
  
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 300));
  
      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
  
      const anchor = document.createElement('a');
      anchor.href = dataUrl;
      anchor.download = `vibecheck-${myFrog.name}-${otherFrog.name}.png`;
      anchor.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download match card. Please try again.');
    } finally {
      element.style.margin = originalMargin;
      element.style.transform = originalTransform;
      element.style.position = originalPosition;
    }
  };
  
  

  const handleCopyToClipboard = async () => {
    if (!matchCardRef.current) return;
  
    const element = matchCardRef.current;
  
    const originalMargin = element.style.margin;
    const originalTransform = element.style.transform;
    const originalPosition = element.style.position;
    element.style.margin = '0';
    element.style.transform = 'translateX(0)';
    element.style.position = 'static';
  
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 300));
  
      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
  
      const blob = await (await fetch(dataUrl)).blob();
  
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
  
      const notification = document.createElement('div');
      notification.textContent = '✅ Copied to clipboard!';
      Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#10b981',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '20px',
        zIndex: 1000,
      });
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    } catch (error) {
      console.error('Clipboard error:', error);
      alert('Failed to copy to clipboard. Try downloading instead.');
    } finally {
      element.style.margin = originalMargin;
      element.style.transform = originalTransform;
      element.style.position = originalPosition;
    }
  };
  
  

  // Format contact links for display
  const getContactLink = (frog: Frog, type: string) => {
    const link = frog.contact_links[type];
    if (!link) return null;
    
    let icon = '🔗';
    let label = type.charAt(0).toUpperCase() + type.slice(1);
    
    if (type === 'twitter') icon = '🐦';
    if (type === 'linkedin') icon = '💼';
    if (type === 'email') icon = '📧';
    if (type === 'site') {
      icon = '🌐';
      label = 'Website';
    }
    if (type.startsWith('other_')) {
      icon = '🔗';
      label = 'Link';
    }
    
    return { icon, label, link };
  };

  const myContactLinks = Object.keys(myFrog.contact_links)
    .map(key => getContactLink(myFrog, key))
    .filter(link => link !== null);
    
  const otherContactLinks = Object.keys(otherFrog.contact_links)
    .map(key => getContactLink(otherFrog, key))
    .filter(link => link !== null);
    
  // Get shared tags between both frogs
  const sharedTagsSet = new Set([...myFrog.tags, ...otherFrog.tags]);
  const sharedTags = Array.from(sharedTagsSet).slice(0, 5);
  
  // Get brand theme with vibrant colors
  const getBrandTheme = () => {
    const primary = myLogoColor;
    const secondary = otherLogoColor;
    
    // Add pattern elements based on colors
    const pattern1 = `radial-gradient(circle at 15% 15%, ${primary}15, transparent 40%)`;
    const pattern2 = `radial-gradient(circle at 85% 85%, ${secondary}15, transparent 40%)`;
    
    return {
      primaryColor: primary,
      secondaryColor: secondary,
      pattern1,
      pattern2,
      cardStyle: {
        background: `linear-gradient(135deg, white 30%, ${primary}08 70%, ${secondary}08 100%)`,
        borderColor: `${primary}60`,
        boxShadow: `0 4px 6px -1px ${primary}20, 0 2px 4px -1px ${secondary}20`,
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden'
      }
    };
  };
  
  const brandTheme = getBrandTheme();
  
  // For logo styling
  const logoSize = "w-12 h-12 md:w-14 md:h-14";

  // This function is called when copying/sharing to ensure consistent positioning of all elements
  const fixAllPositions = () => {
    if (!matchCardRef.current) return;
    const container = matchCardRef.current;
    
    // Force a repaint before capturing
    requestAnimationFrame(() => {
      // Fix all text elements
      const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a');
      textElements.forEach(el => {
        if (el instanceof HTMLElement) {
          // Store computed styles to make them explicit
          const computedStyle = window.getComputedStyle(el);
          el.style.lineHeight = computedStyle.lineHeight;
          el.style.fontSize = computedStyle.fontSize;
          el.style.fontWeight = computedStyle.fontWeight;
          el.style.display = 'inline-block';
          el.style.textAlign = computedStyle.textAlign;
          el.style.verticalAlign = 'middle';
          el.style.position = 'static';
          el.style.transform = 'none';
        }
      });
      
      // Fix all flex container elements
      const flexContainers = container.querySelectorAll('.flex, [style*="display: flex"]');
      flexContainers.forEach(el => {
        if (el instanceof HTMLElement) {
          // Make sure flex doesn't cause text to shift
          el.style.minHeight = `${el.offsetHeight}px`;
          el.style.minWidth = `${el.offsetWidth}px`;
          el.style.display = 'block';
          el.style.position = 'static';
        }
      });
      
      // Fix absolute positioned elements
      const absoluteElements = container.querySelectorAll('[style*="position: absolute"], [class*="absolute"]');
      absoluteElements.forEach(el => {
        if (el instanceof HTMLElement) {
          // Get current position
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Make position explicit
          el.style.position = 'absolute';
          el.style.top = `${rect.top - containerRect.top}px`;
          el.style.left = `${rect.left - containerRect.left}px`;
          el.style.width = `${rect.width}px`;
          el.style.height = `${rect.height}px`;
        }
      });
    });
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Match Card (for download/sharing) */}
      <div 
        ref={matchCardRef} 
        data-match-card
        className="p-6 border-2 overflow-hidden relative max-w-xl mx-auto shadow-lg"
        style={{
          ...brandTheme.cardStyle as React.CSSProperties,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'auto',
          height: 'auto',
          paddingTop: '20px',
          paddingBottom: '60px',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" 
             style={{backgroundImage: `${brandTheme.pattern1}, ${brandTheme.pattern2}`}}>
          <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full" 
               style={{backgroundColor: `${brandTheme.primaryColor}`, opacity: 0.1}}></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full" 
               style={{backgroundColor: `${brandTheme.secondaryColor}`, opacity: 0.1}}></div>
        </div>
        
        {/* Header with company logos and match visualization */}
        <div className="flex flex-col items-center text-center mb-2">
          <div className="flex items-center gap-3 mb-3">
          <div className={`${logoSize} rounded-full overflow-hidden gradient-bg shadow flex items-center justify-center`}
                 style={{border: `2px solid ${brandTheme.primaryColor}`}}>
              <img 
                src={myFrog.logo_url} 
                alt={`${myFrog.name} logo`} 
                className="object-contain w-full h-full"
                onError={(e) => {
                  // Create a canvas-based fallback image
                  const canvas = document.createElement('canvas');
                  canvas.width = 100;
                  canvas.height = 100;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.fillStyle = brandTheme.primaryColor;
                    ctx.beginPath();
                    ctx.arc(50, 50, 50, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(myFrog.name.charAt(0).toUpperCase(), 50, 50);
                    (e.target as HTMLImageElement).src = canvas.toDataURL();
                  }
                }}
              />
            </div>
            
            <div className="flex items-center justify-center">
            <div className="text-lg font-semibold px-5 py-2 rounded-full" 
            style={{backgroundColor: `${brandTheme.secondaryColor}20`, 
            color: brandTheme.secondaryColor,
                       whiteSpace: 'nowrap'}}>
            {match.match_score >= 85 ? '🔥 Perfect Match' : 
            match.match_score >= 70 ? '✨ Strong Alignment' : 
            match.match_score >= 50 ? '👍 Good Vibes' : 
               '🌱 Growing Potential'}
              </div>
          </div>
            
          <div className={`${logoSize} rounded-full overflow-hidden gradient-bg shadow flex items-center justify-center`}
                 style={{border: `2px solid ${brandTheme.secondaryColor}`}}>
              <img 
                src={otherFrog.logo_url} 
                alt={`${otherFrog.name} logo`} 
                className="object-contain w-full h-full"
                onError={(e) => {
                  // Create a canvas-based fallback image
                  const canvas = document.createElement('canvas');
                  canvas.width = 100;
                  canvas.height = 100;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.fillStyle = brandTheme.secondaryColor;
                    ctx.beginPath();
                    ctx.arc(50, 50, 50, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(otherFrog.name.charAt(0).toUpperCase(), 50, 50);
                    (e.target as HTMLImageElement).src = canvas.toDataURL();
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center text-gray-800">
            <span className="font-medium text-lg">{myFrog.name}</span>
            <span className="mx-2 text-gray-400">+</span>
            <span className="font-medium text-lg">{otherFrog.name}</span>
          </div>
          
          <div className="mt-3 rounded-xl py-2 px-5 inline-block shadow-sm"
               style={{background: `linear-gradient(to right, ${brandTheme.primaryColor}30, ${brandTheme.secondaryColor}30)`,
                      border: `1px solid ${brandTheme.primaryColor}50`}}>
            <span className="text-lg font-medium text-gray-800 flex items-center justify-center">
              <span className="mr-2">
                {match.match_score >= 85 ? '🔥' : match.match_score >= 75 ? '✨' : match.match_score >= 65 ? '👍' : '🌱'}
              </span>
              {match.summary || "Open Worlds Uniting"}
            </span>
          </div>
          
          {/* Shared Tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-5 mb-4 px-2 min-h-[32px]">
            {sharedTags.map((tag, i) => (
              <span key={i} className="tag-sm">
                {tag}
              </span>
            ))}
          </div>

        </div>
        
        {/* Content */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm" 
             style={{border: `1px solid ${brandTheme.primaryColor}30`}}>
          <h3 className="text-md font-semibold text-gray-800 flex items-center mb-2">
            <span className="text-xl mr-2">✨</span>
            Possibility Spark
          </h3>
          <p className="text-gray-700">{match.possibility_spark || match.collab_idea}</p>
        </div>
          
        <div className="mt-3 bg-white rounded-xl p-4 shadow-sm relative overflow-hidden" 
             style={{border: `1px solid ${brandTheme.secondaryColor}30`}}>
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full" 
               style={{backgroundColor: brandTheme.secondaryColor, opacity: 0.1}}></div>
          
          <h3 className="text-md font-semibold text-gray-800 flex items-center mb-3">
            <span className="text-xl mr-2">👋</span>
            <span>Next Step On The Lilypad</span>
          </h3>
          
          <div className="relative p-3 rounded-lg mb-4" 
               style={{backgroundColor: `${brandTheme.primaryColor}10`, 
                      backgroundImage: brandTheme.pattern1}}>
            <p className="text-gray-700 italic relative z-10">
              "{match.vibe_path && match.vibe_path[0] || match.connect_tip || match.first_connect}"
            </p>
            <div className="absolute top-2 left-2 transform -rotate-6 text-2xl opacity-10">"</div>
            <div className="absolute bottom-2 right-2 transform rotate-6 text-2xl opacity-10">"</div>
          </div>
          
          {/* Contact info section will start here - removed path steps */}
          
          {/* Contact Info */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Connect with:</h4>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <div className="flex-1 p-3 rounded-lg" 
                   style={{backgroundColor: `${brandTheme.primaryColor}10`}}>
                <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center mr-2 shadow-sm"
                        style={{backgroundColor: `${brandTheme.primaryColor}20`}}>                 
                    <img 
                      src={myFrog.logo_url} 
                      alt=""
                      className="w-4 h-4 object-cover"
                      onError={(e) => {
                        // Create a canvas-based fallback image
                        const canvas = document.createElement('canvas');
                        canvas.width = 100;
                        canvas.height = 100;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.fillStyle = brandTheme.primaryColor;
                          ctx.beginPath();
                          ctx.arc(50, 50, 50, 0, Math.PI * 2);
                          ctx.fill();
                          ctx.fillStyle = '#ffffff';
                          ctx.font = 'bold 40px Arial';
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';
                          ctx.fillText(myFrog.name.charAt(0).toUpperCase(), 50, 50);
                          (e.target as HTMLImageElement).src = canvas.toDataURL();
                        }
                      }}
                    />
                  </span>
                  {myFrog.name}
                </h5>
                <div className="flex flex-wrap gap-1">
                  {myContactLinks.slice(0, 3).map((link, index) => (
                    link && (
                      <a
                        key={index}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs bg-white px-2 py-1 rounded-full transition-colors"
                      >
                        <span className="mr-1">{link.icon}</span>
                        <span>{link.label}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
              
              <div className="flex-1 p-3 rounded-lg" 
                   style={{backgroundColor: `${brandTheme.secondaryColor}10`}}>
                <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center mr-2 shadow-sm"
                        style={{backgroundColor: `${brandTheme.secondaryColor}20`}}>                 
                    <img 
                      src={otherFrog.logo_url} 
                      alt=""
                      className="w-4 h-4 object-cover"
                      onError={(e) => {
                        // Create a canvas-based fallback image
                        const canvas = document.createElement('canvas');
                        canvas.width = 100;
                        canvas.height = 100;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.fillStyle = brandTheme.secondaryColor;
                          ctx.beginPath();
                          ctx.arc(50, 50, 50, 0, Math.PI * 2);
                          ctx.fill();
                          ctx.fillStyle = '#ffffff';
                          ctx.font = 'bold 40px Arial';
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';
                          ctx.fillText(otherFrog.name.charAt(0).toUpperCase(), 50, 50);
                          (e.target as HTMLImageElement).src = canvas.toDataURL();
                        }
                      }}
                    />
                  </span>
                  {otherFrog.name}
                </h5>
                <div className="flex flex-wrap gap-1">
                  {otherContactLinks.slice(0, 3).map((link, index) => (
                    link && (
                      <a
                        key={index}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs bg-white px-2 py-1 rounded-full transition-colors"
                      >
                        <span className="mr-1">{link.icon}</span>
                        <span>{link.label}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center">
          <a 
            href="https://lilypad.tech" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            <span className="mr-1">🐸</span>
            <span className="text-gray-500">VibeCheck by Lilypad</span>
          </a>
        </div>
      </div>
      
      {/* Share buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 download-ignore px-4">
        <button onClick={handleDownload} className="btn-primary flex items-center gap-2 justify-center min-w-[130px]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3.5a.5.5 0 01.5.5v9.793l3.146-3.147a.5.5 0 01.708.708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 01.708-.708L9.5 13.793V4a.5.5 0 01.5-.5z" />
          </svg>
          Save Image
        </button>

        <button onClick={handleCopyToClipboard} className="btn-primary flex items-center gap-2 justify-center min-w-[150px]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          Copy to Clipboard
        </button>

        <button onClick={handleShareOnTwitter} className="btn-primary flex items-center gap-2 justify-center min-w-[150px]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Share on Twitter
        </button>
      </div>

    </div>
  );
}