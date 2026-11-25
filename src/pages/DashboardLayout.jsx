import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { api } from "../api.js";
import "./dashboard.css";

export default function DashboardLayout() {
  const [shop, setShop] = useState(undefined); // undefined = still loading, null = no shop yet
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([api("/vendors/me"), api("/products/mine")]);
      setShop(s.vendor);
      setItems(p.items);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const links = [
    ["/dashboard", "Overview"],
    ["/dashboard/products", "Products"],
    ["/dashboard/products/new", "Add"],
    ["/dashboard/profile", "Shop"],
  ];

  return (
    <div className="dash">
      <nav className="dash-nav" aria-label="Vendor dashboard">
        {links.map(([to, label]) => <NavLink key={to} to={to} end>{label}</NavLink>)}
      </nav>
      <section className="dash-main">
        {error ? (
          <div className="empty"><h3>Could not load your shop</h3><p>{error}</p><button className="btn" onClick={load}>Try again</button></div>
        ) : shop === undefined ? (
          <p className="state">Loading…</p>
        ) : (
          <Outlet context={{ shop, items, reload: load }} />
        )}
      </section>
    </div>
  );
}
