const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // In development, we use the Vite proxy
    return '';
};

export const API_URL = getBaseUrl();
