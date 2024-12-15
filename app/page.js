"use client";

import { useSearchParams } from "next/navigation";
import styles from "@/app/styles/app.module.css";
import Payment from "@/app/components/Payment";
import NavBar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import Popup from "@/app/components/Popup";
import Track from "@/app/components/Track";

// pages
import Home from "@/app/page/home/page";
import About from "@/app/page/about/page";
import Service from "@/app/page/service/page";
import Contact from "@/app/page/contact/page";

export default function App() {
  const searchParams = useSearchParams();
  const [trackingID, setTrackingID] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const currentTrackingID = searchParams.get("trackingId") || "";
    const totalPrice = searchParams.get("trackingId") || "";
    setTrackingID(currentTrackingID);
  }, [searchParams]);

  return (
    <>
      <div className={styles.layoutMain}>
        <NavBar />
        <div>
          <Home />
        </div>
        <div>
          <About />
        </div>
        <div>
          <Service />
        </div>
        <div>
          <Contact />
        </div>
      </div>
      {trackingID ? (
        <Popup content={<Track />} />
      ) : (
        <Popup content={<Payment />} />
      )}
    </>
  );
}
