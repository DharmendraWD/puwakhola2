
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "../components/toast/ToastProvider";
import Footer from "@/components/Misc/Footer/Footer";

import localFont from "next/font/local";
import AOSInit from "@/components/AOSInit";
import Navbar from "@/components/Header/Navbar/Navbar";


const myFont = localFont({
  src: "../../src/font/SatoshiRegular.otf",
  variable: "--font-myfont",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Puwakhola | Clean Hydropower & Renewable Energy Provider",
  description:
    "Puwakhola is a leading hydropower company generating and supplying clean, renewable electricity. We deliver reliable, sustainable energy solutions that support Nepal’s growth and contribute to a greener future.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en"  className={myFont.variable}>
      <body
        className={`${myFont.variable}`}
      >
        {/* <Navbar></Navbar> */}
        <ToastProvider />
        <AOSInit />
        {children}
        {/* <Footer></Footer> */}
      </body>
    </html>
  );
}
