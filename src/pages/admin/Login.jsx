import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api.auth.login(form);
      sessionStorage.setItem("admin_token", result.token);
      navigate("/admin", { replace: true });
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return <div className="admin-login"><div className="admin-login-panel"><div className="admin-login-brand"><span className="logo-mark">K</span><div><b>KEYFORGE</b><small>STORE ADMINISTRATION</small></div></div><div className="form-card"><p className="eyebrow">PRIVATE AREA</p><h1>Admin sign in.</h1><p className="login-copy">Manage products, orders and store analytics from the administration panel.</p><form onSubmit={submit}><label>Username<input required autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label><label>Password<input required type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>{error && <div className="error">{error}</div>}<button className="btn primary full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form></div><Link to="/" className="back login-back">← Return to storefront</Link></div></div>;
}
