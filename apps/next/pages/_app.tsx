import "raf/polyfill";
import "setimmediate";

import { Provider } from "app/provider";
import Head from "next/head";
import React from "react";

import "../global.css";
import { AppProps } from "next/app";
import { SUPABASE_CONNECTION_INFO } from "app/supabase-config";
import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  SUPABASE_CONNECTION_INFO.url,
  SUPABASE_CONNECTION_INFO.publickey
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>auth-crud-demo</title>
        <meta
          name="description"
          content="Expo + Next.js with Solito. By Fernando Rojo."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider clientProvider={() => supabaseClient}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
