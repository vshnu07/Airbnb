import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import LoginModal from "./components/modals/LoginModal";
import SearchModal from "./components/modals/SearchModal";
import SignupModal from "./components/modals/SignupModal";
import AddPropertyModal from "./components/modals/AddPropertyModal";
import FilterModal from "./components/modals/FilterModal";
import CheckoutModal from "./components/modals/CheckoutModal";
import ReviewModal from "./components/modals/ReviewModal";
import EditPropertyModal from "./components/modals/EditPropertyModal";
import PhotoGalleryModal from "./components/properties/PhotoGalleryModal";
import Toast from "./components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb | Vacation rentals, cabins, beach houses & more",
  description: "Find vacation rentals, cabins, beach houses, unique homes and experiences around the world on Airbnb.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900 antialiased`}>
        <Navbar />
        
        <div className="pt-28 flex-1">
          {children}
        </div>

        {/* Global Modals & Notifications */}
        <LoginModal />
        <SearchModal />
        <SignupModal />
        <AddPropertyModal />
        <FilterModal />
        <CheckoutModal />
        <ReviewModal />
        <EditPropertyModal />
        <PhotoGalleryModal />
        <Toast />
      </body>
    </html>
  );
}
