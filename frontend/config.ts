const isBrowser = typeof window !== 'undefined';
// In browser, use current origin (e.g. https://www.judsci.org.ng) so API endpoints hit the unified live web server
const API_BASE_URL = isBrowser
  ? window.location.origin
  : (import.meta.env.VITE_API_URL || 'https://www.judsci.org.ng').replace(/\/$/, '');

console.log('--- JDPC DEBUG: API Connectivity ---');
console.log('Configured Backend URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  PROGRAMS: `${API_BASE_URL}/api/programs/`,
  POSTS: `${API_BASE_URL}/api/posts/`,
  BOOKINGS: `${API_BASE_URL}/api/bookings/`,
  RESOURCES: `${API_BASE_URL}/api/resources/`,
  DONATIONS: `${API_BASE_URL}/api/donations/`,
  STATS: `${API_BASE_URL}/api/impact-stats/`,
  ADMIN_DASHBOARD_STATS: `${API_BASE_URL}/api/admin/dashboard-stats/`,
  PHOTOS: `${API_BASE_URL}/api/photos/`,
  TOKEN: `${API_BASE_URL}/api/token/`,
  TOKEN_REFRESH: `${API_BASE_URL}/api/token/refresh/`,
};

export const getMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE_URL}${cleanUrl}`;
};

export default API_BASE_URL;
