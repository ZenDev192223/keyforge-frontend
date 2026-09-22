import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import { imageUrl, money } from "../utils/helpers";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const { add } = useCart();

  useEffect(() => {
    api.products.get(id).then(setProduct).catch((err) => { setProduct(false); setError(err.message); });
  }, [id]);

  if (product === null) return <div className="loading page-pad">Loading product…</div>;
  if (product === false) return <div className="empty page-pad"><h2>Product not found.</h2><p>{error}</p><Link className="btn primary" to="/shop">Back to shop</Link></div>;

  const price = product.discount_price ?? product.price;
  const maxQty = Math.max(1, product.stock);

  return (
    <div className="detail-page">
      <Link to="/shop" className="back">← Back to shop</Link>
      <div className="detail-grid">
        <div className="detail-image"><img src={imageUrl(product.image_url)} alt={product.name} /></div>
        <div className="detail-copy">
          <p className="eyebrow">{product.brand} · {product.category}</p>
          <h1>{product.name}</h1>
          <div className="rating big">★ {Number(product.rating).toFixed(1)} <span>{product.rating_count} ratings</span></div>
          <div className="detail-price">
            {money(price)} {product.discount_price !== null && <del>{money(product.price)}</del>}
          </div>
          <p className="description">{product.description}</p>

          <div className="specs">
            {[["Switch", product.switch_type], ["Layout", product.layout], ["Connectivity", product.connectivity], ["Availability", product.stock > 0 ? `${product.stock} in stock` : "Out of stock"]].map(([label, value]) => (
              <div key={label}><span>{label}</span><b>{value || "—"}</b></div>
            ))}
          </div>

          {product.stock > 0 && (
            <div className="buy-row">
              <div className="qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <b>{qty}</b>
                <button onClick={() => setQty(Math.min(maxQty, qty + 1))}>+</button>
              </div>
              <button className="btn primary grow" onClick={() => add(product, qty)}>Add {qty > 1 ? `${qty} to cart` : "to cart"}</button>
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && <p className="stock-note">Only {product.stock} left in stock.</p>}
        </div>
      </div>
    </div>
  );
}
