import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../api/client";
import { useToast } from "../components/util";

export default function Upload() {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { show, node: toastNode } = useToast();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const fd = new FormData(formRef.current);
      await uploadVideo(fd);
      show("video uploaded");
      setTimeout(() => navigate("/studio"), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      {toastNode}
      <h1 className="prompt">
        <span className="ps1">opentube:~$</span>upload
        <span className="arg"> --new</span>
      </h1>

      <div className="panel" style={{ margin: 0, maxWidth: 560 }}>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <form ref={formRef} onSubmit={onSubmit}>
          <label className="field">
            <span>title</span>
            <input className="input" name="title" required maxLength={120} />
          </label>
          <label className="field">
            <span>description</span>
            <textarea className="input" name="description" required rows={4} />
          </label>
          <label className="field">
            <span>category</span>
            <input className="input" name="category" required placeholder="Music, Gaming, Tech…" />
          </label>
          <label className="field">
            <span>tags — comma separated</span>
            <input className="input" name="tags" placeholder="lofi,mix,study" />
          </label>
          <label className="field">
            <span>video file</span>
            <input className="input" type="file" name="video" accept="video/*" required />
          </label>
          <label className="field">
            <span>thumbnail image</span>
            <input className="input" type="file" name="thumbnail" accept="image/*" required />
          </label>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "pushing to cloud…" : "publish video"}
          </button>
        </form>
      </div>
    </main>
  );
}
