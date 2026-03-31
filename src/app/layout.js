import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "স্বপ্নযাত্রা-২১ | Swapnajatra SSC 2021",
  description:
    "নিশ্চিন্তপুর উচ্চ বিদ্যালয়ের ২০২১ সালের এসএসসি পরীক্ষার্থীদের সংগঠন — স্বপ্নযাত্রা-২১",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <Header />
        <main style={{ minHeight: "calc(100vh - var(--nav-h) - 280px)" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}