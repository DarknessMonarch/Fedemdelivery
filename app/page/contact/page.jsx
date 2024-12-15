"use client";

import { useRouter, usePathname } from "next/navigation";
import styles from "@/app/styles/contact.module.css";
import ContactImg from "@/public/assets/contact.png";
import LogoImg from "@/public/assets/logo.png";
import Loader from "@/app/components/Loader";
import { useEffect, useState } from "react";
import NavBar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineEmail as EmailIcon } from "react-icons/md";

export default function Contact() {
  const [showNav, setShowNav] = useState(true);
  const [formData, setFormData] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/" || pathname === "/page/about" || pathname === "/page/service") {
      setShowNav(false);
    }
  }, [pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you for signing up!");
        setFormData({ email: "" });
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.contactMain}>
      {showNav && <NavBar />}
      <div className={styles.contactBanner}>
        <Image
          className={styles.contactImage}
          src={ContactImg}
          alt="contact"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className={styles.contactBannerInfo}>
          <h1>World&apos;s Leading Contract</h1>
          <span>Logistic Provider</span>
        </div>
      </div>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <h1>
          Sign up for news and <br /> <span>Insights from Fx delivery</span>
        </h1>
        <div className={styles.emailContainer}>
          <div className={styles.formInput}>
            <EmailIcon className={styles.formIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formButton}
          >
            {isLoading ? <Loader /> : "Signup"}
          </button>
        </div>
      </form>
      <div className={styles.footer}>
        <Image
          className={styles.logoImage}
          src={LogoImg}
          alt="logo"
          onClick={() => router.push("/")}
          priority
        />
        <div className={styles.linkItems}>
          {[
            { href: "/", label: "Home" },
            { href: "/page/about", label: "About" },
            { href: "/page/service", label: "Services" },
            { href: "/page/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${
                pathname === href ? styles.activeLink : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; Fxdelivery 2024 | All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
