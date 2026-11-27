import { colorFor, thumb } from "../lib.js";

// The round profile picture. Logged-out visitors get a plain person icon. Everyone else gets their
// photo (sellers: the shop logo) or, if there is none, a coloured circle with their first letter.
export default function Avatar({ user, logo, big = false }) {
  const size = big ? " big" : "";
  if (!user) {
    return (
      <span className={"avatar guest" + size} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg>
      </span>
    );
  }
  const initial = (Array.from(user.name.trim())[0] || "?").toUpperCase();
  return (
    <span className={"avatar" + size} style={{ background: colorFor(user.name) }}>
      <span aria-hidden="true">{initial}</span>
      {logo && <img src={thumb(logo, big ? 160 : 100)} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
    </span>
  );
}
