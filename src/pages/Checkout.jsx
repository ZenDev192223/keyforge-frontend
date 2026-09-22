import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { money } from "../utils/helpers";

export default function Checkout() {
  const { cart, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ customer_name: "", email: "", phone: "", address: "", city: "", postal_code: "", country: "", payment_method: "cod" });

  if (!cart.length) return <div className="empty page-pad"><h2>Your cart is empty.</h2><p>Add a keyboard before checking out.</p></div>;

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const order = await api.orders.create({
        ...form,
        items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      });
      clear();
      navigate(`/order/${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page-title"><p className="eyebrow">CHECKOUT</p><h1>Complete your order.</h1><p>No account required. We only need the details needed to deliver your order.</p></div>
      <div className="checkout-layout">
        <form className="form-card" onSubmit={submit}>
          <div className="form-section"><h2>Contact</h2><div className="two"><label>Name<input name="customer_name" required value={form.customer_name} onChange={change} /></label><label>Email<input type="email" name="email" required value={form.email} onChange={change} /></label></div><label>Phone<input name="phone" value={form.phone} onChange={change} /></label></div>
          <div className="form-section"><h2>Delivery</h2><label>Address<textarea name="address" required value={form.address} onChange={change} /></label><div className="two"><label>City<input name="city" value={form.city} onChange={change} /></label><label>Postal code<input name="postal_code" value={form.postal_code} onChange={change} /></label></div><label>Country<input name="country" value={form.country} onChange={change} /></label></div>
          <div className="form-section"><h2>Payment</h2><label>Payment method<select name="payment_method" value={form.payment_method} onChange={change}><option value="cod">Cash on delivery</option><option value="card">Card</option></select></label><p className="form-note">Payment processing is represented by the backend order field. No payment gateway is connected to this project yet.</p></div>
          {error && <div className="error">{error}</div>}
          <button className="btn primary full" disabled={busy}>{busy ? "Placing order…" : "Place order"}</button>
        </form>

        <aside className="summary sticky-summary">
          <h3>Order summary</h3>
          {cart.map((item) => <div className="mini-item" key={item.id}><span>{item.name} × {item.quantity}</span><b>{money((item.discount_price ?? item.price) * item.quantity)}</b></div>)}
          <hr />
          <div><span>Subtotal</span><b>{money(subtotal)}</b></div>
          <div><span>Shipping</span><b>{shipping ? money(shipping) : "Free"}</b></div>
          <hr />
          <div className="total"><span>Total</span><b>{money(subtotal + shipping)}</b></div>
          {shipping === 0 && <p className="free-shipping">Free shipping applied.</p>}
        </aside>
      </div>
    </>
  );
}
