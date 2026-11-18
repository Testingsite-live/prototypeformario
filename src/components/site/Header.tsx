import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { BRAND, COLLECTIONS, NAV_LINKS } from "@/data/site";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

function Logo({ light }: { light: boolean }) {
  return (
    <Link to="/" className="group flex min-h-[44px] items-center gap-3" aria-label={`${BRAND.name}, home`}>
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 place-items-center rounded-sm border font-display text-[15px] font-semibold transition-colors",
          light ? "border-paper/70 text-on-dark" : "border-walnut text-walnut",
        )}
      >
        K&amp;C
      </span>
      <span className={cn("font-display text-lg font-semibold leading-none tracking-tight sm:text-xl", light ? "text-on-dark" : "text-walnut")}>
        {BRAND.name}
      </span>
    </Link>
  );
}

const navLinkBase =
  "relative inline-flex min-h-[44px] items-center text-[15px] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-ember after:transition-transform after:duration-200 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100";

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { count, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const shopBtn = useRef<HTMLButtonElement>(null);
  const shopWrap = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !mobileOpen;
  const light = transparent;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShopOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Escape + outside click for the dropdown; Escape for the mobile menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (shopOpen) {
        setShopOpen(false);
        shopBtn.current?.focus();
      }
      if (mobileOpen) {
        setMobileOpen(false);
        menuBtn.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (shopOpen && shopWrap.current && !shopWrap.current.contains(e.target as Node)) setShopOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [shopOpen, mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const shopActive = pathname.startsWith("/shop");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,height] duration-[250ms]",
        transparent ? "border-b border-transparent bg-transparent" : "border-b border-border bg-paper",
      )}
    >
      <div className={cn("container-site flex items-center justify-between gap-6 transition-[height] duration-[250ms]", scrolled ? "h-16" : "h-20")}>
        <Logo light={light} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className={cn("flex items-center gap-7", light ? "text-on-dark" : "text-walnut")}>
            <li className="relative">
              <div ref={shopWrap} className="flex items-center">
                <Link to="/shop" className={navLinkBase} aria-current={shopActive ? "page" : undefined}>
                  Shop
                </Link>
                <button
                  ref={shopBtn}
                  type="button"
                  aria-expanded={shopOpen}
                  aria-controls="shop-menu"
                  aria-label="Show collections"
                  onClick={() => setShopOpen((o) => !o)}
                  className="inline-flex size-11 items-center justify-center"
                >
                  <ChevronDown className={cn("size-4 transition-transform", shopOpen && "rotate-180")} aria-hidden="true" />
                </button>
                {shopOpen && (
                  <ul
                    id="shop-menu"
                    className="absolute left-0 top-full w-64 border border-border bg-paper py-2 text-walnut shadow-[0_12px_30px_-18px_oklch(0.245_0.027_53.8/0.5)]"
                  >
                    <li>
                      <Link to="/shop" className="flex min-h-[44px] items-center px-5 text-[15px] hover:bg-oat">
                        All pieces
                      </Link>
                    </li>
                    {COLLECTIONS.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to="/shop/$category"
                          params={{ category: c.slug }}
                          className="flex min-h-[44px] items-center px-5 text-[15px] hover:bg-oat"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={navLinkBase} activeProps={{ "aria-current": "page" }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className={cn(
              "relative inline-flex size-11 items-center justify-center rounded-sm transition-colors",
              light ? "text-on-dark hover:bg-paper/10" : "text-walnut hover:bg-oat",
            )}
            aria-label={`Cart, ${ready ? count : 0} ${count === 1 ? "item" : "items"}`}
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {ready && count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-semibold leading-5 text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <span className="sr-only" aria-live="polite">
            {ready ? `${count} ${count === 1 ? "item" : "items"} in cart` : ""}
          </span>
          <Link to="/custom-engraving" className="btn btn-primary hidden !min-h-[44px] !px-5 !text-[14px] lg:inline-flex">
            Start Your Custom Piece
          </Link>
          <button
            ref={menuBtn}
            type="button"
            className={cn("inline-flex size-11 items-center justify-center lg:hidden", light ? "text-on-dark" : "text-walnut")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-paper lg:hidden" style={{ top: scrolled ? 64 : 80 }}>
          <nav aria-label="Mobile" className="container-site py-8">
            <p className="eyebrow mb-3">Shop</p>
            <ul className="mb-8 border-t border-border">
              <li>
                <Link to="/shop" className="flex min-h-[56px] items-center border-b border-border font-display text-2xl text-walnut">
                  All pieces
                </Link>
              </li>
              {COLLECTIONS.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/shop/$category"
                    params={{ category: c.slug }}
                    className="flex min-h-[56px] items-center border-b border-border font-display text-2xl text-walnut"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="border-t border-border">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    activeProps={{ "aria-current": "page", className: "text-ember" }}
                    className="flex min-h-[56px] items-center border-b border-border font-display text-2xl text-walnut"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/cart" className="flex min-h-[56px] items-center border-b border-border font-display text-2xl text-walnut">
                  Cart{ready && count > 0 ? ` (${count})` : ""}
                </Link>
              </li>
            </ul>
            <Link to="/custom-engraving" className="btn btn-primary mt-8 w-full">
              Start Your Custom Piece
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
