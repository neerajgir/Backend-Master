import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  const views = video.views ?? (video.viewedBy?.length || 0);
  const likes = video.likes ?? (video.likedBy?.length || 0);
  return (
    <Link to={`/watch/${video._id}`} className="card">
      <img
        className="thumb"
        src={video.thumbnailUrl}
        alt={`Thumbnail for ${video.title}`}
        loading="lazy"
      />
      <h3>{video.title}</h3>
      <div className="meta">
        {views} views · {likes} likes · {video.category}
      </div>
      {video.tags?.length > 0 && (
        <div className="tags">{video.tags.map((t) => `#${t}`).join(" ")}</div>
      )}
    </Link>
  );
}
