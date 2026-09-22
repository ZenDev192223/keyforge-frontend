import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { imageUrl, money } from "../../utils/helpers";

const emptyForm = { name: "", brand: "", category: "mechanical", switch_type: "", layout: "", connectivity: "", description: "", price: "", discount_price: "", stock: "", image_url: "", is_featured: false };

export default function Products() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.products.list({ limit: 100 }).then((result) => setItems(result.data)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setError(""); setShowForm(true); };
  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({ ...emptyForm, ...product, discount_price: product.discount_price ?? "", is_featured: !!product.is_featured });
    setError("");
    setShowForm(true);
  };
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value });

  const save = async (event) => {
    event.preventDefault();
    setError("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), discount_price: form.discount_price === "" ? null : Number(form.discount_price), is_featured: form.is_featured ? 1 : 0 };
    try {
      if (editingId) await api.products.update(editingId, payload);
      else await api.products.create(payload);
      setShowForm(false);
      load();
    } catch (err) { setError(err.message); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await api.products.remove(id); load(); } catch (err) { setError(err.message); }
  };

  return <div>
    <div className="admin-heading"><div><p className="eyebrow">CATALOG</p><h1>Products</h1><p className="admin-subtitle">Create, edit and maintain the public keyboard catalog.</p></div><button className="btn primary" onClick={openCreate}>+ Add product</button></div>

    {showForm && <form className="admin-product-form" onSubmit={save}>
      <div className="form-card">
        <div className="form-card-heading"><div><p className="eyebrow">{editingId ? "EDIT PRODUCT" : "NEW PRODUCT"}</p><h2>{editingId ? "Update keyboard" : "Add a keyboard"}</h2></div><button type="button" className="close-btn" onClick={() => setShowForm(false)}>×</button></div>
        <div className="admin-form-grid">
          <label>Name<input required name="name" value={form.name} onChange={change} /></label>
          <label>Brand<input required name="brand" value={form.brand} onChange={change} /></label>
          <label>Category<select name="category" value={form.category} onChange={change}>{["mechanical","membrane","wireless","gaming","ergonomic"].map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Switch type<input name="switch_type" value={form.switch_type || ""} onChange={change} /></label>
          <label>Layout<input name="layout" value={form.layout || ""} onChange={change} /></label>
          <label>Connectivity<input name="connectivity" value={form.connectivity || ""} onChange={change} /></label>
          <label>Price<input required type="number" min="0" step="0.01" name="price" value={form.price} onChange={change} /></label>
          <label>Discount price<input type="number" min="0" step="0.01" name="discount_price" value={form.discount_price} onChange={change} /></label>
          <label>Stock<input required type="number" min="0" step="1" name="stock" value={form.stock} onChange={change} /></label>
          <label className="wide-field">Image URL<input name="image_url" value={form.image_url || ""} onChange={change} /></label>
          <label className="wide-field">Description<textarea name="description" value={form.description || ""} onChange={change} /></label>
          <label className="checkbox-field"><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={change} /> Feature on storefront</label>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="form-actions"><button type="button" className="btn ghost" onClick={() => setShowForm(false)}>Cancel</button><button className="btn primary">{editingId ? "Save changes" : "Create product"}</button></div>
      </div>
    </form>}

    {error && !showForm && <div className="error">{error}</div>}
    <div className="table-card"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="6">Loading products…</td></tr> : items.map((p) => <tr key={p.id}><td><div className="table-product"><img src={imageUrl(p.image_url)} alt="" /><span><b>{p.name}</b><small>{p.brand}</small></span></div></td><td>{p.category}</td><td>{money(p.discount_price ?? p.price)}</td><td><span className={p.stock <= 5 ? "stock-low" : ""}>{p.stock}</span></td><td>{p.is_featured ? "Yes" : "—"}</td><td><div className="table-actions"><button className="table-action" onClick={() => openEdit(p)}>Edit</button><button className="table-action danger-text" onClick={() => remove(p.id)}>Delete</button></div></td></tr>)}</tbody></table></div>
  </div>;
}
