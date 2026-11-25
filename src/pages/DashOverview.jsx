import { Link, useOutletContext } from "react-router-dom";

export default function DashOverview() {
  const { shop, items } = useOutletContext();
  const soldOut = items.filter((p) => p.soldOut).length;

  if (!shop) {
    return (
      <>
        <h1>Welcome to Yen Con</h1>
        <p>Set up your shop profile first, then you can add products.</p>
        <Link className="btn" to="/dashboard/profile">Set up my shop</Link>
      </>
    );
  }
  return (
    <>
      <h1>Dashboard</h1>
      <p className="meta">Welcome back, {shop.shop}{shop.verified ? " (verified)" : ""}</p>
      <div className="stats">
        <div className="stat"><strong>{items.length}</strong><span>Total products</span></div>
        <div className="stat"><strong>{items.length - soldOut}</strong><span>In stock</span></div>
        <div className="stat"><strong>{soldOut}</strong><span>Sold out</span></div>
      </div>
      <Link className="btn" to="/dashboard/products/new">Add a product</Link>
    </>
  );
}
