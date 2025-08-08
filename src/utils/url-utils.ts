
// Available domains for short URLs
export const domains = [
  { value: 'short.ly', label: 'short.ly' },
  { value: 'vercel.app', label: 'vercel.app' },
  { value: 'web.app', label: 'web.app' },
  { value: 'Redestiny', label: 'Redestiny' },
];

// Validate a URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

// Format a URL for display (shorten if too long)
export const formatUrlForDisplay = (url: string, maxLength = 50): string => {
  if (url.length <= maxLength) return url;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;
    
    if (domain.length + 10 >= maxLength) {
      return domain.substring(0, maxLength - 3) + '...';
    }
    
    // Display domain + truncated path
    const availableChars = maxLength - domain.length - 6; // account for "..."
    return `${domain}${path.substring(0, availableChars)}...`;
  } catch (err) {
    // If not a valid URL, just truncate it
    return url.substring(0, maxLength - 3) + '...';
  }
};

// Format a date for display
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Generate a full short URL
export const getFullShortUrl = (shortCode: string, domain: string): string => {
  // In production, this would use the actual domain
  return `${window.location.origin}/r/${shortCode}`;
};
