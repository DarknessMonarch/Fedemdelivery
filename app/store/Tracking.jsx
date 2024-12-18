import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useTrackingStore = create(
  persist(
    (set, get) => ({
      tracking: null,

      createTracking: async (trackingData, accessToken) => {
        try {

          if (!accessToken) {
            return {
              success: false,
              message: "Authentication required. Please log in.",
            };
          }

          const response = await fetch(`${SERVER_API}/tracking/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(trackingData),
          });

          const data = await response.json();

          if (data.status === "success") {
            set({ tracking: data.data });
            return {
              success: true,
              message: data.message,
              trackingDetails: data.data,
            };
          }

          return {
            success: false,
            message: data.message || "Failed to create tracking",
          };
        } catch (error) {
          console.error("Tracking creation error:", error);
          return {
            success: false,
            message: "An error occurred while creating tracking",
          };
        }
      },

      updateTracking: async (trackingId, updateData, accessToken) => {
        try {

          if (!accessToken) {
            return {
              success: false,
              message: "Authentication required. Please log in.",
            };
          }

          const response = await fetch(`${SERVER_API}/tracking/update/${trackingId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updateData),
          });

          const data = await response.json();

          if (data.status === "success") {
            set({ tracking: data.data });
            return {
              success: true,
              message: data.message,
              updatedTracking: data.data,
            };
          }

          return {
            success: false,
            message: data.message || "Failed to update tracking",
          };
        } catch (error) {
          console.error("Tracking update error:", error);
          return {
            success: false,
            message: "An error occurred while updating tracking",
          };
        }
      },

      getTracking: async (trackingId, accessToken) => {
        try {

          if (!accessToken) {
            return {
              success: false,
              message: "Authentication required. Please log in.",
            };
          }

          const response = await fetch(`${SERVER_API}/tracking/${trackingId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();

          if (data.status === "success") {
            set({ tracking: data.data });
            return {
              success: true,
              trackingDetails: data.data,
            };
          }

          return {
            success: false,
            message: data.message || "Failed to retrieve tracking",
          };
        } catch (error) {
          console.error("Get tracking error:", error);
          return {
            success: false,
            message: "An error occurred while retrieving tracking",
          };
        }
      },

      clearTracking: () => {
        set({ tracking: null });
      },
    }),
    {
      name: "tracking-storage",
      getStorage: () => localStorage,
    }
  )
);
