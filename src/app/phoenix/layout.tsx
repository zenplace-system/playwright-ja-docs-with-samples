import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Oemahin - 不動産管理ダッシュボード",
  description: "不動産物件の管理、分析、取引履歴を表示するダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="flex h-screen bg-gray-100">{children}</div>
      </body>
    </html>
  );
}
