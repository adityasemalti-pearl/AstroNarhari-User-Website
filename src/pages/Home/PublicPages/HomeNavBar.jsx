import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png"; // apna path rakhna

export default function Header({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLink = (href, label) => (
    <a href={href} onClick={() => setMenuOpen(false)}>
      {label}
    </a>
  );

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="wrap nav-row">
        <a href="#hero" className="logo">
          <img src={logo} alt="logo" className="h-12" />
          Namah-Astro
        </a>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navLink("#services", "Services")}
          {navLink("#astrologers", "Astrologers")}
          {navLink("#how", "How It Works")}
          {navLink("#pricing", "Pricing")}
          {navLink("#faq", "FAQ")}
        </nav>

        <div className="nav-cta">
          <a href="#app" className="btn btn-primary">
            Get App
          </a>
        </div>

        <button
          className="burger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}