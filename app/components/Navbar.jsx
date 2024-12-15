"use client";

import Link from "next/link";
import Image from "next/image";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/styles/navbar.module.css";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

// icons
import { LuArrowUpRight as LinkIcon } from "react-icons/lu";
import { RiMenu4Fill as MenuIcon } from "react-icons/ri";
import { HiOutlineLogout as LogoutIcon } from "react-icons/hi";

export default function NavbarComponent() {
  const { isAuth, username, clearUser } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const { toggleOpen, isOpen } = useDrawerStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    clearUser(); 
    router.push("/authentication/login", { scroll: false });
  }, [clearUser, router]);

  const handleLogin = () => {
    router.push("/authentication/login", { scroll: false });
  };
  
  const goHome = () => {
    router.push("/page/home", { scroll: false });
  };

  const toggleDrawer = () => {
    if (isMobile && isOpen) {
      toggleOpen();
    }
  };

  const linkClasses = `
${styles.linkContainer}
${isMobile && isOpen ? styles.mobileDrawerLink : styles.hideDrawerLink}
${!isMobile ? styles.showDrawerLink : ""}
${!isMobile && isOpen ? styles.showDrawerLink : ""}
${!isMobile && !isOpen ? styles.showDrawerLink : ""}
`.trim();

  return (
    <div className={styles.layoutNav}>
      <div className={styles.navMain}>
        <div className={styles.navContainer}>
          <div className={styles.menuContainer}>
            {isMobile && (
              <MenuIcon
                alt="menu icon"
                height={40}
                aria-label="menu icon"
                className={styles.menuIcon}
                onClick={toggleOpen}
              />
            )}
            <Image
              className={styles.logoImage}
              src={LogoImg}
              alt="logo"
              height={40}
              onClick={goHome}
              priority={true}
            />
          </div>

          <div className={linkClasses}>
            <div className={styles.linkItems}>
              <Link
                href="/"
                onClick={toggleDrawer}
                className={`${styles.link} ${
                  pathname === "/" ? styles.activeLink : ""
                }`}
              >
                Home
              </Link>
              <Link
                href="/page/about"
                onClick={toggleDrawer}
                className={`${styles.link} ${
                  pathname === "/page/about" ? styles.activeLink : ""
                }`}
              >
                About us
              </Link>
              <Link
                href="/page/service"
                onClick={toggleDrawer}
                className={`${styles.link} ${
                  pathname === "/page/service" ? styles.activeLink : ""
                }`}
              >
                Services
              </Link>

              <Link
                href="/page/contact"
                onClick={toggleDrawer}
                className={`${styles.link} ${
                  pathname === "/page/contact" ? styles.activeLink : ""
                }`}
              >
                Contact us
              </Link>
            </div>

            <button 
              className={styles.navBtn} 
              onClick={isAuth ? handleLogout : handleLogin}
            >
              {isAuth ? (
                <>
                  Logout
                  <LogoutIcon
                    alt="logout icon"
                    aria-label="logout icon"
                    className={styles.btnIcon}
                  />
                </>
              ) : (
                <>
                  Login{" "}
                  <LinkIcon
                    alt="login icon"
                    aria-label="login icon"
                    className={styles.btnIcon}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}