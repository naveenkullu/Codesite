"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [posting, setPosting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState({ show: false, text: "", type: "ok" });

  const preview = useMemo(
    () => (code.trim() ? code : "// Your code will appear here..."),
    [code]
  );

  const showToast = (text, type = "ok") => {
    setToast({ show: true, text, type });
    window.setTimeout(() => {
      setToast({ show: false, text: "", type: "ok" });
    }, 2000);
  };

  const fetchPosts = async () => {
  if (!supabase) return;

  const { data, error } = await supabase
    .from("posts")
    .select("id, question, code, created_at")
    .order("created_at", { ascending: false });

  console.log(data, error);

  if (!error && data) {
    setAllPosts(data);
    setPosts(data.slice(0, 8));
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
  if (!supabase) {
    return showToast(
      "Supabase env missing",
      "error"
    );
  }

  if (!question.trim() || !code.trim()) {
    return showToast("Question and code are required", "error");
  }

  try {
    setPosting(true);

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          question: question.trim(),
          code: code.trim(),
        },
      ])
      .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    setPosting(false);

    if (error) {
      return showToast(error.message, "error");
    }

    const postId = data?.[0]?.id;

    setQuestion("");
    setCode("");

    await fetchPosts();

    showToast(`Posted successfully!`);

    if (postId) {
      window.location.href = `/post/${postId}`;
    }
  } catch (err) {
    console.log(err);
    setPosting(false);
    showToast("Something went wrong", "error");
  }
};

  return (
    <main className="page-wrap">
      <header className="site-header">
        <h1>CodePad Dark</h1>
        <p>Ask, paste, post, and share.</p>
      </header>

      <section className="app-shell">
        <div className="panel">
          <label className="label">Your Question</label>
          <input
            className="input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How do I optimize this loop?"
          />

          <div className="editor-header">
            <label className="label">Code Editor</label>
            <div className="btn-row">
              <button className="copy-btn" onClick={() => handleCopy()}>
                Copy Code
              </button>
              <button className="post-btn" onClick={handlePost} disabled={posting}>
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste or write your code here..."
            spellCheck={false}
          />
        </div>

        <div className="panel">
          <h2 className="preview-title">Styled Code Preview</h2>
          <pre className="code-preview">
            <code>{preview}</code>
          </pre>
        </div>
      </section>

      <section className="recent-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3>Recent Posts</h3>
          {allPosts.length > 8 && (
            <button 
              className="copy-btn" 
              onClick={() => {
                setShowAll(!showAll);
                setPosts(showAll ? allPosts.slice(0, 8) : allPosts);
              }}
              style={{ padding: "6px 12px", fontSize: "14px" }}
            >
              {showAll ? `Show Less (${allPosts.length})` : `Show All (${allPosts.length})`}
            </button>
          )}
        </div>
        <div className="cards">
          {posts.length === 0 ? (
            <p className="muted">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <Link href={`/post/${post.id}`} className="card" key={post.id}>
                <h4>{post.question}</h4>
                <p>{post.code.slice(0, 120)}{post.code.length > 120 ? "..." : ""}</p>
                <span>
                  {new Date(post.created_at).toLocaleString()}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>

      {toast.show && <div className={`toast ${toast.type}`}>{toast.text}</div>}
    </main>
  );
}
