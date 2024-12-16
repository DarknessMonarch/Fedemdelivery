"use client";

import { useEffect, useState } from "react";
import NavBar from "@/app/components/Navbar";
import { usePathname } from "next/navigation";
import styles from "@/app/styles/dashboard.module.css";
import AccountTable from "@/app/components/dashboardItems/AccountTable";
import DashboardCard from "@/app/components/dashboardItems/DashboardCard";

export default function DashboardPage() {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    if (pathname === "/") {
      setShowNav(false);
    }
  }, [pathname]);

  return (
    <div className={styles.dashboardContainer}>
      {showNav && <NavBar />}

      <DashboardCard />
      <div className={styles.dashboardLayout}>{<AccountTable />}</div>
    </div>
  );
}
