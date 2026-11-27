import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api, uploadImage } from "../api.js";
import { towns, thumb } from "../lib.js";
import { useAuth } from "../context/AuthContext.jsx";

const TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function DashProfile() {
  const { shop, reload } = useOutletContext();
  const { setShopLogo } = useAuth();
  const [logo, setLogo] = useState({ url: shop?.logo || "", file: null });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  function onLogo(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!TYPES.includes(file.type)) return setError("Only JPG, PNG or WebP images are allowed.");
    if (file.size > 5 * 1024 * 1024) return setError("The logo must be under 5MB.");
    setError("");
    setLogo({ url: URL.createObjectURL(file), file });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    setError("");
    setDone(false);
    setBusy(true);
    try {
      const logoUrl = logo.file ? await uploadImage(logo.file) : logo.url;
      await api("/vendors/me", {
        method: "PUT",
        body: { shop: f.get("shop"), description: f.get("description"), town: f.get("town"), whatsapp: f.get("whatsapp"), logo: logoUrl },
      });
      await reload();
      setShopLogo(logoUrl); // keeps the profile picture in the header up to date
      setLogo({ url: logoUrl, file: null });
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <>
      <h1>Shop profile</h1>
      <form className="form" onSubmit={onSubmit} onChange={() => setDone(false)}>
        <div>
          <span className="label-text">Shop logo</span>
          {logo.url
            ? <img className="logo-preview" src={logo.file ? logo.url : thumb(logo.url, 150)} alt="Shop logo preview" />
            : <div className="shop-logo" aria-hidden="true">{(shop?.shop || "Y")[0]}</div>}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onLogo} disabled={busy} />
        </div>
        <label>Shop name<input name="shop" required minLength={2} maxLength={60} defaultValue={shop?.shop} /></label>
        <label>About your shop<textarea name="description" rows={3} maxLength={300} defaultValue={shop?.description} /></label>
        <label>Town
          <select name="town" required defaultValue={shop?.town || ""}>
            <option value="" disabled>Choose your town</option>
            {towns.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>WhatsApp number
          <input name="whatsapp" required inputMode="numeric" pattern="[0-9+ ]{10,16}" placeholder="2348012345678" defaultValue={shop?.whatsapp} />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
        {done && <p className="form-ok" role="status">Profile saved.</p>}
      </form>
    </>
  );
}
