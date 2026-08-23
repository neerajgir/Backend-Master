import { useEffect, useState } from "react";
import { getVideosByCategory, getVideosByTag } from "../api/client";
import VideoCard from "../components/VideoCard";

const CATEGORIES = ["Music", "Gaming", "Tech", "Education", "Podcast", "News"];

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [active, setActive] = useState(CATEGORIES[0]);
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    Promise.all(CATEGORIES.map((c) => getVideosByCategory(c).catch(() => [])))
      .then((groups) => {
        if (cancelled) return;
        const seen = new Set();
        setVideos(
          groups
            .flat()
            .filter((v) => v?._id && !seen.has(v._id) && seen.add(v._id))
        );
        setStatus("done");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  async function onTagSubmit(e) {
    e.preventDefault();
    const t = tag.trim();
    if (!t) return;
    setActive(null);
    setStatus("loading");
    try {
      setVideos(await getVideosByTag(t));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  async function pickCategory(c) {
    setActive(c);
    setStatus("loading");
    try {
      setVideos(await getVideosByCategory(c));
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="page">
      <h1 className="prompt">
        <span className="ps1">opentube:~$</span>ls
        <span className="arg"> --category={active ?? "all"}</span>
      </h1>

      <form onSubmit={onTagSubmit} style={{ marginBottom: "var(--space-lg)" }}>
        <label className="visually-hidden" htmlFor="tag-q" style={{ position: "absolute", left: "-9999px" }}>
          Search by tag
        </label>
        <div style={{ display: "flex", gap: "var(--space-sm)", maxWidth: 420 }}>
          <input
            id="tag-q"
            className="input"
            placeholder="grep tags — try #lofi"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <button type="submit" className="btn">
            grep
          </button>
        </div>
      </form>

      <div className="chips" role="group" aria-label="Categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className="chip"
            aria-pressed={active === c}
            onClick={() => pickCategory(c)}
          >
            {c.toLowerCase()}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <p className="loading-line" role="status">
          reading directory
        </p>
      )}
      {status === "error" && (
        <p className="form-error">backend unreachable — start it with `npm run dev`</p>
      )}
      {status === "done" && videos.length === 0 && (
        <p className="empty">
          nothing here yet — upload the first video in this category.
        </p>
      )}
      {videos.length > 0 && (
        <section className="grid" aria-label="Videos">
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </section>
      )}
    </main>
  );
}
