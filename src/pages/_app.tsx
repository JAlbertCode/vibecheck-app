import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>VibeCheck - Match Your Community Vibes</title>
        <meta name="description" content="Create your community's vibe profile, match with others, and discover new collaboration possibilities with Lilypad's VibeCheck." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="font-['Space_Grotesk',sans-serif]">
        <Component {...pageProps} />
      </div>
    </>
  );
}
