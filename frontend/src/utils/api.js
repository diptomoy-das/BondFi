import { mockApi } from './mockBackend';

// For now, we are forcing the use of mockApi because the real backend is down.
// In the future, we can toggle this based on an env var like VITE_USE_MOCK.

const api = mockApi;

export default api;
