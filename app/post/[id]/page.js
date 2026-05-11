"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("id, question, code, created_at")
        .eq("id", params.id)
        .single();

      console.log("DATA:", data);
      console.log("ERROR:", error);

      setPost(data || null);
      setLoading(false);
    };

    load();
  }, [params.id]);

  const copy = async () => {
    if (!post?.code) return;

    await navigator.clipboard.writeText(post.code);

    setToast("Code copied successfully!");

    setTimeout(() => {
      setToast("");
    }, 1800);
  };

  if (loading) {
    return (
      <main className="page-wrap">
        <p className="muted">Loading post...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page-wrap">
        <p className="muted">Post not found.</p>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <header className="site-header">
        <h1>CodePad Dark</h1>
        <p>Shared post</p>
      </header>

      <section className="panel single-post">
        <div className="row-between">
          <h2>{post.question}</h2>

          <button className="copy-btn" onClick={copy}>
            Copy Code
          </button>
        </div>

        <pre className="code-preview">
          <code>{post.code}</code>
        </pre>

        <div className="row-between mt-12">
          <span className="muted">
            {new Date(post.created_at).toLocaleString()}
          </span>

          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </section>

      {toast && <div className="toast ok">{toast}</div>}
    </main>
  );
}