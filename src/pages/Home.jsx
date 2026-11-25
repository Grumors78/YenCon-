import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { categories, towns } from "../lib.js";
import { useFetch } from "../useFetch.js";

export default function Home() {
  const [query, setQuery] = useState("");
  const [q, setQ] = useState("");
  const [town, setTown] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // Wait until the visitor stops typing before searching.
  useEffect(() => {
    const t = setTimeout(() => { setQ(query.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const params = new URLSearchParams({ page });
  if (q) params.set("q", q);
  if (town) params.set("town", town);
  if (category) params.set("category", category);
  const { data, error, loading, reload } = useFetch(`/products?${params}`);
  const items = data?.items || [];

  const pick = (setter) => (v) => { setter(v); setPage(1); };

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <h1>Buy from vendors in your own state</h1>
          <p>Browse real products, then chat with the seller on WhatsApp to order.</p>
          <div className="search">
            <input type="search" placeholder="Search products" aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select aria-label="Town" value={town} onChange={(e) => pick(setTown)(e.target.value)}>
              <option value="">All towns</option>
              {towns.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="chips" role="group" aria-label="Categories">
          {["All", ...categories].map((c) => {
            const value = c === "All" ? "" : c;
            return (
              <button key={c} className={"chip" + (value === category ? " active" : "")} onClick={() => pick(setCategory)(value)}>{c}</button>
            );
          })}
        </div>

        {error ? (
          <div className="empty"><h3>Could not load products</h3><p>{error}</p><button className="btn" onClick={reload}>Try again</button></div>
        ) : loading && !data ? (
          <p className="state">Loading products…</p>
        ) : items.length === 0 ? (
          <div className="empty"><h3>No products found</h3><p>Try another town or category, or clear your search.</p></div>
        ) : (
          <>
            <h2 className="section-title">{data.total} {data.total === 1 ? "product" : "products"}</h2>
            <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            {data.pages > 1 && (
              <div className="pager">
                <button className="chip" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span className="meta">Page {data.page} of {data.pages}</span>
                <button className="chip" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
