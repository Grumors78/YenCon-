import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { api } from "../api.js";
import { naira, colorFor, thumb } from "../lib.js";

export default function DashProducts() {
  const { items, reload } = useOutletContext();
  const [error, setError] = useState("");

  async function run(fn) {
    setError("");
    try { await fn(); await reload(); } catch (e) { setError(e.message); }
  }
  const toggleSold = (p) =>
    run(() => api(`/products/${p.id}`, {
      method: "PUT",
      body: { title: p.title, description: p.description, price: p.price, category: p.category, images: p.images, soldOut: !p.soldOut },
    }));
  const remove = (p) => window.confirm(`Delete "${p.title}"?`) && run(() => api(`/products/${p.id}`, { method: "DELETE" }));

  return (
    <>
      <div className="dash-top">
        <h1>My products</h1>
        <Link className="btn" to="/dashboard/products/new">Add product</Link>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}

      {items.length === 0 ? (
        <div className="empty"><h3>No products yet</h3><p>Add your first product so customers can find you.</p></div>
      ) : (
        <ul className="rows">
          {items.map((p) => (
            <li key={p.id} className="row">
              {p.images[0]
                ? <img className="thumb" src={thumb(p.images[0], 128)} alt="" />
                : <div className="thumb" style={{ background: colorFor(p.title) }} aria-hidden="true" />}
              <div className="row-info">
                <strong>{p.title}</strong>
                <span className="price">{naira(p.price)}</span>
                <span className={"status" + (p.soldOut || p.hidden ? " out" : "")}>
                  {p.hidden ? "Hidden by Yen Con" : p.soldOut ? "Sold out" : "In stock"}
                </span>
              </div>
              <div className="row-actions">
                <Link className="chip" to={`/dashboard/products/${p.id}/edit`}>Edit</Link>
                <button className="chip" onClick={() => toggleSold(p)}>{p.soldOut ? "Mark in stock" : "Mark sold out"}</button>
                <button className="chip danger" onClick={() => remove(p)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
