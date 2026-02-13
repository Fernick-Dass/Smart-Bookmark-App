import Header from "../components/Header";
import BookmarkManager from "../components/BookmarkManager";
import React from "react";

export default function Page() {
  return (
    <>
      <Header />
      <section>
        <p className="mb-4 text-sm text-gray-600">
          Bookmarks are private to your account. Open another tab and sign in with the same account to see
          realtime sync.
        </p>
        <BookmarkManager />
      </section>
    </>
  );
}


