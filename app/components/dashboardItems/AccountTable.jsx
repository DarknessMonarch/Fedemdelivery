"use client";

import toast from "react-hot-toast";
import Loading from "@/app/components/Loading";
import { useAuthStore } from "@/app/store/Auth";
import { useEffect, useMemo, useState } from "react";
import { IoCopy as CopyIcon } from "react-icons/io5";
import styles from "@/app/styles/accounttable.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  HiOutlineDownload as DownloadIcon, 
  HiRefresh as RefreshIcon 
} from "react-icons/hi";
import { MdDeleteOutline as DeleteIcon } from "react-icons/md";

export default function AccountTable() {
  const authStore = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const result = await authStore.fetchUsers();
        if (result.success) {
          setUsers(result.users);
        } else {
          toast.error(result.message || "Failed to fetch users");
        }
      } catch (error) {
        toast.error("An error occurred while fetching users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authStore, router]);

  const filteredUsers = useMemo(() => {
    const cardType = searchParams.get('card');
    
    return users.filter(user => {
      switch(cardType) {
        case 'admin':
          return user.isAdmin;
        case 'paid':
          return user.isAuthorized;
        default:
          return true;
      }
    });
  }, [users, searchParams]);

  const handleToggleAuthorization = async (email, currentStatus) => {

    try {
      const result = await authStore.toggleAuthorization({ 
        email, 
        isAuthorized: !currentStatus 
      });

      if (result.success) {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.email === email 
              ? { ...user, isAuthorized: !currentStatus } 
              : user
          )
        );
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to toggle authorization");
    }
  };

  const downloadEmails = () => {
    const emailList = filteredUsers.map(user => user.email).join("\n");
    const blob = new Blob([emailList], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "user_emails.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Emails downloaded successfully!");
  };

  const copyGmailEmails = () => {
    const gmailEmails = filteredUsers
      .filter(user => user.email.endsWith("@gmail.com"))
      .map(user => user.email)
      .join(", ");

    navigator.clipboard
      .writeText(gmailEmails)
      .then(() => toast.success("Gmail emails copied to clipboard!"))
      .catch(() => toast.error("Failed to copy emails"));
  };

  const handleDelete = async (userId) => {
    if (!userId) return;
      
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
  
    try {
      const result = await authStore.deleteUser(userId);
      
      if (result.success) {
        setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
        toast.success(result.message || "User deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the user");
    }
  };

  const handleRefresh = async () => {
    
    setIsLoading(true);
    try {
      const result = await authStore.fetchUsers();
      if (result.success) {
        setUsers(result.users);
        toast.success("Users refreshed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.accountContainer}>
      <div className={styles.tableHeader}>
          <div 
            className={styles.copyContainer} 
            onClick={downloadEmails}
          >
            <DownloadIcon aria-label="download emails" className={styles.copyIcon} />
            Download Emails
          </div>
          <div 
            className={styles.copyContainer} 
            onClick={copyGmailEmails}
          >
            <CopyIcon aria-label="copy gmail emails" className={styles.copyIcon} />
          </div>
          <div 
            className={styles.copyContainer} 
            onClick={handleRefresh}
          >
            <RefreshIcon aria-label="refresh users" className={styles.copyIcon} />
          </div>
      </div>

      {isLoading && <Loading />}

      <div className={styles.tableWrapper}>
        <table className={styles.accountTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Toggle Paid</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.email} className={styles.tableRow}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.isAuthorized ? "Paid" : "Not paid"}</td>
                <td>
                  <div
                    className={`${styles.toggleContainer} ${
                      user.isAuthorized ? styles.toggleContainerActive : ""
                    }`}
                    onClick={() => handleToggleAuthorization(user.email, user.isAuthorized)}
                  >
                    <div className={styles.toggleInfoInner}>
                      {user.isAuthorized ? "Deactivate" : "Activate"}
                    </div>
                    <div className={styles.toggleThumb}></div>
                  </div>
                </td>
                <td>
                  <DeleteIcon
                    onClick={() => handleDelete(user.userId)}  
                    aria-label="delete account"
                    className={styles.deleteIcon}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredUsers.length === 0 && (
          <div className={styles.noUsersMessage}>
           <h1> No users found</h1>
          </div>
        )}
      </div>
    </div>
  );
}