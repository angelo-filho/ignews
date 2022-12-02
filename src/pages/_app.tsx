import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Header } from "../components/Header";
import { Analytics } from "@vercel/analytics/react";

import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
      <Analytics />
    </SessionProvider>
  );
}

export default MyApp;
