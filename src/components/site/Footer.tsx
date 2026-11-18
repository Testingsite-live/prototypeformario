import { Link } from "@tanstack/react-router";
import { BRAND, COLLECTIONS } from "@/data/site";

const linkCls = "link-draw text-[15px] text-on-dark/85 hover:text-on-dark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-walnut text-on-dark">
      <div className="end-grain" aria-hidden="true" />
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <p className="font-display text-2xl font-semibold">{BRAND.name}</p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-on-dark/75">{BRAND.tagline}</p>
          <p className="eyebrow-on-dark mt-8">Handmade in {BRAND.location}</p>
          <p className="mt-2 text-[15px] text-on-dark/75">Shipped across the US.</p>
          {(BRAND.email || BRAND.phone || BRAND.social.length > 0) && (
            <ul className="mt-6 space-y-2">
              {BRAND.email && (
                <li>
                  <a href={`mailto:${BRAND.email}`} className={linkCls}>
                    {BRAND.email}
                  </a>
                </li>
              )}
              {BRAND.phone && (
                <li>
                  <a href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`} className={linkCls}>
                    {BRAND.phone}
                  </a>
                </li>
              )}
              {BRAND.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className={linkCls} rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav aria-label="Shop">
          <p className="eyebrow-on-dark mb-4">Shop</p>
          <ul className="space-y-3">
            <li>
              <Link to="/shop" className={linkCls}>
                All pieces
              </Link>
            </li>
            {COLLECTIONS.map((c) => (
              <li key={c.slug}>
                <Link to="/shop/$category" params={{ category: c.slug }} className={linkCls}>
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/custom-engraving" className={linkCls}>
                Custom Engraving
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Studio">
          <p className="eyebrow-on-dark mb-4">Studio</p>
          <ul className="space-y-3">
            <li><Link to="/about" className={linkCls}>About</Link></li>
            <li><Link to="/care" className={linkCls}>Care Guide</Link></li>
            <li><Link to="/faq" className={linkCls}>FAQ</Link></li>
            <li><Link to="/shipping-returns" className={linkCls}>Shipping and Returns</Link></li>
            <li><Link to="/privacy" className={linkCls}>Privacy</Link></li>
            <li><Link to="/contact" className={linkCls}>Contact</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-maple/20">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-on-dark/60 sm:flex-row sm:justify-between">
          <p>© {year} {BRAND.name}</p>
          <p>Handmade in {BRAND.location}</p>
        </div>
      </div>
    </footer>
  );
}
