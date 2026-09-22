import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { money } from "../utils/helpers";
import Status from "../components/common/Status";

export default function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => api.orders.get(id).then(setOrder).catch((err) => setError(err.message)), [id]);

  if (error) return <div className="empty page-pad"><h2>We couldn't load that order.</h2><p>{error}</p><Link className="btn primary" to="/track">Track an order</Link></div>;
  if (!order) return <div className="loading page-pad">Loading order…</div>;

  return <div className="page-pad success">
    <div className="success-mark">✓</div>
    <p className="eyebrow">ORDER CONFIRMED</p>
    <h1>Thanks for your order.</h1>
    <p>Your order <b>#{order.id}</b> has been created. Keep the order number to check its status later.</p>
    <div className="success-box">
      <div><span>Status</span><Status status={order.status} /></div>
      <div><span>Total</span><b>{money(order.total_amount)}</b></div>
      <div><span>Email</span><b>{order.email}</b></div>
    </div>
    <div className="hero-actions centered"><Link className="btn primary" to={`/track?order=${order.id}`}>Track order</Link><Link className="btn ghost" to="/shop">Continue shopping</Link></div>
  </div>;
}
