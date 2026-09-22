import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import ProductGrid from "../components/products/ProductGrid";

const categories = [
  ["mechanical", "01", "Mechanical", "Built for feel and customization."],
  ["wireless", "02", "Wireless", "Clean desks without the cable clutter."],
  ["gaming", "03", "Gaming", "Fast response for competitive sessions."],
  ["ergonomic", "04", "Ergonomic", "Comfort-focused layouts for long days."],
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.products.list({ featured: true, limit: 4 })
      .then((result) => setFeatured(result.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">KEYBOARDS · SWITCHES · SETUPS</p>
          <h1>Build a setup<br /><em>worth typing on.</em></h1>
          <p className="hero-text">
            Explore mechanical, wireless, gaming, membrane and ergonomic keyboards selected for different hands, desks and budgets.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/shop">Shop keyboards</Link>
            <Link className="btn ghost" to="/shop?category=mechanical">Browse mechanical</Link>
          </div>
          <div className="hero-stats">
            <span><b>10+</b> keyboards</span>
            <span><b>5</b> categories</span>
            <span><b>100+</b> stock-ready units</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="keyboard-visual">
            <div className="keyboard-top"><span>ESC</span><span>F1</span><span>F2</span><span>F3</span><span>F4</span><span>F5</span><span>F6</span><span>F7</span></div>
            <div className="keyboard-row"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <div className="keyboard-row wide"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <div className="keyboard-row"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <div className="keyboard-row bottom"><i></i><i></i><i className="space"></i><i></i><i></i><i></i></div>
          </div>
          <div className="floating-note">TYPE<br /><b>BETTER.</b></div>
        </div>
      </section>

      <section className="section intro-section">
        <div className="split-heading">
          <div>
            <p className="eyebrow">START HERE</p>
            <h2>Pick your kind of keyboard.</h2>
          </div>
          <p>Whether you want a quiet office board or a tactile gaming setup, filter the catalog by the features that matter.</p>
        </div>
        <div className="category-grid">
          {categories.map(([slug, number, title, text]) => (
            <Link className="category-card" key={slug} to={`/shop?category=${slug}`}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-head">
          <div><p className="eyebrow">CURATED PICKS</p><h2>Featured keyboards</h2></div>
          <Link to="/shop">View all →</Link>
        </div>
        {error ? <div className="error">{error}</div> : <ProductGrid products={featured} />}
      </section>

      <section className="service-strip">
        <div><b>01</b><span>Easy checkout</span><small>Place an order without creating an account.</small></div>
        <div><b>02</b><span>Live stock checks</span><small>Availability is validated by the backend at checkout.</small></div>
        <div><b>03</b><span>Order tracking</span><small>Use your order number to check status anytime.</small></div>
      </section>
    </>
  );
}
