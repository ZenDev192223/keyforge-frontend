import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="header">
      <Link to="/" className="logo" aria-label="Keyforge home">
        <span className="logo-mark">K</span>
        <span>KEYFORGE</span>
      </Link>

      <nav className="store-nav">
        <NavLink end to="/">Home</NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/track">Track Order</NavLink>
      </nav>

      <div className="header-actions">
        <Link className="cart-pill" to="/cart">
          Cart <b>{count}</b>
        </Link>
      </div>
    </header>
  );
}
