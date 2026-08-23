import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const API_BASE_URLS = [
  BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`,
  ...(isLocal ? ['http://localhost:5001/api', 'http://127.0.0.1:5001/api'] : [])
].filter(Boolean);

export const apiRequest = async (method, path, data = null, config = {}) => {
  let lastError = null;

  // Clean config headers for FormData to let browser set boundary parameter automatically
  const requestConfig = { ...config };
  if (data instanceof FormData && requestConfig.headers) {
    delete requestConfig.headers['Content-Type'];
    delete requestConfig.headers['content-type'];
  }

  for (const baseUrl of API_BASE_URLS) {
    try {
      const url = `${baseUrl}${path}`;
      const res = await axios({
        method,
        url,
        data,
        timeout: 300000, // 5 minutes timeout for large video uploads
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        ...requestConfig,
      });
      return res;
    } catch (err) {
      lastError = err;
      console.error(`[API Network Error] Connection failed to ${baseUrl}${path}:`, err.message || err);
      if (err.response) throw err; // If server responded with status code 4xx/5xx, return error
    }
  }
  console.error('[API Failure] All API base URLs exhausted without clean response. Falling back to local/cloud handlers.');
  throw lastError;
};

export const API_URL = API_BASE_URLS[0];

export const getMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return '/card_own_power.png';
  if (url.includes('localhost') && url.includes('/uploads/')) {
    const parts = url.split('/uploads/');
    return `/uploads/${parts[1]}`;
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/uploads') || url.startsWith('uploads')) {
    return url.startsWith('/') ? url : `/${url}`;
  }
  return url;
};

export const isVideoMedia = (url) => {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return (
    lower.startsWith('data:video') ||
    lower.startsWith('blob:') ||
    lower.includes('vid_') ||
    lower.includes('.mp4') ||
    lower.includes('.webm') ||
    lower.includes('.mov') ||
    lower.includes('.m4v') ||
    lower.includes('video')
  );
};
