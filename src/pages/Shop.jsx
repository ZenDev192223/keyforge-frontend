import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ProductGrid from "../components/products/ProductGrid";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const category = params.get("category") || "";
  const brand = params.get("brand") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "newest";
  const maxPrice = params.get("maxPrice") || "";

  useEffect(() => {
    Promise.all([api.products.categories(), api.products.brands()])
      .then(([cats, brandList]) => { setCategories(cats); setBrands(brandList); })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.products.list({ category, brand, search, sort, maxPrice, limit: 100 })
      .then((result) => setProducts(result.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, brand, search, sort, maxPrice]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  };

  return (
    <>
      <div className="page-title shop-title">
        <div><p className="eyebrow">THE COLLECTION</p><h1>Find your board.</h1></div>
        <p>Search the catalog by category, brand, price or name.</p>
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <div className="filter-group">
            <label>Search</label>
            <input value={search} onChange={(e) => setFilter("search", e.target.value)} placeholder="Keyboard, brand..." />
          </div>

          <div className="filter-group">
            <label>Category</label>
            {categories.map((item) => (
              <button className={category === item.category ? "filter-active" : ""} key={item.category} onClick={() => setFilter("category", category === item.category ? "" : item.category)}>
                <span>{item.category}</span><small>{item.count}</small>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <label>Brand</label>
            {brands.map((item) => (
              <button className={brand === item.brand ? "filter-active" : ""} key={item.brand} onClick={() => setFilter("brand", brand === item.brand ? "" : item.brand)}>
                <span>{item.brand}</span><small>{item.count}</small>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <label>Price</label>
            <select value={maxPrice} onChange={(e) => setFilter("maxPrice", e.target.value)}>
              <option value="">Any price</option>
              <option value="50">Under $50</option>
              <option value="100">Under $100</option>
              <option value="150">Under $150</option>
              <option value="200">Under $200</option>
            </select>
          </div>

          <button className="clear-btn" onClick={() => setParams({})}>Clear all filters</button>
        </aside>

        <section className="products-area">
          <div className="toolbar">
            <span><b>{products.length}</b> products</span>
            <select value={sort} onChange={(e) => setFilter("sort", e.target.value)}>
              <option value="newest">Newest</option>
              <option value="rating">Top rated</option>
              <option value="name">Name</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          {loading ? <div className="loading">Loading keyboards…</div> : <ProductGrid products={products} />}
        </section>
      </div>
    </>
  );
}
