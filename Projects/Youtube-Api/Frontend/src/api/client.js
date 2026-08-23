const TOKEN_KEY = "opentube_token";
const USER_KEY = "opentube_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};
export const storeSession = (data) => {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      _id: data._id,
      channelName: data.channelName,
      email: data.email,
      phone: data.phone,
      logoUrl: data.logoUrl,
      logoId: data.logoId,
      subscribers: data.subscribers,
      subscribedChannels: data.subscribedChannels,
    })
  );
};
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Dev: "" → Vite proxy (/api → localhost:3000). Prod: set VITE_API_URL to your backend origin.
const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, { method = "GET", body, isForm } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let res;
  try {
    res = await fetch(`${BASE}/api/v1${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Network unreachable — check the backend is running and VITE_API_URL is set."
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Request failed (${res.status})`);
  }
  return data;
}

/* user */
export const signupUser = (formData) =>
  request("/user/signup", { method: "POST", body: formData, isForm: true });

export const loginUser = ({ email, password }) =>
  request("/user/login", { method: "POST", body: { email, password } });

export const updateProfile = (formData) =>
  request("/user/update-profile", { method: "PUT", body: formData, isForm: true });

export const subscribeToChannel = (channelId) =>
  request("/user/subscribe", { method: "POST", body: { channelId } });

/* video */
export const getVideosByCategory = (category) =>
  request(`/video/category/${encodeURIComponent(category)}`);

export const getVideosByTag = (tag) =>
  request(`/video/tags/${encodeURIComponent(tag)}`);

export const getMyVideos = () => request("/video/my-videos");

export const getVideoById = (id) => request(`/video/${id}`);

export const uploadVideo = (formData) =>
  request("/video/upload", { method: "POST", body: formData, isForm: true });

export const updateVideo = (id, formData) =>
  request(`/video/upload/${id}`, { method: "PUT", body: formData, isForm: true });

export const deleteVideo = (id) =>
  request(`/video/delete/${id}`, { method: "DELETE" });

export const likeVideo = (videoId) =>
  request("/video/like", { method: "POST", body: { videoId } });

export const dislikeVideo = (videoId) =>
  request("/video/dislike", { method: "POST", body: { videoId } });

/* comment */
export const getComments = (videoId) =>
  request(`/comment/comment/${videoId}`);

export const postComment = (video_id, commentText) =>
  request("/comment/new", { method: "POST", body: { video_id, commentText } });

export const editComment = (commentId, commentText) =>
  request(`/comment/${commentId}`, { method: "PUT", body: { commentText } });

export const removeComment = (commentId) =>
  request(`/comment/${commentId}`, { method: "DELETE" });
