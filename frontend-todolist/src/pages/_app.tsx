// pages/_app.tsx
import "../styles/globals.css"; // import CSS global ở đây
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
