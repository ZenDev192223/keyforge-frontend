import ProductCard from "./ProductCard";
export default function ProductGrid({products}){if(!products.length)return <div className="empty">No keyboards match those filters.</div>;return <div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>}
