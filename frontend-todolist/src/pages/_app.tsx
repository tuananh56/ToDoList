// pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Toaster hiển thị toàn cục */}
      <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} />
    </>
  );
}
