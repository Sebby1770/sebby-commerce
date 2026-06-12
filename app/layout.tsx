import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sebby Co. Commerce OS",
  description: "Ecommerce storefront and internal operations console."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
