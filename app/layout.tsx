import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitSync AI",
  description: "Analyze GitHub repository changes with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}