const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Check if we are running on Vercel or in production
    if (import.meta.env.PROD) {
        return 'https://thayal-1.onrender.com';
    }
    // In development, we use the Vite proxy
    return '';
};

export const API_URL = getBaseUrl();
