import { useState } from "react";
import styles from "@/app/styles/aboutCard.module.css";

// icons
import { FaClock as ClockIcon } from "react-icons/fa";
import { PiWarehouseFill as WarehouseIcon } from "react-icons/pi";
import { IoMdPricetags as PricingIcon } from "react-icons/io";

export default function AboutCard() {
  const cardData = [
    {
      icon: ClockIcon,
      title: "Track Every Moment",
      description:
        "Monitor your shipments in real-time with our state-of-the-art tracking system, ensuring transparency and peace of mind.",
    },
    {
      icon: PricingIcon,
      title: "Unbeatable Value",
      description:
        "Enjoy competitive rates and tailored pricing plans that suit your shipping needs without compromising on quality.",
    },
    {
      icon: WarehouseIcon,
      title: "Store with Confidence",
      description:
        "Benefit from our secure and spacious warehouse facilities, perfect for temporary storage of your shipments.",
    },
  ];



  return (
    <div className={styles.aboutCardContainer}>
      {cardData.map((data, index) => (
        <div
          className={`${styles.aboutcard} ${
            index === 1 ? styles.centerCard : ""
          }`}
          key={index}
        >
          <div className={styles.aboutcardInfo}>
            <div className={styles.aboutCardIconWrapper}>
              <data.icon className={styles.aboutCardIcon} />
            </div>
            <h3>{data.title}</h3>
            <p>{data.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
