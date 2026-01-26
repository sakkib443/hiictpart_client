// ===================================================================
// HiICTPark Frontend - API Configuration
// API URL centralized export
// ===================================================================

// Production backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hiictpark-server.vercel.app/api';

console.log('🔌 API Base URL:', API_BASE_URL);

// For local development, create .env.local with:
// NEXT_PUBLIC_API_URL=http://localhost:5000/api
