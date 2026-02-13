"use client";

import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-semibold">Smart Bookmark</h1>
      <AuthButton />
    </header>
  );
}


