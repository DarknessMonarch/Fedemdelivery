"use client";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import { useSearchParams } from "next/navigation";
import styles from "@/app/styles/payment.module.css";
import PaymentImage from "@/public/assets/payment.png";
import { FaWeightHanging as WeightIcon } from "react-icons/fa";
import { MdOutlinePlace as CountryIcon } from "react-icons/md";
import { RiBankFill as BankIcon } from "react-icons/ri";

export default function Payment() {
  const { email } = useAuthStore(); 
  const searchParams = useSearchParams();
  const requestPayment = useAuthStore((state) => state.requestPayment);

  const [isLoading, setIsLoading] = useState(false);

  const dataDetails = {
    totalPrice: searchParams.get("price") || "0.00",
    country: searchParams.get("country") || "Not specified",
    weight: searchParams.get("weight") || "Not available",
    shipmentType: searchParams.get("shipmentMode") || "Not available",
  };

  const requestPaymentDetails = async () => {
    if (!email) {
      toast.error("You must be logged in to request payment details.");
      return;
    }


    setIsLoading(true);
    try {
      const paymentData = {
        email,
        ...dataDetails,
      };

      const result = await requestPayment(paymentData);
      if (result.success) {
        toast.success("Payment details requested successfully.");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while requesting payment details.");
    } finally {
      setIsLoading(false);
    }
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
              <span>{dataDetails.country}</span>
            </div>
            <div className={styles.accountCardNavDetailsSpan}>
              <WeightIcon className={styles.accountCardNavDetailsIcon} />
              <span>{dataDetails.weight}</span>
            </div>
          </div>
          <div className={styles.accountContent}>
            <h2>
              ${dataDetails.totalPrice}
              <span>/Total</span>
            </h2>
            <div className={styles.accountContentDetails}>
              <div className={styles.accountContentHeader}>
                <div className={styles.accountContentHeaderDetails}>
                  <BankIcon />
                  <h3>Request payment details</h3>
                </div>              
              </div>
              <button
                className={styles.formButton}
                onClick={requestPaymentDetails}
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : "Request"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p>Your payment details will be sent to your email address.</p>
      </div>
    </div>
  );
}