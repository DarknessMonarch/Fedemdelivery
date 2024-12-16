"use client";

import toast from "react-hot-toast";
import styles from "@/app/styles/accounttable.module.css";
import { useMemo, useState, useCallback } from "react";
import { HiOutlineDownload as DownloadIcon } from "react-icons/hi";
import { MdDeleteOutline as DeleteIcon } from "react-icons/md";
import { IoCopy as CopyIcon } from "react-icons/io5";

export default function AccountTable() {
  const [accountsData, setAccountsData] = useState([
    {
      id: 1,
      username: "collins",
      email: "collins@gmail.com",
      country: "Kenya",
      activationDate: "20-11-2024-12hr",
      isAuthorized: true,
      isAdmin: true,
      plan: "Weekly",
    },
    {
      id: 2,
      username: "alex",
      email: "alex@gmail.com",
      country: "Kenya",
      activationDate: "20-11-2024-12hr",
      isAuthorized: true,
      isAdmin: true,
      plan: "Weekly",
    },
    {
      id: 3,
      username: "maria",
      email: "maria@gmail.com",
      country: "Kenya",
      activationDate: "20-11-2024-12hr",
      isAuthorized: true,
      isAdmin: true,
      plan: "Weekly",
    },
  ]);

  const fetchGmailAccounts = useCallback(() => {
    const gmailEmails = accountsData
      .filter((account) => account.email.endsWith("@gmail.com"))
      .map((account) => account.email)
      .join(", ");

    navigator.clipboard
      .writeText(gmailEmails)
      .then(() => toast.success("Emails copied to clipboard successfully!"))
      .catch(() => toast.error("Failed to copy emails to clipboard."));
  }, [accountsData]);

  const handleDelete = useCallback((id) => {
    setAccountsData((prevData) => prevData.filter((account) => account.id !== id));
    toast.success("Account deleted successfully!");
  }, []);

  const handleToggle = useCallback((id) => {
    setAccountsData((prevData) =>
      prevData.map((account) =>
        account.id === id
          ? { ...account, isAuthorized: !account.isAuthorized }
          : account
      )
    );
  }, []);

  const downloadEmail = useCallback(() => {
    const emailList = accountsData.map((account) => account.email).join("\n");
    const blob = new Blob([emailList], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "emails.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Emails downloaded successfully!");
  }, [accountsData]);

  return (
    <div className={styles.accountContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.copyContainer} onClick={downloadEmail}>
          <DownloadIcon aria-label="download account" className={styles.copyIcon} />
          Download email
        </div>
        <div className={styles.copyContainer} onClick={fetchGmailAccounts}>
          <CopyIcon aria-label="copy account" className={styles.copyIcon} />
          Copy Emails
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.accountTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Country</th>
              <th>Paid Status</th>
              <th>Toggle Paid</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {accountsData.map((account) => (
              <tr key={account.id} className={styles.tableRow}>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>{account.country}</td>
                <td>{account.isAuthorized ? "Paid" : "Not Paid"}</td>
                <td>
                  <div
                    className={`${styles.toggleContainer} ${
                      account.isAuthorized ? styles.toggleContainerActive : ""
                    }`}
                    onClick={() => handleToggle(account.id)}
                  >
                    <div className={styles.toggleInfoInner}>
                      {account.isAuthorized ? "Deactivate" : "Activate"}
                    </div>
                    <div className={styles.toggleThumb}></div>
                  </div>
                </td>
                <td>
                  <DeleteIcon
                    onClick={() => handleDelete(account.id)}
                    aria-label="delete account"
                    className={styles.deleteIcon}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
