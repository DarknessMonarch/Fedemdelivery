"use client";

import Image from "next/image";
import toast from "react-hot-toast";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";

import { MdOutlineEmail as EmailIcon } from "react-icons/md";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const router = useRouter();
  const requestPasswordReset = useAuthStore(
    (state) => state.requestPasswordReset
  );



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const result = await requestPasswordReset(email);
      if (result.success) {
        toast.success(
          result.message || "Reset link sent, please check your email."
        );
      } else {
        toast.error(result.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authComponent}>
      <div className={styles.authComponentBgImage}>
        <Image
          className={styles.authImage}
          src={auth1Image}
          alt="auth image"
          layout="fill"
          quality={100}
          objectFit="cover"
          priority
        />
    
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1>Forgot password</h1>
            <p>Enter your email to get reset link</p>
          </div>

          <div className={styles.authInput}>
            <EmailIcon className={styles.authIcon} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className={styles.authBottomBtn}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Request password reset"}
            </button>
          </div>
          <h3>
            Don&apos;t have an account?{" "}
            <div
              className={styles.btnLogin}
              onClick={() => router.push("signup", { scroll: false })}
            >
              Sign up
            </div>
          </h3>
        </form>
      </div>
    </div>
  );
}
