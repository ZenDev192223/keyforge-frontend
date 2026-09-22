import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { money } from "../../utils/helpers";
import Status from "../../components/common/Status";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.orders.list({ limit: 100, ...(status ? { status } : {}) })
      .then((result) => setOrders(result.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [status]);

  const update = async (id, nextStatus) => {
    try { await api.orders.updateStatus(id, nextStatus); load(); } catch (err) { setError(err.message); }
  };

  return <div>
    <div className="admin-heading"><div><p className="eyebrow">FULFILLMENT</p><h1>Orders</h1><p className="admin-subtitle">Review customer orders and move them through fulfillment.</p></div><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>
    {error && <div className="error">{error}</div>}
    <div className="table-card"><table><thead><tr><th>Order</th><th>Customer</th><th>Delivery</th><th>Date</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>{loading ? <tr><td colSpan="7">Loading orders…</td></tr> : orders.map((order) => <tr key={order.id}><td><b>#{order.id}</b></td><td>{order.customer_name}<small>{order.email}</small></td><td>{order.city || "—"}<small>{order.country || ""}</small></td><td>{new Date(order.created_at).toLocaleDateString()}</td><td>{money(order.total_amount)}</td><td><Status status={order.status}/></td><td><select value={order.status} onChange={(e) => update(order.id, e.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></td></tr>)}</tbody></table></div>
  </div>;
}
