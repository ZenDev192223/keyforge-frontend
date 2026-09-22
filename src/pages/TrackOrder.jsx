import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { money } from "../utils/helpers";
import Status from "../components/common/Status";

const steps = ["pending", "processing", "shipped", "delivered"];

export default function TrackOrder() {
  const [params] = useSearchParams();
  const [id, setId] = useState(params.get("order") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const find = async (event) => {
    event.preventDefault();
    if (!id.trim()) return;
    try {
      setError("");
      setOrder(await api.orders.get(id.trim()));
    } catch (err) {
      setOrder(null);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (params.get("order")) api.orders.get(params.get("order")).then(setOrder).catch(() => {});
  }, [params]);

  return (
    <div className="track page-pad">
      <p className="eyebrow">ORDER LOOKUP</p>
      <h1>Track your order.</h1>
      <p className="track-intro">Enter the order number from your confirmation page. You do not need an account.</p>
      <form className="track-form" onSubmit={find}><input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. 25" inputMode="numeric" /><button className="btn primary">Find order</button></form>
      {error && <div className="error">{error}</div>}
      {order && (
        <div className="order-card">
          <div className="order-top"><div><span className="muted">ORDER</span><h2>#{order.id}</h2><small>{new Date(order.created_at).toLocaleString()}</small></div><Status status={order.status} /></div>
          {order.status === "cancelled" ? <div className="cancelled-note">This order has been cancelled.</div> : <div className="timeline">{steps.map((step, index) => <div className={steps.indexOf(order.status) >= index ? "done" : ""} key={step}><span>{index + 1}</span><b>{step}</b></div>)}</div>}
          <div className="track-items">{order.items?.map((item) => <div key={item.id}><span>{item.product_name} × {item.quantity}</span><b>{money(item.unit_price * item.quantity)}</b></div>)}</div>
          <div className="total-row"><span>Total</span><b>{money(order.total_amount)}</b></div>
        </div>
      )}
    </div>
  );
}
