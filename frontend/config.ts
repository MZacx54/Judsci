const rawUrl = import.meta.env.VITE_API_URL || '';
// Remove trailing slash if present
const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

console.log('--- JDPC DEBUG: API Connectivity ---');
console.log('Configured Backend URL:', API_BASE_URL || 'NONE (Using relative paths)');
if (!API_BASE_URL) {
  console.warn('WARNING: VITE_API_URL is empty. Requests will hit the Vercel domain and likely fail with SyntaxError.');
}

export const API_ENDPOINTS = {
  PROGRAMS: `${API_BASE_URL}/api/programs/`,
  POSTS: `${API_BASE_URL}/api/posts/`,
  BOOKINGS: `${API_BASE_URL}/api/bookings/`,
  RESOURCES: `${API_BASE_URL}/api/resources/`,
  DONATIONS: `${API_BASE_URL}/api/donations/`,
  STATS: `${API_BASE_URL}/api/impact-stats/`,
  PHOTOS: `${API_BASE_URL}/api/photos/`,
  TOKEN: `${API_BASE_URL}/api/token/`,
  TOKEN_REFRESH: `${API_BASE_URL}/api/token/refresh/`,
};

export default API_BASE_URL;
