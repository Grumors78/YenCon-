import { Link } from "react-router-dom";
import { naira, colorFor, thumb } from "../lib.js";

export default function ProductCard({ product }) {
  const v = product.vendor;
  const photo = product.images[0];
  return (
    <Link to={`/product/${product.id}`} className={"pcard" + (product.soldOut ? " sold" : "")}>
      <div className="pimg" style={{ background: colorFor(product.title) }}>
        {photo ? <img src={thumb(photo, 400)} alt={product.title} loading="lazy" /> : <span aria-hidden="true">{product.title[0]}</span>}
      </div>
      <div className="pbody">
        <h3>{product.title}</h3>
        <span className="price">{naira(product.price)}</span>
        {product.soldOut && <span className="tag">Sold out</span>}
        {v && (
          <span className="meta">
            {v.shop} · {v.town}
            {v.verified && <span className="verified"> · Verified</span>}
          </span>
        )}
      </div>
    </Link>
  );
}
