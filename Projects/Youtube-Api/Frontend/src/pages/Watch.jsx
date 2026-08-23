import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  dislikeVideo,
  getComments,
  getVideoById,
  likeVideo,
  postComment,
  removeComment,
  editComment,
  subscribeToChannel,
} from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { fmtDate, useToast } from "../components/util";

function CommentRow({ comment, me, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.commentText);
  const mine = comment.user_id?._id === me?._id;

  async function save() {
    await editComment(comment._id, text);
    setEditing(false);
    onChanged();
  }

  return (
    <article className="comment">
      <img
        className="avatar"
        src={comment.user_id?.logoUrl}
        alt=""
        loading="lazy"
      />
      <div className="comment-body">
        <div className="comment-head">
          <strong>{comment.user_id?.channelName ?? "unknown channel"}</strong>
          <span>{fmtDate(comment.createdAt)}</span>
          {mine && <span className="ok" style={{ color: "var(--color-accent)" }}>you</span>}
        </div>
        {editing ? (
          <>
            <textarea className="input" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="comment-tools">
              <button className="link-btn" onClick={save}>save</button>
              <button className="link-btn" onClick={() => { setEditing(false); setText(comment.commentText); }}>
                cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="comment-text">{comment.commentText}</p>
            {mine && (
              <div className="comment-tools">
                <button className="link-btn" onClick={() => setEditing(true)}>edit</button>
                <button
                  className="link-btn danger"
                  onClick={async () => {
                    await removeComment(comment._id);
                    onChanged();
                  }}
                >
                  delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}

export default function Watch() {
  const { id } = useParams();
  const { user, refreshUser, isAuthed } = useAuth();
  const { show, node: toastNode } = useToast();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState(false);

  const loadVideo = useCallback(async () => {
    try {
      setVideo(await getVideoById(id));
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    try {
      const data = await getComments(id);
      setComments(data.comments || []);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    if (!isAuthed) return;
    loadVideo();
    loadComments();
    window.scrollTo(0, 0);
  }, [isAuthed, loadVideo, loadComments]);

  if (!isAuthed) return null;
  if (error)
    return (
      <main className="page">
        <p className="form-error">{error}</p>
        <Link to="/">← back to feed</Link>
      </main>
    );
  if (!video)
    return (
      <main className="page">
        <p className="loading-line">buffering stream</p>
      </main>
    );

  const liked = user && video.likedBy?.includes(user._id);
  const disliked = user && video.disLikedBy?.includes(user._id);
  const subscribed = (user?.subscribedChannels || []).some(
    (c) => (c._id ?? c) === video.user_id
  );

  async function withBusy(fn) {
    if (busyAction) return;
    setBusyAction(true);
    try {
      await fn();
    } catch (err) {
      show(err.message, true);
    } finally {
      setBusyAction(false);
    }
  }

  const onLike = () =>
    withBusy(async () => {
      const res = await likeVideo(video._id);
      setVideo(res.video ?? (await getVideoById(id)));
      show("liked");
    });

  const onDislike = () =>
    withBusy(async () => {
      await dislikeVideo(video._id);
      setVideo(await getVideoById(id));
      show("feedback noted");
    });

  const onSubscribe = () =>
    withBusy(async () => {
      await subscribeToChannel(video.user_id);
      refreshUser({
        subscribedChannels: [...(user.subscribedChannels || []), video.user_id],
      });
      show("subscribed");
    });

  const onCommentSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    withBusy(async () => {
      await postComment(video._id, draft.trim());
      setDraft("");
      await loadComments();
      show("comment posted");
    });
  };

  return (
    <main className="page">
      {toastNode}
      <div className="watch-layout">
        <section aria-label="Video player">
          <video className="player" controls src={video.videoUrl} poster={video.thumbnailUrl}>
            Your browser can't play this format.
          </video>

          <h1 className="watch-title">{video.title}</h1>
          <p className="watch-meta">
            {video.views} views · published {fmtDate(video.createdAt)}
          </p>

          <div className="watch-actions">
            <button
              className={`btn${liked ? " is-on" : ""}`}
              onClick={onLike}
              disabled={busyAction}
              aria-pressed={liked}
            >
              ▲ like · {video.likes}
            </button>
            <button
              className={`btn${disliked ? " is-on" : ""}`}
              onClick={onDislike}
              disabled={busyAction}
              aria-pressed={disliked}
            >
              ▼ dislike · {video.dislikes}
            </button>
            {user._id !== video.user_id && (
              <span className="channel-line">
                <button
                  className={`btn btn-primary${subscribed ? " is-on" : ""}`}
                  onClick={onSubscribe}
                  disabled={busyAction || subscribed}
                >
                  {subscribed ? "subscribed ✓" : "subscribe"}
                </button>
              </span>
            )}
          </div>

          <h2
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-faint)",
              marginBottom: "var(--space-xs)",
            }}
          >
            description
          </h2>
          <p className="description">{video.description}</p>
        </section>

        <aside className="comments" aria-label="Comments">
          <h2>comments ({comments.length})</h2>
          <form onSubmit={onCommentSubmit} style={{ marginBottom: "var(--space-md)" }}>
            <label className="field" style={{ marginBottom: "var(--space-sm)" }}>
              <span>your comment</span>
              <textarea
                className="input"
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="echo 'nice one' >> comments"
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={busyAction}>
              post
            </button>
          </form>
          {comments.length === 0 && (
            <p className="empty">no comments yet — start the thread.</p>
          )}
          {comments.map((c) => (
            <CommentRow key={c._id} comment={c} me={user} onChanged={loadComments} />
          ))}
        </aside>
      </div>
    </main>
  );
}
