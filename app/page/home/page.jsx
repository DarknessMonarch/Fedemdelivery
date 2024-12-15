"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Tracking from "@/app/components/Tracking";
import Shipping from "@/app/components/Shipping";
import styles from "@/app/styles/home.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";
import auth2Image from "@/public/assets/auth2Image.jpg";
import auth3Image from "@/public/assets/auth3Image.jpg";

// icons
import { LuCircleArrowOutUpRight as ArrowContactIcon } from "react-icons/lu";

export default function Home() {
  const router = useRouter();
  const images = [auth1Image, auth2Image, auth3Image];
  const [activeBtn, setActiveBtn] = useState("shipping");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const setBtn = (btnName) => {
    setActiveBtn(btnName);
    const currentUrl = new URL(window.location.href);
      currentUrl.search = "";
      router.replace(currentUrl.toString());

  };

  const handleContact = () => {
    router.push("/page/contact");
  };

  return (
    <div className={styles.homeMain}>
      <div className={styles.homeInfo}>
        <h1>
          Getting it there on <span>time</span> and within <span>budget</span>
        </h1>
        <div className={styles.homeInfoLine}>
          <p>
            We are dedicated to ensuring your deliveries are done on time and
          </p>
          <button className={styles.infoBtn} onClick={handleContact}>
            Contact Us
            <ArrowContactIcon
              className={styles.homeInfoIcon}
              alt="arrow icon"
              aria-label="arrow icon"
              size={18}
            />
          </button>
        </div>
      </div>
      <div className={styles.homeInnerContent}>
        <Image
          className={styles.homeImage}
          src={images[currentImageIndex]}
          alt="home background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className={styles.homeContent}>
          <h1>Your shipping needs are our concerns</h1>
          <div className={styles.homeInner}>
            <div className={styles.homeBtnContainer}>
              <button
                className={`${styles.homeBtnR} ${
                  activeBtn === "shipping" ? styles.activeBtn : ""
                }`}
                onClick={() => setBtn("shipping")}
              >
                Shipping cost
              </button>
              <button
                className={`${styles.homeBtnL} ${
                  activeBtn === "tracking" ? styles.activeBtn : ""
                }`}
                onClick={() => setBtn("tracking")}
              >
                Tracking
              </button>
            </div>
            {activeBtn === "tracking" ? <Tracking /> : <Shipping />}
          </div>
          <div className={styles.homeDetails}>
            <div className={styles.detailsContainer}>
              <h1>230K +</h1>
              <h2>Customers</h2>
            </div>
            <div className={styles.detailsContainer}>
              <h1>170K +</h1>
              <h2>Shippings</h2>
            </div>
            <div className={styles.detailsContainer}>
              <h1>100%</h1>
              <h2>Fulfillment</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
