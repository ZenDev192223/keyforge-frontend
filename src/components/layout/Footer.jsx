import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div>
        <strong>KEYFORGE</strong>
        <span>Keyboards for work, play and everything between.</span>
      </div>
      <div className="footer-links">
        <Link to="/shop">Shop</Link>
        <Link to="/track">Track an order</Link>
      </div>
      <span>© {new Date().getFullYear()} Keyforge</span>
    </footer>
  );
}
