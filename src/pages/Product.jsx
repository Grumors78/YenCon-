import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { naira, colorFor, thumb } from "../lib.js";
import { useFetch } from "../useFetch.js";
import { useSaved } from "../context/SavedContext.jsx";

export default function Product() {
  const { id } = useParams();
  const { ids, toggle } = useSaved();
  const { data, error, loading } = useFetch(`/products/${id}`);
  const product = data?.product;
  const related = useFetch(product ? `/products?category=${encodeURIComponent(product.category)}&limit=5` : null);
  const [pic, setPic] = useState(0);
  useEffect(() => setPic(0), [id]);

  if (loading) return <main className="wrap"><p className="state">Loading…</p></main>;
  if (error || !product) {
    return (
      <main className="wrap empty">
        <h1>Product not found</h1>
        <p>{error || "It may have been removed by the vendor."}</p>
        <Link className="btn" to="/">Back to home</Link>
      </main>
    );
  }

  const v = product.vendor;
  const saved = ids.includes(product.id);
  const text = encodeURIComponent(`Hi ${v.shop}, I saw "${product.title}" on Yen Con. Is it available?`);
  const more = (related.data?.items || []).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="wrap detail">
      <Link to="/" className="back">Back to products</Link>
      <div className="detail-grid">
        <div>
          <div className="detail-img" style={{ background: colorFor(product.title) }}>
            {product.images[pic] ? <img src={thumb(product.images[pic], 900)} alt={product.title} /> : <span aria-hidden="true">{product.title[0]}</span>}
          </div>
          {product.images.length > 1 && (
            <div className="thumbs">
              {product.images.map((u, i) => (
                <button key={u} className={i === pic ? "on" : ""} onClick={() => setPic(i)} aria-label={`Photo ${i + 1}`}>
                  <img src={thumb(u, 120)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-info">
          <span className="meta">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="price big">{naira(product.price)}</p>
          {product.soldOut && <span className="tag">Sold out</span>}
          {product.description && <p>{product.description}</p>}
          <Link to={`/vendor/${v.id}`} className="vendor-card">
            <strong>{v.shop}</strong>
            <span className="meta">{v.town}{v.verified && <span className="verified"> · Verified vendor</span>}</span>
          </Link>
          <a className="btn wa" href={`https://wa.me/${v.whatsapp}?text=${text}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
          <button className="btn ghost" aria-pressed={saved} onClick={() => toggle(product.id)}>{saved ? "Saved ✓" : "Save for later"}</button>
          <p className="meta">Agree on price, delivery and payment directly with the vendor.</p>
        </div>
      </div>

      {more.length > 0 && (
        <>
          <h2 className="section-title">More in {product.category}</h2>
          <div className="grid">{more.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </>
      )}
    </main>
  );
}
