import '../styles/globals.css';
import type { AppProps } from 'next/app';
import KitchenChatbot from '@/components/KitchenChatbot';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <KitchenChatbot />
    </>
  );
}

export default MyApp;
