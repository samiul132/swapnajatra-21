import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - var(--nav-h) - 280px)" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}