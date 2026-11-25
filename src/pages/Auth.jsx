import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth({ mode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    setError("");
    setBusy(true);
    try {
      const user = isSignup
        ? await signup({ name: f.get("name"), login: f.get("login"), password: f.get("password"), role })
        : await login(f.get("login"), f.get("password"));
      navigate(user.role === "vendor" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="wrap auth">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>{isSignup ? "Create your account" : "Log in"}</h1>

        {isSignup && (
          <>
            <label>Full name<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
            <fieldset className="roles">
              <legend>I want to</legend>
              <label><input type="radio" name="role" checked={role === "customer"} onChange={() => setRole("customer")} /> Buy products</label>
              <label><input type="radio" name="role" checked={role === "vendor"} onChange={() => setRole("vendor")} /> Sell products</label>
            </fieldset>
          </>
        )}

        <label>Email or phone number<input name="login" required autoComplete="username" /></label>
        <label>Password<input name="password" type="password" required minLength={8} maxLength={72} autoComplete={isSignup ? "new-password" : "current-password"} /></label>

        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}
        </button>
        <p>
          {isSignup ? "Already have an account? " : "New to Yen Con? "}
          <Link className="verified" to={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link>
        </p>
      </form>
    </main>
  );
}
