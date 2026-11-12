import Link from "next/link";
import ProductsList from "./Products";

export function Header() {
  return (
    <header className="container site-header">
      <Link href="/" className="logo">
        Forma
      </Link>
      <nav aria-label="Asosiy menyu">
        <Link href="/">Bosh sahifa</Link>
        <Link href="/products">Mahsulotlar</Link>
        <Link href="/admin">Admin panel</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="container site-footer">
      Forma — mahsulotlar katalogi.
    </footer>
  );
}

export default function Storefront({
  catalogOnly = false,
}: {
  catalogOnly?: boolean;
}) {
  return (
    <>
      <Header />
      <main className="container">
        <h1>{catalogOnly ? "Mahsulotlar" : "Xush kelibsiz!"}</h1>
        {!catalogOnly && <p>Mahsulotlarni ko‘ring va o‘zingizga mosini tanlang.</p>}
        <ProductsList />
      </main>
      <Footer />
    </>
  );
}
