"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import styles from "@/app/styles/payment.module.css";
import PaymentImage from "@/public/assets/payment.png";
import { FaWeightHanging as WeightIcon } from "react-icons/fa";
import {
  MdOutlinePlace as CountryIcon,
  MdAccountBalanceWallet as AccountIcon,
} from "react-icons/md";
import { IoCopy as CopyIcon, IoCheckbox as CopySuccess } from "react-icons/io5";
import { RiBankFill as BankIcon } from "react-icons/ri";

export default function Payment() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState({});

  const bankDetails = {
    totalPrice: searchParams.get("price") || "0.00",
    country: searchParams.get("country") || "Not specified",
    weight: searchParams.get("weight") || "Not available",
    bankName: "Global Shipping Bank",
    accountNumber: "1234-5678-9012-3456",
    accountName: "Fx Delivery Logistics Ltd",
  };

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied((prev) => ({ ...prev, [field]: true }));
      setTimeout(
        () => setCopied((prev) => ({ ...prev, [field]: false })),
        2000
      );
      toast.success(`${field} copied to clipboard!`);
    });
  };

  return (
    <div className={styles.paymentContainer}>
      <h1>Payment Details</h1>
      <div className={styles.accountCard}>
        <div className={styles.accountCardTop}>
          <Image
            className={styles.accountCardImage}
            src={PaymentImage}
            alt="Payment Illustration"
            layout="fill"
            objectFit="contain"
            quality={100}
            priority
          />
        </div>
        <div className={styles.accountCardBottom}>
          <div className={styles.accountCardNav}>
            <div className={styles.accountCardNavDetails}>
              <CountryIcon className={styles.accountCardNavDetailsIcon} />
              <span>{bankDetails.country}</span>
            </div>
            <div className={styles.accountCardNavDetailsSpan}>
              <WeightIcon className={styles.accountCardNavDetailsIcon} />
              <span>{bankDetails.weight}</span>
            </div>
          </div>
          <div className={styles.accountContent}>
            <h2>
              ${bankDetails.totalPrice}<span>/Total</span>
            </h2>
            <div className={styles.accountContentDetails}>
              <div className={styles.accountContentHeader}>
                <div className={styles.accountContentHeaderDetails}>
                  <BankIcon />
                  <h3>Bank Name</h3>
                </div>
                <p>{bankDetails.bankName}</p>
              </div>
            </div>

            <div className={styles.accountContentDetails}>
              <div className={styles.accountContentHeader}>
                <div className={styles.accountContentHeaderDetails}>
                  <BankIcon />
                  <h3>Account Name</h3>
                </div>
                <p>{bankDetails.accountName}</p>
              </div>

              <button
                className={styles.copyButton}
                onClick={() =>
                  handleCopy("Account Name", bankDetails.accountName)
                }
              >
                {copied["Account Name"] ? <CopySuccess /> : <CopyIcon />}
              </button>
            </div>
            <div className={styles.accountContentDetails}>
              <div className={styles.accountContentHeader}>
                <div className={styles.accountContentHeaderDetails}>
                  <AccountIcon />
                  <h3>Account Number</h3>
                </div>
                <p>{bankDetails.accountNumber}</p>
              </div>

              <button
                className={styles.copyButton}
                onClick={() =>
                  handleCopy("Account Number", bankDetails.accountNumber)
                }
              >
                {copied["Account Number"] ? <CopySuccess /> : <CopyIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p>
          Complete your payment by transferring the total amount to the account
          details above.
        </p>
      </div>
    </div>
  );
}
