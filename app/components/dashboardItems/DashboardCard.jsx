"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MdAdminPanelSettings as AdminIcon } from "react-icons/md";
import { RiVipCrownLine as PaidIcon } from "react-icons/ri";
import styles from "@/app/styles/dashboardCard.module.css";
import { FaUsers as UserIcon } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/Auth";

export default function DashboardCard() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const authStore = useAuthStore();

  const [users, setUsers] = useState([]);
  const [dashCardData, setDashCardData] = useState([
    {
      name: "users",
      icon: UserIcon,
      title: "Accounts active",
      revenue: "0",
    },
    {
      name: "admin",
      icon: AdminIcon,
      title: "Admin accounts",
      revenue: "0",
    },
    {
      name: "paid",
      icon: PaidIcon,
      title: "Accounts paid",
      revenue: "0",
    },
  ]);

  const activeCard = searchParams.get("card");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await authStore.fetchUsers();
        if (result.success) {
          setUsers(result.users);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [authStore]);

  useEffect(() => {
    const updatedDashCardData = [
      {
        name: "users",
        icon: UserIcon,
        title: "Accounts active",
        revenue: users.length.toString(),
      },
      {
        name: "admin",
        icon: AdminIcon,
        title: "Admin accounts",
        revenue: users.filter(user => user.isAdmin).length.toString(),
      },
      {
        name: "paid",
        icon: PaidIcon,
        title: "Accounts paid",
        revenue: users.filter(user => user.isAuthorized).length.toString(),
      },
    ];

    setDashCardData(updatedDashCardData);
  }, [users]);

  const handleCardClick = useCallback((cardName) => {
    const params = new URLSearchParams(searchParams);
    params.set("card", cardName);
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  useEffect(() => {
    handleCardClick("users");
  }, [pathname, searchParams, router, handleCardClick]);

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
                height={24}
                width={24}
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