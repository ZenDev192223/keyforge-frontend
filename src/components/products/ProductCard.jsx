import { Link } from "react-router-dom";
import { imageUrl, money } from "../../utils/helpers";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const price = product.discount_price ?? product.price;
  return <article className="product-card">
    <Link to={`/products/${product.id}`} className="product-image">
      <img src={imageUrl(product.image_url)} alt={product.name} />
      {product.discount_price !== null && <span>Sale</span>}
      {product.stock <= 5 && product.stock > 0 && <span>Low stock</span>}
    </Link>
    <div className="product-info">
      <span className="muted">{product.brand} · {product.category}</span>
      <h3><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
      <div className="rating">★ {Number(product.rating).toFixed(1)} <span>({product.rating_count})</span></div>
      <div className="price-row"><div><b>{money(price)}</b>{product.discount_price !== null && <del>{money(product.price)}</del>}</div><button className="add-btn" disabled={!product.stock} onClick={() => add(product, 1)} aria-label={`Add ${product.name} to cart`}>+</button></div>
    </div>
  </article>;
}
