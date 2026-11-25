import { Link } from "react-router-dom";
import { useSaved } from "../context/SavedContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { ids } = useSaved();
  const { user } = useAuth();
  return (
    <header className="header">
      <div className="wrap">
        <Link to="/" className="logo">Yen<span>Con</span></Link>
        <nav className="nav" aria-label="Main">
          <Link to="/saved">Saved{ids.length > 0 && ` (${ids.length})`}</Link>
          <Link to={user ? "/account" : "/login"}>{user ? "Account" : "Log in"}</Link>
          <Link to="/dashboard" className="btn">Sell</Link>
        </nav>
      </div>
    </header>
  );
}
