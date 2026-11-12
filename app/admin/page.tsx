import Link from "next/link";
import AdminPanel from "@/components/AdminPanel";
import Icon from "@/components/Icon";
import "./admin.css";

export default function AdminPage() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">
          forma<span>.</span>
        </Link>
        <p className="admin-nav-label">BOSHQARUV</p>
        <nav aria-label="Admin menyusi">
          <Link href="/admin" className="admin-nav-active" aria-current="page">
            <Icon name="box" /> Mahsulotlar
          </Link>
          <Link href="/products">
            <Icon name="arrow" /> Katalogni ko‘rish
          </Link>
        </nav>
        <div className="admin-sidebar-note">
          <span className="admin-sidebar-symbol" aria-hidden="true">
            ✳
          </span>
          <p>
            Yaxshi tanlovlar
            <br />
            shu yerdan boshlanadi.
          </p>
          <Link href="/">Saytga qaytish ↗</Link>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <span>
            Forma <span className="admin-divider">/</span> Boshqaruv paneli
          </span>
          <span className="admin-workspace-label">
            <span /> Admin makoni
          </span>
        </header>
        <main className="admin-main">
          <div className="admin-page-heading">
            <p className="admin-eyebrow">HAMMASI BIR JOYDA</p>
            <h1>
              Mahsulotlar boshqaruvi<span>.</span>
            </h1>
            <p>Katalogingizni yangilang, mahsulotlaringizga e’tibor bering.</p>
          </div>
          <AdminPanel />
          <footer className="admin-footer">
            Forma · Har bir detalda tartib.
          </footer>
        </main>
      </div>
    </div>
  );
}
