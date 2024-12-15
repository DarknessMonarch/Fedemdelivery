"use client";

import ServiceImage from "@/public/assets/service.jpg";
import LocationImage from "@/public/assets/location.png";
import styles from "@/app/styles/service.module.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "@/app/components/Navbar";
import Image from "next/image";

// icons
import {
  FaPlaneDeparture as Aircon,
  FaTruckMoving as LandIcon,
} from "react-icons/fa6";
import { GiCargoShip as SeaIcon } from "react-icons/gi";

// pages 
import Contact from "@/app/page/contact/page";



export default function Service() {
  const [showNav, setShowNav] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setShowNav(false);
    }
  }, [pathname]);

  const ServiceData = [
    {
      icon: Aircon,
      title: "Land Transport",
      description:
        "Reliable and efficient transport solutions for your goods by road.",
      perks: [
        "Flexible delivery options",
        "Suitable for short and mid-range distances",
        "Cost-effective for large shipments",
      ],
    },
    {
      icon: LandIcon,
      title: "Air Freight",
      description:
        "Quick and secure air freight services for urgent deliveries worldwide.",
      perks: [
        "Expedited shipping for time-sensitive goods",
        "Global coverage with reliable partnerships",
        "Ideal for high-value and perishable items",
      ],
    },
    {
      icon: SeaIcon,
      title: "Ocean Freight",
      description:
        "Affordable and sustainable solutions for shipping large volumes.",
      perks: [
        "Perfect for heavy-duty shipments",
        "Cost-efficient for long-distance transport",
        "Eco-friendly shipping options",
      ],
    },
  ];

  const ServiceAssuaranceData = [
    {
      position: "01",
      title: "Quality Management",
      description:
        "We adhere to the highest standards in logistics to ensure quality, safety, and reliability at every step.",
    },
    {
      position: "02",
      title: "Industry-level Standards",
      description:
        "Our services align with global industry standards to guarantee excellence and professionalism.",
    },
    {
      position: "03",
      title: "E-commerce Logistics Solutions",
      description:
        "Tailored logistics solutions designed to support e-commerce businesses in delivering exceptional customer experiences.",
    },
    {
      position: "04",
      title: "After-sale Service",
      description:
        "Comprehensive after-sale support to ensure customer satisfaction and build long-term partnerships.",
    },
  ];

  return (
    <>
    <div className={styles.serviceMain}>
      {showNav && <NavBar />}
      <div className={styles.serviceCardWrapper}>
        <div className={styles.serviceCardHeader}>
          <h1>
            Explore our <span>Services</span>
          </h1>
          <p>
            We offer a variety of services to help our clients get their
            products faster and efficiently depending on needs, urgency, and
            quality of goods.
          </p>
        </div>
        <div className={styles.serviceCardContainer}>
          {ServiceData.map((data, index) => (
            <div className={styles.servicecard} key={index}>
              <div className={styles.serviceCardIconWrapper}>
                <data.icon className={styles.serviceCardIcon} />
              </div>
              <h3>{data.title}</h3>
              <p>{data.description}</p>
              <ul>
                {data.perks.map((perk, index) => (
                  <div className={styles.listContainer} key={index}>
                    <li>{perk}</li>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.serviceAssuarance}>
        <Image
          className={styles.aboutImage}
          src={ServiceImage}
          alt="service"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />

        <div className={styles.serviceAssuaranceCardContainer}>
          {ServiceAssuaranceData.map((data, index) => (
            <div className={styles.serviceAssuaranceCard} key={index}>
              <div className={styles.serviceAssuaranceInfo}>
                <h2>{data.position}</h2>
                <h3>{data.title}</h3>
                <p>{data.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.locationWrapper}>
        <div className={styles.locationHeader}>
        <h1>
          Our offices are spread <br /> <span>Worldwide</span>
        </h1>
        <p>
          We are a global company located on multiple countries accross the
          globe to easily facilitate your shipping needs
        </p>
        </div>
       
        <div className={styles.locationImageWrapper}>
          <Image
            className={styles.locationImage}
            src={LocationImage}
            alt="location"
            layout="fill"
            objectFit="contain"
            quality={100}
            priority
          />
        </div>
      </div>
    </div>
    {showNav && <Contact />}
    </>
    
  );
}
