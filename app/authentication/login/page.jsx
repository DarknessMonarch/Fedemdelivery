"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";

import {
  FaRegEye as ShowPasswordIcon,
  FaRegEyeSlash as HidePasswordIcon,
} from "react-icons/fa";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        setFormData({ email: "", password: "" });
        const isAdmin = useAuthStore.getState().isAdmin;

        if (isAdmin) {
          toast.success("Welcome Admin!");
          router.push("/page/dashboard", { scroll: false });
        } else {
          router.push("/", { scroll: false });
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

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
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1>Login</h1>
            <p>Enter your account details</p>
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
            <button
              type="button"
              className={styles.showBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <ShowPasswordIcon className={styles.authIcon} />
              ) : (
                <HidePasswordIcon className={styles.authIcon} />
              )}
            </button>
          </div>

          <div className={styles.formChange}>
            <span onClick={() => router.push("forgot")}>Forgot Password</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.formAuthButton} ${
              isLoading ? styles.activeFormAuthButton : ""
            }`}
          >
            {isLoading ? <Loader /> : "Login"}
          </button>
          <h3>
            Don&apos;t have an account?{" "}
            <span
              className={styles.btnLogin}
              onClick={() => router.push("signup")}
            >
              Sign up
            </span>
          </h3>
        </form>
      </div>
    </div>
  );
}
