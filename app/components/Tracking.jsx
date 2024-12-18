"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/styles/shipping.module.css";
import { useTrackingStore } from "@/app/store/Tracking";
import { IoGrid as TrackingIdIcon } from "react-icons/io5";

export default function Tracking() {
  const router = useRouter();
  const { accessToken} = useAuthStore();
  const { togglePopup } = useDrawerStore();
  const { getTracking } = useTrackingStore();
  const [trackingID, setTrackingID] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ trackingId: "" });

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const trackingID = currentUrl.searchParams.get("trackingId") || "";
    setFormData({ trackingId: trackingID });
    setTrackingID(trackingID);
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { trackingId } = formData;

    if (!trackingId.trim()) {
      toast.error("Please enter a valid tracking ID.");
      return;
    }

    setIsLoading(true);

    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("trackingId", trackingId);
      router.replace(
        `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`
      );

      const response = await getTracking(trackingId, accessToken);
      if (response.success) {
        togglePopup();
        toast.success("Tracking ID found successfully!");
      } else {
        throw new Error(
          response.message || "Failed to find tracking information"
        );
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formInput}>
        <TrackingIdIcon className={styles.formIcon} />
        <input
          type="text"
          name="trackingId"
          value={formData.trackingId}
          onChange={handleInputChange}
          placeholder="Enter Tracking ID"
          required
        />
      </div>
      <button type="submit" disabled={isLoading} className={styles.formButton}>
        {isLoading ? <Loader /> : "Start Tracking"}
      </button>
    </form>
  );
}
