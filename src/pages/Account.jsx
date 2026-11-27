import { Link, useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useSaved } from "../context/SavedContext.jsx";

const ROLES = { customer: "Buyer", vendor: "Seller", admin: "Admin" };

// Opens when someone taps the profile picture in the header.
export default function Account() {
  const { user, loading, shopLogo, logout } = useAuth();
  const { ids } = useSaved();
  const navigate = useNavigate();
  const savedLabel = ids.length ? `Saved items (${ids.length})` : "Saved items";

  if (loading) return <main className="wrap profile"><p className="state">Loading…</p></main>;

  if (!user) {
    return (
      <main className="wrap profile">
        <div className="profile-head">
          <Avatar big />
          <div>
            <h1>Welcome to Yen Con</h1>
            <p className="meta">Log in or create an account.</p>
          </div>
        </div>
        <div className="profile-actions">
          <Link className="btn" to="/login">Log in</Link>
          <Link className="btn ghost" to="/signup">Create account</Link>
        </div>
        <ul className="menu">
          <li><Link to="/saved">{savedLabel}</Link></li>
          <li><Link to="/signup">Sell on Yen Con</Link></li>
        </ul>
      </main>
    );
  }

  return (
    <main className="wrap profile">
      <div className="profile-head">
        <Avatar user={user} logo={shopLogo} big />
        <div>
          <h1>{user.name}</h1>
          <p className="meta">{user.email || user.phone}</p>
          <span className="role-tag">{ROLES[user.role]}</span>
        </div>
      </div>

      {user.role === "vendor" && (
        <>
          <h2 className="menu-title">Your shop</h2>
          <ul className="menu">
            <li><Link to="/dashboard">Seller dashboard</Link></li>
            <li><Link to="/dashboard/products/new">Add a product</Link></li>
            <li><Link to="/dashboard/products">My products</Link></li>
            <li><Link to="/dashboard/profile">Shop profile</Link></li>
          </ul>
        </>
      )}

      <h2 className="menu-title">Account</h2>
      <ul className="menu">
        <li><Link to="/saved">{savedLabel}</Link></li>
        <li><Link to="/account/password">Change password</Link></li>
        <li><button className="danger" onClick={() => { logout(); navigate("/"); }}>Log out</button></li>
      </ul>
    </main>
  );
}
