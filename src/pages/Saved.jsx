import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { api } from "../api.js";
import { useSaved } from "../context/SavedContext.jsx";

export default function Saved() {
  const { ids } = useSaved();
  const [items, setItems] = useState(null);
  const key = ids.join(",");

  useEffect(() => {
    let live = true;
    // A product the vendor deleted just drops out of the list.
    Promise.all(ids.map((id) => api(`/products/${id}`).then((d) => d.product).catch(() => null)))
      .then((list) => live && setItems(list.filter(Boolean)));
    return () => { live = false; };
  }, [key]);

  return (
    <main className="wrap detail">
      <h1 className="section-title">Saved items</h1>
      {items === null ? (
        <p className="state">Loading…</p>
      ) : items.length ? (
        <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <div className="empty">
          <h3>Nothing saved yet</h3>
          <p>Tap "Save for later" on any product to keep it here.</p>
          <Link className="btn" to="/">Browse products</Link>
        </div>
      )}
    </main>
  );
}
