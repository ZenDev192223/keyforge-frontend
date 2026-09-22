import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { money } from "../../utils/helpers";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [sales, setSales] = useState([]);
  const [top, setTop] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.analytics.summary(), api.analytics.sales(30), api.analytics.topProducts(5), api.analytics.categories(), api.analytics.inventory()])
      .then(([summary, salesData, topData, categoryData, inventoryData]) => { setData(summary); setSales(salesData); setTop(topData); setCategories(categoryData); setInventory(inventoryData); })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="empty"><h2>Dashboard unavailable</h2><p>{error}</p></div>;
  if (!data) return <div className="loading">Loading dashboard…</div>;

  return <div>
    <div className="admin-heading"><div><p className="eyebrow">STORE OVERVIEW</p><h1>Dashboard</h1><p className="admin-subtitle">A live view of catalog, orders, revenue and inventory.</p></div></div>
    <div className="kpi-grid">{[["Revenue", money(data.totalRevenue)], ["Orders", data.totalOrders], ["Average order", money(data.avgOrderValue)], ["Products", data.totalProducts], ["Low stock", data.lowStockCount]].map(([label, value]) => <div className="kpi" key={label}><span>{label}</span><b>{value}</b></div>)}</div>

    <div className="charts">
      <div className="chart-card wide"><div className="chart-title"><div><b>Sales overview</b><small>Last 30 days</small></div></div><ResponsiveContainer width="100%" height={290}><AreaChart data={sales}><XAxis dataKey="day" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip formatter={(value, name) => [name === "revenue" ? money(value) : value, name === "revenue" ? "Revenue" : "Orders"]}/><Area type="monotone" dataKey="revenue" fill="rgba(17,17,17,.08)" stroke="#111" /></AreaChart></ResponsiveContainer></div>
      <div className="chart-card"><div className="chart-title"><div><b>Category sales</b><small>Revenue by category</small></div></div><ResponsiveContainer width="100%" height={290}><PieChart><Pie data={categories} dataKey="revenue" nameKey="category" outerRadius={95} label>{categories.map((_, i) => <Cell key={i} />)}</Pie><Tooltip formatter={(value) => money(value)} /></PieChart></ResponsiveContainer></div>
      <div className="chart-card"><div className="chart-title"><div><b>Top products</b><small>Units sold</small></div></div><ResponsiveContainer width="100%" height={290}><BarChart data={top} layout="vertical"><XAxis type="number" tick={{fontSize:10}}/><YAxis dataKey="product_name" type="category" width={110} tick={{fontSize:10}}/><Tooltip/><Bar dataKey="units_sold" /></BarChart></ResponsiveContainer></div>
    </div>

    <div className="inventory-card"><div className="chart-title"><div><b>Inventory watch</b><small>Lowest stock first</small></div></div><div className="inventory-grid">{inventory.slice(0, 6).map((item) => <div key={item.id} className={item.stock <= 5 ? "inventory-item low" : "inventory-item"}><span>{item.name}</span><b>{item.stock}</b><small>{item.stock <= 5 ? "Low stock" : "units"}</small></div>)}</div></div>
  </div>;
}
