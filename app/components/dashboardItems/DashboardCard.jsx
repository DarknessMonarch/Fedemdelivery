"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MdAdminPanelSettings as AdminIcon } from "react-icons/md";
import { RiVipCrownLine as PaidIcon } from "react-icons/ri";
import styles from "@/app/styles/dashboardCard.module.css";
import { FaUsers as UserIcon } from "react-icons/fa";
import { useEffect } from "react";

export default function DashboardCard() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeCard = searchParams.get("card");

  const dashCardData = [
    {
      name: "users",
      icon: UserIcon,
      title: "Accounts active",
      revenue: "1000",
    },
    {
      name: "admin",
      icon: AdminIcon,
      title: "Admin accounts",
      revenue: "70",
    },
    {
      name: "paid",
      icon: PaidIcon,
      title: "Accounts paid",
      revenue: "70",
    },
  ];

  const handleCardClick = (cardName) => {
    const params = new URLSearchParams(searchParams);
    params.set("card", cardName);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    handleCardClick("users");
  }, []);

  return (
    <div className={styles.dashcardContainer}>
      {dashCardData.map((data, index) => (
        <div
          className={`${styles.dashcard} ${
            activeCard === data.name ? styles.dashcardActive : ""
          }`}
          onClick={() => handleCardClick(data.name)}
          key={index}
        >
          <div className={styles.dashcardTitle}>
            <h1>{data.title}</h1>
            <div className={styles.dashCardIconWrapper}>
              <data.icon
                height={30}
                width={30}
                className={styles.dashCardIcon}
              />
            </div>
          </div>
          <h2>{data.revenue}</h2>
        </div>
      ))}
    </div>
  );
}
