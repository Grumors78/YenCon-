import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ROLES = { customer: "Buyer", vendor: "Seller", admin: "Admin" };

export default function Account() {
  const { user, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const f = new FormData(form);
    setError("");
    setDone(false);
    if (f.get("next") !== f.get("again")) return setError("The new passwords don't match.");
    setBusy(true);
    try {
      await changePassword(f.get("current"), f.get("next"));
      form.reset();
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <main className="wrap auth">
      <div className="auth-card">
        <h1>Your account</h1>
        <p>
          <strong>{user.name}</strong><br />
          <span className="meta">{user.email || user.phone} · {ROLES[user.role]}</span>
        </p>
        <button className="btn ghost" onClick={() => { logout(); navigate("/"); }}>Log out</button>
      </div>

      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Change password</h2>
        <label>Current password<input name="current" type="password" required autoComplete="current-password" /></label>
        <label>New password<input name="next" type="password" required minLength={8} maxLength={72} autoComplete="new-password" /></label>
        <label>Repeat new password<input name="again" type="password" required minLength={8} maxLength={72} autoComplete="new-password" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : "Change password"}</button>
        {done && <p className="form-ok" role="status">Password changed.</p>}
      </form>
    </main>
  );
}
