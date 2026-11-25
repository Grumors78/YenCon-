// Talks to the Yen Con server. Set VITE_API_URL in a .env file when you deploy.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const KEY = "yencon-token";

export const getToken = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
export const setToken = (t) => {
  try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
};

export async function api(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error("Can't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Something went wrong.");
    err.status = res.status;
    throw err;
  }
  return data;
}

// Uploads a photo straight to Cloudinary using a one-time signature from our server.
export async function uploadImage(file) {
  const s = await api("/uploads/sign", { method: "POST" });
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", s.apiKey);
  form.append("timestamp", s.timestamp);
  form.append("signature", s.signature);
  form.append("folder", s.folder);
  form.append("allowed_formats", s.allowed_formats);
  let res;
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, { method: "POST", body: form });
  } catch {
    throw new Error("Photo upload failed. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.secure_url) throw new Error(data.error?.message || "Photo upload failed.");
  return data.secure_url;
}
