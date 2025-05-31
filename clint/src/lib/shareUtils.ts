// Utility functions for sharing and downloading

export const shareVictoryPage = async (winnerName: string): Promise<void> => {
  const currentDomain = window.location.hostname;
  const gameUrl = currentDomain.includes('localhost') || currentDomain.includes('replit') 
    ? window.location.origin 
    : 'https://ghostyword.vercel.app';
    
  const shareData = {
    title: 'Ghosty Word - Victory!',
    text: `🏆 Victory in Ghosty Word! Player "${winnerName}" emerged as the champion in this intense word formation battle. Ready to challenge them?`,
    url: gameUrl
  };

  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      // Create a more comprehensive share text
      const shareText = `🏆 GHOSTY WORD VICTORY! 🏆\n\nPlayer "${winnerName}" dominated the word formation arena!\n\nThink you can beat them? Play now: ${gameUrl}\n\n#GhostyWord #WordGame #Victory`;
      
      // Try to copy to clipboard
      await navigator.clipboard.writeText(shareText);
      
      // Show success message with options
      const shareOnSocial = confirm(
        `Victory message copied to clipboard!\n\nClick OK to open social media sharing options, or Cancel to share manually.`
      );
      
      if (shareOnSocial) {
        // Open social media sharing links
        const socialUrls = generateSocialShareUrls(winnerName);
        window.open(socialUrls.twitter, '_blank', 'width=600,height=400');
      }
    }
  } catch (error) {
    console.error('Error sharing:', error);
    
    // Manual fallback
    const manualShareText = `🏆 GHOSTY WORD VICTORY! Player "${winnerName}" won! Play at: ${gameUrl}`;
    
    try {
      await navigator.clipboard.writeText(manualShareText);
      alert('Victory message copied to clipboard! You can now paste it anywhere to share.');
    } catch (clipboardError) {
      console.error('Clipboard access failed:', clipboardError);
      prompt('Copy this victory message to share:', manualShareText);
    }
  }
};

export const downloadPageAsPNG = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    // Show loading indicator
    const loadingToast = document.createElement('div');
    loadingToast.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      background: rgba(0,0,0,0.8); color: white; padding: 12px 20px;
      border-radius: 8px; font-family: Inter, sans-serif;
    `;
    loadingToast.textContent = 'Generating image...';
    document.body.appendChild(loadingToast);
    
    // Dynamic import of html2canvas
    const html2canvas = await import('html2canvas');
    
    // Get current theme colors
    const computedStyle = getComputedStyle(document.documentElement);
    const bgColor = computedStyle.getPropertyValue('--background').trim();
    
    const canvas = await html2canvas.default(element, {
      backgroundColor: bgColor ? `hsl(${bgColor})` : '#0f0f23',
      scale: 2, // High quality for crisp text
      useCORS: true,
      logging: false,
      allowTaint: true,
      foreignObjectRendering: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollX: 0,
      scrollY: 0,
    });
    
    // Remove loading toast
    document.body.removeChild(loadingToast);
    
    // Create high-quality blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        // Success notification
        alert('Victory image downloaded successfully!');
      }
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('Error downloading page as PNG:', error);
    alert('Unable to generate image download. This may be due to browser security restrictions. Please try taking a screenshot manually.');
  }
};

// Alternative download method using modern browser APIs
export const downloadPageAsImage = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    // Use the newer browser APIs if available
    if ('showSaveFilePicker' in window) {
      const html2canvas = await import('html2canvas');
      const canvas = await html2canvas.default(element, {
        backgroundColor: '#0f0f23',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            // @ts-ignore - showSaveFilePicker is not in TypeScript types yet
            const fileHandle = await window.showSaveFilePicker({
              suggestedName: `${filename}.png`,
              types: [{
                description: 'PNG Image',
                accept: { 'image/png': ['.png'] },
              }],
            });
            
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch (error) {
            // User cancelled or error occurred, fallback to regular download
            downloadPageAsPNG(element, filename);
          }
        }
      });
    } else {
      // Fallback to regular download
      await downloadPageAsPNG(element, filename);
    }
  } catch (error) {
    console.error('Error with modern download API:', error);
    await downloadPageAsPNG(element, filename);
  }
};

// Generate social media sharing URLs
export const generateSocialShareUrls = (winnerName: string) => {
  const currentDomain = window.location.hostname;
  const gameUrl = currentDomain.includes('localhost') || currentDomain.includes('replit') 
    ? window.location.origin 
    : 'https://ghostyword.vercel.app';
    
  const message = encodeURIComponent(`🏆 Victory in Ghosty Word! Player "${winnerName}" dominated the word formation arena! Ready to challenge them?`);
  const url = encodeURIComponent(gameUrl);
  const hashtags = encodeURIComponent('GhostyWord,WordGame,Victory');
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${message}&url=${url}&hashtags=${hashtags}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${message}`,
    reddit: `https://reddit.com/submit?url=${url}&title=${message}`,
    whatsapp: `https://wa.me/?text=${message}%20${url}`,
    telegram: `https://t.me/share/url?url=${url}&text=${message}`,
  };
};
