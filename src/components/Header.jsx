import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

// Just the logo and the profile picture. Everything else lives on the profile page.
export default function Header() {
  const { user, shopLogo } = useAuth();
  return (
    <header className="header">
      <div className="wrap">
        <Link to="/" className="logo">Yen<span>Con</span></Link>
        <Link to="/account" className="avatar-link" aria-label={user ? "Your profile and settings" : "Log in or sign up"}>
          <Avatar user={user} logo={shopLogo} />
        </Link>
      </div>
    </header>
  );
}
