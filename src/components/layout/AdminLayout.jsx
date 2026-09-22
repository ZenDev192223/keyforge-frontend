import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("admin_token");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="logo admin-logo" to="/admin">
          <span className="logo-mark">K</span>
          <span>KEYFORGE</span>
        </Link>
        <div className="admin-kicker">STORE ADMINISTRATION</div>

        <nav className="admin-nav">
          <NavLink end to="/admin">Overview</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/">← View storefront</Link>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-mobile-bar">
          <Link className="logo" to="/admin"><span className="logo-mark">K</span> KEYFORGE</Link>
          <button onClick={logout}>Sign out</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
