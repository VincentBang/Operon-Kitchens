import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import KitchenChatbot from '@/components/KitchenChatbot';
import PublicLayout from '@/components/PublicLayout';

function isPublicPage(pathname: string) {
  return !pathname.startsWith('/api') && !pathname.startsWith('/admin') && !pathname.startsWith('/auth') && !pathname.startsWith('/account');
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const publicPage = isPublicPage(router.pathname);
  const chatbotHiddenRoutes = ['/privacy', '/terms', '/request-review', '/contact'];
  const showChatbot = publicPage && !chatbotHiddenRoutes.includes(router.pathname);

  return (
    <>
      {publicPage ? (
        <PublicLayout>
          <Component {...pageProps} />
        </PublicLayout>
      ) : (
        <Component {...pageProps} />
      )}
      {showChatbot && <KitchenChatbot />}
    </>
  );
}

export default MyApp;
