import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AccountPassword() {
  const { changePassword } = useAuth();
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
      <Link to="/account" className="back">Back to profile</Link>
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Change password</h1>
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
