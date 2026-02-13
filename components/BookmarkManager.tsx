"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
};

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState([] as Bookmark[]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [userId, setUserId] = useState(null as string | null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      if (!mounted) return;
      setUserId(currentUser?.id ?? null);
      if (currentUser) {
        await loadBookmarks(currentUser.id);
      }
    }

    init();

    const channel = supabase
      .channel("public:bookmarks")
    .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        (payload: any) => {
          handleRealtime(payload);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadBookmarks(currentUserId: string) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load bookmarks", error);
      return;
    }
    setBookmarks(data as Bookmark[]);
  }

  function handleRealtime(payload: any) {
    const ev = payload.eventType;
    const newRow = payload.new;
    const oldRow = payload.old;
    if (ev === "INSERT") {
      if (newRow.user_id === userId) {
        setBookmarks((prev: Bookmark[]) => [newRow, ...prev]);
      }
    } else if (ev === "DELETE") {
      if (oldRow.user_id === userId) {
        setBookmarks((prev: Bookmark[]) => prev.filter((b: Bookmark) => b.id !== oldRow.id));
      }
    } else if (ev === "UPDATE") {
      if (newRow.user_id === userId) {
        setBookmarks((prev: Bookmark[]) => prev.map((b: Bookmark) => (b.id === newRow.id ? newRow : b)));
      }
    }
  }

  async function addBookmark(e: any) {
    e.preventDefault();
    if (!userId) return alert("You must be signed in");
    if (!url || !title) return alert("Provide title and url");
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const { error } = await supabase.from("bookmarks").insert({
      title,
      url: normalizedUrl,
      user_id: userId
    });
    if (error) {
      console.error("Insert failed", error);
      alert("Failed to add bookmark");
      return;
    }
    setTitle("");
    setUrl("");
  }

  async function deleteBookmark(id: string) {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
      console.error("Delete failed", error);
      alert("Failed to delete");
    }
  }

  return (
    <div>
      <form onSubmit={addBookmark} className="mb-6 space-y-2">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="Title"
            className="flex-1 px-3 py-2 border rounded"
          />
          <input
            value={url}
            onChange={(e: any) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-2 px-3 py-2 border rounded"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
        </div>
      </form>

      <div className="space-y-3">
        {bookmarks.length === 0 && <div className="text-sm text-gray-500">No bookmarks yet.</div>}
        {bookmarks.map((b: Bookmark) => (
          <div key={b.id} className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
            <div>
              <a href={b.url} target="_blank" rel="noreferrer" className="font-medium text-blue-600">
                {b.title}
              </a>
              <div className="text-xs text-gray-500">{b.url}</div>
            </div>
            <div>
              <button onClick={() => deleteBookmark(b.id)} className="text-red-600 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


