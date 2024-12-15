"use client";

import styles from "@/app/styles/about.module.css";
import AboutCard from "@/app/components/AboutCard";
import AboutImage from "@/public/assets/about.png";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "@/app/components/Navbar";
import Image from "next/image";

// pages
import Contact from "@/app/page/contact/page";

export default function About() {
  const [showNav, setShowNav] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setShowNav(false);
    }
  }, [pathname]);

  return (
    <>
      <div className={styles.aboutMain}>
        {showNav && <NavBar />}
        <div className={!showNav ? styles.aboutCardWrapper : undefined}>
          <AboutCard />
        </div>
        <div className={styles.aboutContent}>
          <div className={styles.aboutImageWrapper}>
            <Image
              className={styles.aboutImage}
              src={AboutImage}
              alt="Reliable shipping services"
              layout="fill"
              objectFit="contain"
              quality={100}
              priority
            />
          </div>
          <div className={styles.aboutContentInfo}>
            <h1>
              Your <span>Trusted Partner</span> in <span>Shipping</span> and{" "}
              <span>Logistics</span>
            </h1>
            <p>
              At Fxdelivery, we pride ourselves on delivering seamless and
              reliable shipping solutions designed to meet the unique needs of
              every client. Whether you need fast deliveries, cost-effective
              solutions, or specialized logistics, we are here to ensure your
              goods reach their destination safely and on time.
            </p>
            <p>
              Backed by cutting-edge technology and a dedicated team of
              professionals, our services are tailored to provide efficiency,
              transparency, and unparalleled client satisfaction. Experience
              hassle-free shipping and discover why countless clients trust us
              to move their world.
            </p>
          </div>
        </div>
      </div>
      {showNav && <Contact />}
    </>
  );
}
