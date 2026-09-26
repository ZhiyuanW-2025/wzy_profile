"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { StampProvider } from "./StampSystem";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/studio", label: "薯格工作室" },
  { href: "/agent", label: "Sugar Agent" },
  { href: "/about", label: "关于 / 简历" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <StampProvider>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="返回首页">
          ZW<span>27</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
        <nav id="primary-navigation" className={menuOpen ? "site-nav open" : "site-nav"} aria-label="主导航">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <p>吴致远 · AI 产品作品集 · 2027</p>
        <p>真实产品、真实用户、真实业务。</p>
      </footer>
    </StampProvider>
  );
}
