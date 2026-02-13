import "../styles/globals.css";
import React from "react";

export const metadata = {
  title: "Smart Bookmark",
  description: "Simple bookmark manager with Supabase + Next.js"
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}


