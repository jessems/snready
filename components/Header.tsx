"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAccess } from "./AccessProvider";
import { LoginModal } from "./LoginModal";

const navigation = [
  ["/certifications", "Certifications"],
  ["/practice-questions", "Practice"],
  ["/study-guide", "Study guides"],
  ["/resources", "Resources"],
  ["/pricing", "Pricing"],
] as const;

export default function Header() {
  const pathname = usePathname();
  const { authenticated, email, logout, loading } = useAccess();
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const isAdmin = email?.toLowerCase() === "jessems@gmail.com";

  return <>
    <header className="site-header" onKeyDown={event => { if (event.key === "Escape") { setMenuOpen(false); setAccountOpen(false); } }}>
      <div className="site-header-inner">
        <Link href="/" className="brand-wordmark" aria-label="SNReady home">snready<span aria-hidden="true" /></Link>
        <nav className="site-desktop-nav" aria-label="Main navigation">
          {navigation.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="site-header-actions">
          <button className="site-menu-toggle" aria-expanded={menuOpen} aria-controls="site-mobile-navigation" onClick={() => { setMenuOpen(!menuOpen); setAccountOpen(false); }}>{menuOpen ? "Close" : "Menu"}</button>
          {authenticated ? <div className="site-account">
            <button className="site-outline-button" aria-expanded={accountOpen} aria-controls="site-account-menu" onClick={() => { setAccountOpen(!accountOpen); setMenuOpen(false); }}>Account</button>
            {accountOpen && <div className="site-account-menu" id="site-account-menu">
              <p>{email}</p>
              <Link href="/account" onClick={() => setAccountOpen(false)}>Your account</Link>
              <Link href="/certifications" onClick={() => setAccountOpen(false)}>Your certifications</Link>
              {isAdmin && <Link href="/admin/coverage" onClick={() => setAccountOpen(false)}>Admin dashboard</Link>}
              <button onClick={() => { void logout(); setAccountOpen(false); }}>Sign out</button>
            </div>}
          </div> : <button className="site-outline-button" disabled={loading} onClick={() => setLoginOpen(true)}>{loading ? "Loading…" : "Sign in"}</button>}
        </div>
      </div>
      {menuOpen && <nav className="site-mobile-nav" id="site-mobile-navigation" aria-label="Mobile navigation">
        {[...navigation, ["/blog", "Blog"], ["/compare", "Compare certifications"], ["/certification-paths", "Career paths"], ["/salaries", "Salaries"]].map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setMenuOpen(false)}>{label}</Link>)}
      </nav>}
    </header>
    <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onPurchase={() => { setLoginOpen(false); window.location.href = "/certifications"; }} />
  </>;
}
