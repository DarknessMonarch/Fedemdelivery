"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";
import { useRouter } from "next/navigation";

import {
  FaRegEye as ShowPasswordIcon,
  FaRegEyeSlash as HidePasswordIcon,
} from "react-icons/fa";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";

export default function SignUp() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [terms, setTerms] = useState(false);
  const router = useRouter();

  const register = useAuthStore((state) => state.register);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleTermsChange = (event) => {
    setTerms(event.target.checked);
    setTermsError("");
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "confirmPassword" || name === "password") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!terms) {
      setTermsError("You must accept the terms and conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;

      const result = await register(dataToSend);

      if (result.success) {
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        toast.success(result.message);
        router.push("/", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
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
          alt="Auth Background"
          layout="fill"
          quality={100}
          objectFit="cover"
          priority
        />
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div>
            <h1>Sign up</h1>
            <p>Enter your account details</p>
          </div>

          <div className={styles.authInput}>
            <UserNameIcon className={styles.authIcon} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
          </div>

          <div className={styles.authInput}>
            <EmailIcon className={styles.authIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>

          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
            <div onClick={() => togglePasswordVisibility("password")}>
              {showPassword ? (
                <ShowPasswordIcon className={styles.authIcon} />
              ) : (
                <HidePasswordIcon className={styles.authIcon} />
              )}
            </div>
          </div>

          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
            />
            <div onClick={() => togglePasswordVisibility("confirmPassword")}>
              {showConfirmPassword ? (
                <ShowPasswordIcon className={styles.authIcon} />
              ) : (
                <HidePasswordIcon className={styles.authIcon} />
              )}
            </div>
          </div>
          {passwordError && <p className={styles.errorText}>{passwordError}</p>}
          <div className={styles.formChange}>
            <div className={styles.termsContainer}>
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={handleTermsChange}
              />
              <label htmlFor="terms">Accept terms and conditions</label>
            </div>
            {termsError && <p className={styles.errorText}>{termsError}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.formAuthButton} ${
              isLoading ? styles.activeFormAuthButton : ""
            }`}
          >
            {isLoading ? <Loader /> : "Sign up"}
          </button>
          <h3>
            Already have an account?{" "}
            <span
              className={styles.btnLogin}
              onClick={() => router.push("login")}
            >
              Login
            </span>
          </h3>
        </form>
      </div>
    </div>
  );
}