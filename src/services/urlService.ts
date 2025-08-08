
// import { v4 as uuidv4 } from 'uuid';

export interface UrlData {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  domain: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string | null;
}


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/urls';

// Create a new short URL
export const createShortUrl = async (
  userId: string,
  originalUrl: string,
  domain: string = 'short.ly',
  customShortCode?: string,
  expiresAt?: string
): Promise<UrlData> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, originalUrl, domain, shortCode: customShortCode, expiresAt })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create URL');
  return await res.json();
};

// Get all URLs for a specific user
export const getUserUrls = async (userId: string): Promise<UrlData[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch URLs');
  return await res.json();
};

// Get a URL by its short code
// Not used in dashboard, implement if needed for redirects
export const getUrlByShortCode = async (shortCode: string): Promise<UrlData | null> => {
  // Not implemented for Atlas yet
  return null;
};

// Update a URL's click count
// Not used in dashboard, implement if needed for analytics
export const incrementUrlClicks = async (id: string): Promise<UrlData | null> => {
  // Not implemented for Atlas yet
  return null;
};

// Update a URL
export const updateUrl = async (
  id: string,
  updates: Partial<Pick<UrlData, 'originalUrl' | 'shortCode' | 'domain' | 'expiresAt'>>
): Promise<UrlData | null> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update URL');
  return await res.json();
};

// Delete a URL
export const deleteUrl = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete URL');
  return true;
};
