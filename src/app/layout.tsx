import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMS - UCBC",
  description: "Student Management System",
};

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#008367",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}  antialiased`}>
        <ConfigProvider theme={themeConfig}>
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
