import { useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { api, uploadImage } from "../api.js";
import { categories } from "../lib.js";

const MAX_PHOTOS = 5;
const MAX_MB = 5;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

// Used for both "Add product" and "Edit product" (when the address has an id).
export default function DashAddProduct() {
  const { shop, items, reload } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = id ? items.find((p) => p.id === id) : null;
  const [photos, setPhotos] = useState(() => (editing ? editing.images.map((url) => ({ url, file: null })) : []));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (id && !editing) {
    return <><h1>Product not found</h1><Link className="btn" to="/dashboard/products">Back to products</Link></>;
  }
  if (!shop) {
    return <><h1>Add product</h1><p>Set up your shop profile before adding products.</p><Link className="btn" to="/dashboard/profile">Set up my shop</Link></>;
  }

  function onPick(e) {
    const picked = Array.from(e.target.files);
    e.target.value = "";
    let msg = "";
    const ok = [];
    for (const file of picked) {
      if (!TYPES.includes(file.type)) msg = "Only JPG, PNG or WebP photos are allowed.";
      else if (file.size > MAX_MB * 1024 * 1024) msg = `Each photo must be under ${MAX_MB}MB.`;
      else ok.push({ file, url: URL.createObjectURL(file) });
    }
    const room = MAX_PHOTOS - photos.length;
    if (ok.length > room) msg = `You can add up to ${MAX_PHOTOS} photos.`;
    setPhotos((cur) => [...cur, ...ok.slice(0, room)]);
    setError(msg);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    setError("");
    setBusy(true);
    try {
      const urls = [];
      for (const p of photos) urls.push(p.file ? await uploadImage(p.file) : p.url);
      const body = { title: f.get("title"), price: Number(f.get("price")), category: f.get("category"), description: f.get("description"), images: urls };
      if (editing) await api(`/products/${editing.id}`, { method: "PUT", body: { ...body, soldOut: editing.soldOut } });
      else await api("/products", { method: "POST", body });
      await reload();
      navigate("/dashboard/products");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <>
      <h1>{editing ? "Edit product" : "Add product"}</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>Product name<input name="title" required minLength={2} maxLength={80} defaultValue={editing?.title} /></label>
        <label>Price (₦)<input name="price" type="number" min="1" step="1" required inputMode="numeric" defaultValue={editing?.price} /></label>
        <label>Category
          <select name="category" required defaultValue={editing?.category || ""}>
            <option value="" disabled>Choose a category</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Description<textarea name="description" rows={4} maxLength={500} defaultValue={editing?.description} /></label>

        <div>
          <span className="label-text">Photos ({photos.length}/{MAX_PHOTOS})</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onPick} disabled={photos.length >= MAX_PHOTOS || busy} />
          <div className="previews">
            {photos.map((p, i) => (
              <div key={p.url} className="preview">
                <img src={p.url} alt={`Photo ${i + 1}`} />
                <button type="button" onClick={() => setPhotos((cur) => cur.filter((x) => x.url !== p.url))} aria-label={`Remove photo ${i + 1}`}>×</button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : "Save product"}</button>
      </form>
    </>
  );
}
