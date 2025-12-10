// API Configuration
// Returns the API base URL without trailing slash
// Use VITE_API_URL environment variable if set, otherwise fallback to localhost
const getApiUrl = () => {
    // Check for VITE_API_URL from Vite environment variables
    const envUrl = import.meta.env.VITE_API_URL;

    // If running in production (Render) and VITE_API_URL is set, use it
    if (envUrl) {
        // Remove trailing slash if present
        return envUrl.replace(/\/$/, '');
    }

    // Fallback for local development
    return 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();
