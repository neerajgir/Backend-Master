import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteVideo,
  getMyVideos,
  updateVideo,
} from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { fmtDate, useToast } from "../components/util";

function EditForm({ video, onDone, onCancel }) {
  const formRef = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await updateVideo(video._id, new FormData(formRef.current));
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} style={{ marginTop: "var(--space-sm)" }}>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <label className="field">
        <span>title</span>
        <input className="input" name="title" defaultValue={video.title} required />
      </label>
      <label className="field">
        <span>description</span>
        <textarea className="input" name="description" defaultValue={video.description} rows={3} />
      </label>
      <label className="field">
        <span>category</span>
        <input className="input" name="category" defaultValue={video.category} />
      </label>
      <label className="field">
        <span>tags — comma separated</span>
        <input className="input" name="tags" defaultValue={(video.tags || []).join(",")} />
      </label>
      <label className="field">
        <span>replace thumbnail (optional)</span>
        <input className="input" type="file" name="thumbnail" accept="image/*" />
      </label>
      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "saving…" : "save"}
        </button>
        <button className="btn" type="button" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  );
}

export default function Studio() {
  const { user } = useAuth();
  const { show, node: toastNode } = useToast();
  const [videos, setVideos] = useState(null);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    try {
      setVideos(await getMyVideos());
    } catch (err) {
      show(err.message, true);
      setVideos([]);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDelete(v) {
    if (!window.confirm(`rm "${v.title}"? This can't be undone.`)) return;
    try {
      await deleteVideo(v._id);
      show("deleted");
      load();
    } catch (err) {
      show(err.message, true);
    }
  }

  return (
    <main className="page">
      {toastNode}
      <h1 className="prompt">
        <span className="ps1">{user.channelName}:~$</span>ls
        <span className="arg"> --mine</span>
      </h1>

      {videos === null && (
        <p className="loading-line" role="status">
          listing uploads
        </p>
      )}
      {Array.isArray(videos) && videos.length === 0 && (
        <p className="empty">
          no uploads yet. <Link to="/upload">push your first video →</Link>
        </p>
      )}
      {videos?.map((v) => (
        <article key={v._id} className="studio-row">
          <img className="studio-thumb" src={v.thumbnailUrl} alt="" loading="lazy" />
          <div style={{ minWidth: 0 }}>
            {editingId === v._id ? (
              <EditForm
                video={v}
                onCancel={() => setEditingId(null)}
                onDone={() => {
                  setEditingId(null);
                  show("saved");
                  load();
                }}
              />
            ) : (
              <>
                <div className="studio-title">{v.title}</div>
                <div className="studio-meta">
                  {v.views} views · {v.likes} likes · {v.dislikes} dislikes ·{" "}
                  {v.category} · uploaded {fmtDate(v.createdAt)}
                </div>
                <Link to={`/watch/${v._id}`}>open →</Link>
              </>
            )}
          </div>
          {editingId !== v._id && (
            <div className="row-actions">
              <button className="btn" onClick={() => setEditingId(v._id)}>
                edit
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(v)}>
                delete
              </button>
            </div>
          )}
        </article>
      ))}
    </main>
  );
}
