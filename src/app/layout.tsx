import type { Metadata, Viewport } from "next";
import "./generated.css";

export const metadata: Metadata = {
  title: "VieN - Nền Tảng Du Lịch & Di Sản Văn Hóa Tương Tác",
  description: "Một nền tảng · Nhiều điểm đến · Mỗi nơi một câu chuyện. Công nghệ giúp con người trải nghiệm văn hóa, không thay thế văn hóa.",
  keywords: ["VieN", "di sản Việt Nam", "Đình làng Hải Châu", "Ngũ Hành Sơn", "Đà Nẵng", "văn bia", "Hán Nôm", "sắc phong"],
  authors: [{ name: "VieN Heritage Team" }]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1A1615"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#FAF7F2] text-[#1A1615] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
