import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { thumb } from "../lib.js";
import { useFetch } from "../useFetch.js";

export default function Vendor() {
  const { id } = useParams();
  const shop = useFetch(`/vendors/${id}`);
  const prods = useFetch(`/products?vendor=${id}&limit=40`);
  const v = shop.data?.vendor;

  if (shop.loading) return <main className="wrap"><p className="state">Loading…</p></main>;
  if (shop.error || !v) {
    return (
      <main className="wrap empty">
        <h1>Shop not found</h1>
        <Link className="btn" to="/">Back to home</Link>
      </main>
    );
  }

  const items = prods.data?.items || [];
  const text = encodeURIComponent(`Hi ${v.shop}, I found your shop on Yen Con.`);

  return (
    <main className="wrap detail">
      <Link to="/" className="back">Back to products</Link>
      <section className="shop-head">
        {v.logo ? <img className="logo-preview" src={thumb(v.logo, 120)} alt="" /> : <div className="shop-logo" aria-hidden="true">{v.shop[0]}</div>}
        <div>
          <h1>{v.shop}</h1>
          <p className="meta">{v.town}{v.verified && <span className="verified"> · Verified vendor</span>}</p>
          {v.description && <p>{v.description}</p>}
        </div>
        <a className="btn wa" href={`https://wa.me/${v.whatsapp}?text=${text}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
      </section>
      <h2 className="section-title">{items.length} {items.length === 1 ? "product" : "products"}</h2>
      {prods.loading ? <p className="state">Loading products…</p> : <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
    </main>
  );
}
