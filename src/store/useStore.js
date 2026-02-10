import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_URL } from '../config';

export const useStore = create(
    persist(
        (set) => ({
            // Auth
            user: null,
            token: null,
            login: async (email, password) => {
                try {
                    const res = await fetch(`${API_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.error || 'Login failed');
                    }

                    const data = await res.json();
                    set({ user: data.user, token: data.token });
                    return { success: true };
                } catch (error) {
                    console.error(error);
                    return { success: false, error: error.message };
                }
            },
            register: async (userData) => {
                try {
                    const res = await fetch(`${API_URL}/api/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    });

                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.error || 'Registration failed');
                    }

                    const data = await res.json();
                    set({ user: data.user, token: data.token });
                    return { success: true };
                } catch (error) {
                    console.error(error);
                    return { success: false, error: error.message };
                }
            },
            logout: () => set({ user: null, token: null }),

            // Theme
            theme: 'light',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

            // Cart
            cart: [],
            addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
            removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),
            clearCart: () => set({ cart: [] }),

            // Place Order
            placeOrder: async (orderData) => {
                const { token } = useStore.getState();
                try {
                    const response = await fetch(`${API_URL}/api/orders`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(orderData)
                    });

                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.error || 'Failed to place order');
                    }

                    const result = await response.json();
                    return { success: true, data: result };
                } catch (error) {
                    console.error('Order placement error:', error);
                    return { success: false, error: error.message };
                }
            },
        }),
        {
            name: 'thayal360-storage',
            getStorage: () => localStorage,
        }
    )
);
