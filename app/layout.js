import { Toaster } from "react-hot-toast";
import Script from "next/script";
import "@/app/styles/global.css";
import {
  PoppinsBlack,
  PoppinsBold,
  PoppinsExtraBold,
  PoppinsExtraLight,
  PoppinsLight,
  PoppinsMedium,
  PoppinsRegular,
  PoppinsSemiBold,
  PoppinsThin,
} from "@/app/fonts/font";




export const metadata = {
  metadataBase: new URL("https://fxdelivery.vercel.app/"),
  title: "fxdelivery - Anywhere, Anytime – We Deliver the World to You!",
  applicationName: "fxdelivery",
  author: "fxdelivery",
  images:
    "https://raw.githubusercontent.com/DarknessMonarch/fxdelivery/refs/heads/master/public/assets/banner.png",
  description:
    "fxdelivery makes shipping across the globe easy, fast and reliable",
  metadataBase: new URL("https://fxdelivery.vercel.app/"),
  keywords: [
    "fxdelivery",
    "delivery",
    "shipping",
    "package delivey",
    "export",
    "import",
    "ship",
    "online delivery",
  ],
  openGraph: {
    title: "fxdelivery - Anywhere, Anytime – We Deliver the World to You!",
    description:
      "",
    url: "https://fxdelivery.vercel.app/",
    siteName: "fxdelivery",
    images:
      "https://raw.githubusercontent.com/DarknessMonarch/fxdelivery/refs/heads/master/public/assets/banner.png",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#11191fff" />
      </head>
      <body className={`
      ${PoppinsBlack.variable}
       ${PoppinsBold.variable} 
       ${PoppinsExtraBold.variable}
        ${PoppinsExtraLight.variable}
         ${PoppinsLight.variable} 
         ${PoppinsMedium.variable} 
         ${PoppinsRegular.variable} 
         ${PoppinsSemiBold.variable}
          ${PoppinsThin.variable}`}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: "",
            duration: 8000,
            style: {
              background: "#1a242c",
              color: "#c3f402ff",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
