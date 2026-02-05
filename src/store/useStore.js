import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set) => ({
            // Auth
            user: null,
            login: async (email, password) => {
                // Mock Google Login Bypass
                if (password === 'mock-google-token') {
                    set({
                        user: {
                            name: "Priya (Google)",
                            email: email,
                            wallet: 500,
                            orders: 2
                        }
                    });
                    return true;
                }

                try {
                    const res = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    if (!res.ok) throw new Error('Login failed');

                    const data = await res.json();
                    set({ user: data.user });
                    return true;
                } catch (error) {
                    console.error(error);
                    return false;
                }
            },
            logout: () => set({ user: null }),

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
                try {
                    const response = await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });

                    if (!response.ok) throw new Error('Failed to place order');

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
