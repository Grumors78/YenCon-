import { Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import Vendor from "./pages/Vendor.jsx";
import Auth from "./pages/Auth.jsx";
import Saved from "./pages/Saved.jsx";
import Account from "./pages/Account.jsx";
import AccountPassword from "./pages/AccountPassword.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import DashOverview from "./pages/DashOverview.jsx";
import DashProducts from "./pages/DashProducts.jsx";
import DashAddProduct from "./pages/DashAddProduct.jsx";
import DashProfile from "./pages/DashProfile.jsx";
import { SavedProvider } from "./context/SavedContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import RequireRole from "./components/RequireRole.jsx";
import "./pages/pages.css";
import "./pages/extras.css";

function NotFound() {
  return (
    <main className="wrap empty">
      <h1>Page not found</h1>
      <p>This page is not built yet or the link is wrong.</p>
      <Link className="btn" to="/">Back to home</Link>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <SavedProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/vendor/:id" element={<Vendor />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/password" element={<RequireRole roles={["customer", "vendor", "admin"]}><AccountPassword /></RequireRole>} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/dashboard" element={<RequireRole roles={["vendor"]}><DashboardLayout /></RequireRole>}>
          <Route index element={<DashOverview />} />
          <Route path="products" element={<DashProducts />} />
          <Route path="products/new" element={<DashAddProduct />} />
          <Route path="products/:id/edit" element={<DashAddProduct />} />
          <Route path="profile" element={<DashProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SavedProvider>
    </AuthProvider>
  );
}
