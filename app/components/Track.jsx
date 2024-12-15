"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import Pulse from "@/app/components/Pulse";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/app/styles/payment.module.css";
import TrackingImage from "@/public/assets/tracking.png";
import { FaWeightHanging as WeightIcon } from "react-icons/fa";
import {
  MdOutlinePlace as CountryIcon,
  MdAccountBalanceWallet as AccountIcon,
  MdOutlinePlace as LocationIcon,
  MdLocalShipping as ShippingIcon,
  MdCheck as CheckIcon,
} from "react-icons/md";

import { IoCopy as CopyIcon, IoCheckbox as CopySuccess } from "react-icons/io5";
import { FaBox as DeliveryIcon } from "react-icons/fa";

export default function Track() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState({});
  const [currentStage, setCurrentStage] = useState(1);
  const [trackingDetails, setTrackingDetails] = useState({
    currentLocation: "Processing Center",
    estimatedDelivery: "Dec 20, 2024",
    status: "In Transit",
  });

  const bankDetails = {
    totalPrice: searchParams.get("price") || "0.00",
    country: searchParams.get("country") || "Not specified",
    weight: searchParams.get("weight") || "Not available",
    trackingID: searchParams.get("trackingId") || "",
  };

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied((prev) => ({ ...prev, [field]: true }));
      setTimeout(
        () => setCopied((prev) => ({ ...prev, [field]: false })),
        2000
      );
      toast.success(`${field} copied to clipboard!`);
    });
  };

  const trackingStages = [
    {
      stage: "Order Placed",
      icon: DeliveryIcon,
      description: "Your shipment has been processed",
    },
    {
      stage: "In Transit",
      icon: ShippingIcon,
      description: "Package is on its way",
    },
    {
      stage: "Delivered",
      icon: CheckIcon,
      description: "Package has arrived",
    },
  ];

  useEffect(() => {
    const updateTracking = () => {
      const mockUpdates = [
        {
          stage: 1,
          location: "Processing Center",
          status: "Order Placed",
          estimatedDelivery: "Dec 20, 2024",
        },
        {
          stage: 2,
          location: "Denver, CO",
          status: "In Transit",
          estimatedDelivery: "Dec 20, 2024",
        },
        {
          stage: 3,
          location: "Destination",
          status: "Delivered",
          estimatedDelivery: "Dec 20, 2024",
        },
      ];

      const currentUpdate = mockUpdates.find(
        (update) => update.stage === currentStage
      );
      if (currentUpdate) {
        setTrackingDetails({
          currentLocation: currentUpdate.location,
          estimatedDelivery: currentUpdate.estimatedDelivery,
          status: currentUpdate.status,
        });
      }
    };

    updateTracking();
  }, [currentStage]);

  return (
    <div className={styles.paymentContainer}>
      <h1>Payment Details</h1>
      <div className={styles.accountCard}>
        <div className={styles.accountCardTop}>
          <Image
            className={styles.accountCardImage}
            src={TrackingImage}
            alt="Payment Illustration"
            layout="fill"
            objectFit="contain"
            quality={100}
            priority
          />
        </div>
        <div className={styles.accountCardBottom}>
          <div className={styles.accountCardNav}>
            <div className={styles.accountCardNavDetails}>
              <CountryIcon className={styles.accountCardNavDetailsIcon} />
              <span>{bankDetails.country}</span>
            </div>
            <div className={styles.accountCardNavDetailsSpan}>
              <WeightIcon className={styles.accountCardNavDetailsIcon} />
              <span>{bankDetails.weight}</span>
            </div>
          </div>
          <div className={styles.accountContent}>
            <div className={styles.accountContentDetails}>
              <div className={styles.accountContentHeader}>
                <div className={styles.accountContentHeaderDetails}>
                  <AccountIcon />
                  <h3>Tracking ID</h3>
                </div>
                <p>{bankDetails.trackingID}</p>
              </div>

              <button
                className={styles.copyButton}
                onClick={() =>
                  handleCopy("tracking Id", bankDetails.trackingID)
                }
              >
                {copied["tracking Id"] ? <CopySuccess /> : <CopyIcon />}
              </button>
            </div>
          </div>
          <div className={styles.trackingWrapper}>
            <div className={styles.trackingProgress}>
              {trackingStages.map((stage, index) => {
                const StageIcon = stage.icon;
                const isActive = currentStage >= index + 1;

                return (
                  <div
                    key={stage.stage}
                    className={`${styles.trackingStage} ${
                      isActive ? styles.activeStage : ""
                    }`}
                    onClick={() => setCurrentStage(index + 1)}
                  >
                    <div className={styles.stageContainer}>
                      <StageIcon className={styles.stageIcon} />
                      <div className={styles.stageDetails}>
                        <h4>{stage.stage}</h4>
                        <p>{stage.description}</p>
                      </div>
                    </div>
                    {index < trackingStages.length - 1 &&
                      (isActive ? <Pulse /> : "")}
                  </div>
                );
              })}
            </div>

            <div className={styles.trackingInfo}>
              <div className={styles.trackingInfoItem}>
                <div className={styles.trackingInfoItemHead}>
                  <LocationIcon className={styles.trackingInfoIcon} />
                  <p>Current</p>
                </div>
                <p>{trackingDetails.currentLocation}</p>
              </div>
              <p>Estimated Delivery {trackingDetails.estimatedDelivery}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p>Tracking your shipment made easier</p>
      </div>
    </div>
  );
}
