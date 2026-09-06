import "./globals.css";

export const metadata = {
  title: "স্বপ্নযাত্রা-২১ | Swapnajatra SSC 2021",
  description:
    "নিশ্চিন্তপুর উচ্চ বিদ্যালয়ের ২০২১ সালের এসএসসি পরীক্ষার্থীদের সংগঠন — স্বপ্নযাত্রা-২১",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}