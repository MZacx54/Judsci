
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  PROGRAMS: `${API_BASE_URL}/api/programs/`,
  POSTS: `${API_BASE_URL}/api/posts/`,
  BOOKINGS: `${API_BASE_URL}/api/bookings/`,
  RESOURCES: `${API_BASE_URL}/api/resources/`,
  DONATIONS: `${API_BASE_URL}/api/donations/`,
  STATS: `${API_BASE_URL}/api/impact-stats/`,
};

export default API_BASE_URL;
