import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { money } from "../utils/helpers";
import CartItem from "../components/cart/CartItem";

export default function Cart() {
  const { cart, subtotal } = useCart();
  if (!cart.length) return <div className="empty page-pad"><p className="eyebrow">YOUR CART</p><h1>Nothing here yet.</h1><p>Add a keyboard from the shop and it will appear here.</p><Link className="btn primary" to="/shop">Browse keyboards</Link></div>;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  return <><div className="page-title"><div><p className="eyebrow">YOUR CART</p><h1>Ready to checkout?</h1></div><p>{cart.length} item{cart.length === 1 ? "" : "s"} in your cart.</p></div><div className="cart-layout"><section className="cart-list">{cart.map((item) => <CartItem key={item.id} item={item} />)}</section><aside className="summary sticky-summary"><h3>Summary</h3><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Shipping</span><b>{shipping ? money(shipping) : "Free"}</b></div><hr /><div className="total"><span>Total</span><b>{money(subtotal + shipping)}</b></div><Link className="btn primary full" to="/checkout">Checkout</Link><p className="free-shipping">{shipping ? "Free shipping on orders of $100 or more." : "You unlocked free shipping."}</p></aside></div></>;
}
