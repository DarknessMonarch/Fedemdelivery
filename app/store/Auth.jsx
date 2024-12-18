import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuth: false,
      userId: "",
      username: "",
      email: "",
      isAuthorized: false,
      isAdmin: false,
      accessToken: "",
      refreshToken: "",
      lastLogin: null,
      tokenExpirationTime: null,
      refreshTimeoutId: null,

      setUser: (userData) => {
        const tokenExpirationTime = Date.now() + TOKEN_REFRESH_INTERVAL;
        set({
          isAuth: true,
          userId: userData.userId,
          username: userData.username,
          email: userData.email,
          isAuthorized: userData.isAuthorized,
          isAdmin: userData.isAdmin,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          lastLogin: userData.lastLogin,
          tokenExpirationTime,
        });
        get().scheduleTokenRefresh();
      },

      updateUser: (userData) => {
        set({
          username: userData.username,
          email: userData.email,
          isAuthorized: userData.isAuthorized,
          isAdmin: userData.isAdmin,
        });
      },

      clearUser: () => {
        get().cancelTokenRefresh();
        set({
          isAuth: false,
          userId: "",
          username: "",
          email: "",
          isAuthorized: false,
          isAdmin: false,
          accessToken: "",
          refreshToken: "",
          lastLogin: null,
          tokenExpirationTime: null,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          get().clearUser();
          return false;
        }

        try {
          const response = await fetch(`${SERVER_API}/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }

          const data = await response.json();

          if (data.status === "success" && data.data) {
            const tokenExpirationTime = Date.now() + 14 * 60 * 1000; // 14 minutes
            set({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              tokenExpirationTime,
            });
            get().scheduleTokenRefresh();
            return true;
          }

          throw new Error("Invalid response from refresh token endpoint");
        } catch (error) {
          console.error("Error refreshing token:", error);
          get().clearUser();
          return false;
        }
      },

      scheduleTokenRefresh: () => {
        const { tokenExpirationTime, refreshTimeoutId } = get();

        // Cancel any existing timeout
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }

        // Refresh 1 minute before expiration
        const timeUntilRefresh = Math.max(
          0,
          tokenExpirationTime - Date.now() - 60000
        );

        const newTimeoutId = setTimeout(() => {
          get().refreshAccessToken();
        }, timeUntilRefresh);

        set({ refreshTimeoutId: newTimeoutId });
      },

      cancelTokenRefresh: () => {
        const { refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          set({ refreshTimeoutId: null });
        }
      },

      login: async (email, password) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (data.status === "success") {
            get().setUser(data.data);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          console.error("Login error:", error);
          return { success: false, message: "An error occurred during login" };
        }
      },

      register: async (userData) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (data.status === "success") {
            get().setUser(data.data);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return {
            success: false,
            message: "An error occurred during registration",
          };
        }
      },

      logout: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          
          if (data.status === "success") {
            get().clearUser();
            return true;
          }
          return false;
        } catch (error) {
          return {
            
            success: false,
            message: "An error occurred during logout" || error,
          };
        }
      },

      requestPasswordReset: async (email) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset-link`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (data.status === "success") {
            return {
              success: true,
              message: data.message,
            };
          }
          return {
            success: false,
            message: data.message,
          };
        } catch (error) {
          console.error("Password reset request error:", error);
          return {
            success: false,
            message: "An error occurred during password reset request",
          };
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, newPassword }),
          });

          const data = await response.json();

          if (data.status === "success") {
            return {
              success: true,
              message: data.message,
            };
          }
          return {
            success: false,
            message: data.message,
          };
        } catch (error) {
          console.error("Password reset error:", error);
          return {
            success: false,
            message: "An error occurred during password reset",
          };
        }
      },

      fetchUsers: async () => {
        try {
          const { accessToken } = get();
          
          if (!accessToken) {
            return {
              success: false,
              message: "Authentication required. Please log in.",
            };
          }

          const response = await fetch(`${SERVER_API}/auth/users`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();

          if (data.users) {
            return {
              success: true,
              users: data.users,
            };
          }
          
          return {
            success: false,
            message: "Failed to fetch users",
          };
        } catch (error) {
          console.error("Fetch users error:", error);
          return {
            success: false,
            message: "An error occurred while fetching users",
          };
        }
      },

      toggleAuthorization: async (authData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/authorize`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(authData),
          });
      
          const data = await response.json();
      
          if (data.status === "success") {
            if (data.data && data.data.isAuthorized !== undefined) {
              // Preserve the current isAdmin status when updating
              get().updateUser({ 
                isAuthorized: data.data.isAuthorized,
                isAdmin: get().isAdmin  // This ensures isAdmin remains unchanged
              });
            }
            return {
              success: true,
              message: data.message,
              userData: data.data,
            };
          }
          return {
            success: false,
            message: data.message,
          };
        } catch (error) {
          console.error("Toggle authorization error:", error);
          return {
            success: false,
            message: "An error occurred while toggling authorization",
          };
        }
      },

      deleteAccount: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/delete`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();

          if (data.status === "success") {
            get().clearUser();
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          console.error("Delete account error:", error);
          return { success: false, message: "An error occurred while deleting account" };
        }
      },

      requestPayment: async (paymentData) => {
        try {
          const { accessToken } = get();
          
          if (!accessToken) {
            return {
              success: false,
              message: "Authentication required. Please log in.",
            };
          }

          const response = await fetch(`${SERVER_API}/auth/payment/details`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, 
            },
            body: JSON.stringify(paymentData),
          });

          const data = await response.json();

          if (data.status === "success") {
            return {
              success: true,
              message: data.message,
              paymentDetails: data.data || null, 
            };
          }
          
          return {
            success: false,
            message: data.message || "Failed to request payment details",
          };
        } catch (error) {
          console.error("Payment request error:", error);
          return {
            success: false,
            message: "An error occurred while requesting payment details",
          };
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);