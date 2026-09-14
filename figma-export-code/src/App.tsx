import React, { useState, createContext, useContext, useCallback } from "react";

// ─── Simple SPA navigation context ───────────────────────────────────────────

type PageId = "home" | "comparisons" | "product" | "category" | "best-picks" | "troubleshooting" | "about" | "editorial" | "disclosure" | "contact" | "products-hub" | "feeders" | "gps" | "cameras" | "guides";

const HREF_TO_PAGE: Record<string, PageId> = {
  "/": "home",
  "/products/": "products-hub",
  "/products/automatic-litter-boxes/": "category",
  "/products/smart-pet-feeders/": "feeders",
  "/products/gps-pet-trackers/": "gps",
  "/products/pet-cameras/": "cameras",
  "/comparisons/": "comparisons",
  "/best-picks/": "best-picks",
  "/troubleshooting/": "troubleshooting",
  "/about/": "about",
  "/editorial-standards/": "editorial",
  "/disclosure/": "disclosure",
  "/contact/": "contact",
  "/guides/": "guides",
};

function hrefToPage(href: string): PageId | null {
  if (HREF_TO_PAGE[href]) return HREF_TO_PAGE[href];
  if (href.startsWith("/products/automatic-litter-boxes/")) return "category";
  if (href.startsWith("/products/smart-pet-feeders/")) return "feeders";
  if (href.startsWith("/products/gps-pet-trackers/")) return "gps";
  if (href.startsWith("/products/pet-cameras/")) return "cameras";
  if (href.startsWith("/products/")) return "products-hub";
  if (href.startsWith("/comparisons/")) return "comparisons";
  if (href.startsWith("/best-picks/")) return "best-picks";
  if (href.startsWith("/troubleshooting/")) return "troubleshooting";
  if (href.startsWith("/guides/")) return "guides";
  if (href.startsWith("/reviews/")) return "product";
  return null;
}

type NavFn = (href: string) => void;
const NavCtx = createContext<NavFn>(() => {});
function useNav() { return useContext(NavCtx); }

function Link({ href, children, style, className, onClick, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const navigate = useNav();
  const isExternal = !href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto");
  if (isExternal) return <a href={href} style={style} className={className} onClick={onClick} {...rest}>{children}</a>;
  return (
    <a
      href={href}
      style={style}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

const NAV_ITEMS = [
  {
    label: "Products",
    href: "/products/",
    sub: [
      { label: "Automatic Litter Boxes", href: "/products/automatic-litter-boxes/" },
      { label: "Smart Pet Feeders", href: "/products/smart-pet-feeders/" },
      { label: "GPS Pet Trackers", href: "/products/gps-pet-trackers/" },
      { label: "Pet Cameras", href: "/products/pet-cameras/" },
    ],
  },
  { label: "Comparisons", href: "/comparisons/" },
  { label: "Best Picks", href: "/best-picks/" },
  { label: "Troubleshooting", href: "/troubleshooting/" },
  { label: "Guides", href: "/guides/" },
  { label: "About", href: "/about/" },
];

const CATEGORIES = [
  {
    slug: "automatic-litter-boxes",
    title: "Automatic Litter Boxes",
    count: 34,
    updated: "Aug 2026",
    img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop&auto=format",
    alt: "Cat next to a modern automatic litter box",
    description: "Self-cleaning systems for single and multi-cat households, ranked by reliability and long-term cost.",
  },
  {
    slug: "smart-pet-feeders",
    title: "Smart Pet Feeders",
    count: 28,
    updated: "Sep 2026",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop&auto=format",
    alt: "Dog eating from an automatic feeder",
    description: "Portion-controlled and camera-enabled feeders for dogs and cats, tested for dispensing accuracy.",
  },
  {
    slug: "gps-pet-trackers",
    title: "GPS Pet Trackers",
    count: 19,
    updated: "Aug 2026",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop&auto=format",
    alt: "Dog wearing a GPS tracker collar outdoors",
    description: "Real-time location devices compared on coverage, battery life, subscription cost, and app reliability.",
  },
  {
    slug: "pet-cameras",
    title: "Pet Cameras",
    count: 22,
    updated: "Jul 2026",
    img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&h=400&fit=crop&auto=format",
    alt: "Cat being monitored by a home pet camera",
    description: "Two-way audio, treat dispensing, and night vision — evaluated for video quality and app stability.",
  },
];

const COMPARISONS = [
  {
    a: "Litter-Robot 4",
    b: "PETKIT PURA MAX",
    verdict: "Litter-Robot 4 for reliability; PETKIT for budget.",
    href: "/comparisons/litter-robot-4-vs-petkit-pura-max/",
    views: "41,200",
  },
  {
    a: "Tractive GPS",
    b: "Fi Series 3",
    verdict: "Tractive for international travel; Fi for US coverage.",
    href: "/comparisons/tractive-gps-vs-fi-series-3/",
    views: "28,500",
  },
  {
    a: "PETLIBRO Granary",
    b: "Arf Pets Feeder",
    verdict: "PETLIBRO wins on dispensing accuracy at all portion sizes.",
    href: "/comparisons/petlibro-granary-vs-arf-pets-feeder/",
    views: "19,300",
  },
];

type ComparisonFull = {
  a: string;
  b: string;
  category: string;
  categorySlug: string;
  verdict: string;
  bestFor: { who: string; pick: string }[];
  criteria: { label: string; aVal: string; bVal: string; winner: "a" | "b" | "tie" }[];
  href: string;
  views: string;
  updated: string;
  featured?: boolean;
};

const ALL_COMPARISONS: ComparisonFull[] = [
  {
    a: "Litter-Robot 4",
    b: "PETKIT PURA MAX",
    category: "Automatic Litter Boxes",
    categorySlug: "automatic-litter-boxes",
    verdict: "Litter-Robot 4 is the more reliable long-term choice; PETKIT PURA MAX offers a lower entry price with competitive features.",
    bestFor: [
      { who: "Multi-cat households (2–4 cats)", pick: "Litter-Robot 4" },
      { who: "Budget-conscious single-cat owners", pick: "PETKIT PURA MAX" },
    ],
    criteria: [
      { label: "Price (unit)", aVal: "$699", bVal: "$399", winner: "b" },
      { label: "Monthly subscription", aVal: "$0 (optional $12/mo)", bVal: "$0", winner: "tie" },
      { label: "Waste drawer capacity", aVal: "Large (13 lb)", bVal: "Medium (9 lb)", winner: "a" },
      { label: "App reliability", aVal: "4.4 / 5 (12k reviews)", bVal: "3.9 / 5 (4k reviews)", winner: "a" },
      { label: "Noise level", aVal: "Quiet (47 dB)", bVal: "Moderate (52 dB)", winner: "a" },
      { label: "Self-cleaning cycle time", aVal: "~3 min", bVal: "~2 min", winner: "b" },
    ],
    href: "/comparisons/litter-robot-4-vs-petkit-pura-max/",
    views: "41,200",
    updated: "Aug 2026",
    featured: true,
  },
  {
    a: "Tractive GPS",
    b: "Fi Series 3",
    category: "GPS Pet Trackers",
    categorySlug: "gps-pet-trackers",
    verdict: "Tractive works globally and suits travelers; Fi Series 3 has superior US network coverage and a longer battery life.",
    bestFor: [
      { who: "Owners who travel internationally with pets", pick: "Tractive GPS" },
      { who: "US-based owners with escape-prone dogs", pick: "Fi Series 3" },
    ],
    criteria: [
      { label: "Price (hardware)", aVal: "$49.99", bVal: "$149", winner: "a" },
      { label: "Monthly subscription", aVal: "$12.99/mo", bVal: "$8.25/mo", winner: "b" },
      { label: "GPS coverage", aVal: "175+ countries", bVal: "US only", winner: "a" },
      { label: "Battery life", aVal: "2–5 days", bVal: "Up to 3 months", winner: "b" },
      { label: "Live tracking interval", aVal: "2–3 sec", bVal: "~10 sec", winner: "a" },
      { label: "Water resistance", aVal: "IP67", bVal: "IP68", winner: "b" },
    ],
    href: "/comparisons/tractive-gps-vs-fi-series-3/",
    views: "28,500",
    updated: "Aug 2026",
  },
  {
    a: "PETLIBRO Granary",
    b: "Arf Pets Feeder",
    category: "Smart Pet Feeders",
    categorySlug: "smart-pet-feeders",
    verdict: "PETLIBRO edges ahead on dispensing consistency across all portion sizes; Arf Pets is adequate for standard schedules at a lower price.",
    bestFor: [
      { who: "Cats or dogs on precise portion-control diets", pick: "PETLIBRO Granary" },
      { who: "Pet owners needing a reliable basic schedule feeder", pick: "Arf Pets Feeder" },
    ],
    criteria: [
      { label: "Price", aVal: "$89.99", bVal: "$54.99", winner: "b" },
      { label: "Portion accuracy (tested)", aVal: "±2% variance", bVal: "±8% variance", winner: "a" },
      { label: "Food capacity", aVal: "6 L", bVal: "6 L", winner: "tie" },
      { label: "Camera included", aVal: "Yes (1080p)", bVal: "No", winner: "a" },
      { label: "Dual-power (plug + battery)", aVal: "Yes", bVal: "Yes", winner: "tie" },
      { label: "App scheduling granularity", aVal: "1-meal intervals", bVal: "4 meals/day max", winner: "a" },
    ],
    href: "/comparisons/petlibro-granary-vs-arf-pets-feeder/",
    views: "19,300",
    updated: "Sep 2026",
  },
  {
    a: "Furbo 360°",
    b: "Petcube Bites 2",
    category: "Pet Cameras",
    categorySlug: "pet-cameras",
    verdict: "Furbo 360° leads on video quality and dog alerts; Petcube Bites 2 offers a lower subscription cost with treat tossing.",
    bestFor: [
      { who: "Dog owners with separation anxiety concerns", pick: "Furbo 360°" },
      { who: "Cat or small-dog owners who want treat interaction", pick: "Petcube Bites 2" },
    ],
    criteria: [
      { label: "Price (unit)", aVal: "$169", bVal: "$89.99", winner: "b" },
      { label: "Monthly subscription", aVal: "$8.99/mo", bVal: "$4.99/mo", winner: "b" },
      { label: "Video resolution", aVal: "1080p HD", bVal: "1080p HD", winner: "tie" },
      { label: "Field of view", aVal: "360° pan", bVal: "138° fixed", winner: "a" },
      { label: "Night vision", aVal: "Color night vision", bVal: "IR night vision", winner: "a" },
      { label: "Treat range", aVal: "Up to 6 ft", bVal: "Up to 5 ft", winner: "a" },
    ],
    href: "/comparisons/furbo-360-vs-petcube-bites-2/",
    views: "14,800",
    updated: "Jul 2026",
  },
  {
    a: "Litter-Robot 4",
    b: "PetSafe ScoopFree",
    category: "Automatic Litter Boxes",
    categorySlug: "automatic-litter-boxes",
    verdict: "Litter-Robot 4 wins on long-term value; PetSafe ScoopFree suits owners who prefer crystal litter with minimal setup.",
    bestFor: [
      { who: "Owners wanting zero-waste-bag maintenance", pick: "Litter-Robot 4" },
      { who: "Single-cat owners who prefer crystal litter", pick: "PetSafe ScoopFree" },
    ],
    criteria: [
      { label: "Price (unit)", aVal: "$699", bVal: "$179", winner: "b" },
      { label: "Litter type", aVal: "Clumping only", bVal: "Crystal trays", winner: "tie" },
      { label: "Ongoing litter cost/month", aVal: "~$18", bVal: "~$30 (trays)", winner: "a" },
      { label: "App connectivity", aVal: "Full app + health tracking", bVal: "No app", winner: "a" },
      { label: "Odor control", aVal: "Excellent (sealed drawer)", bVal: "Good (crystal absorbs)", winner: "a" },
      { label: "Setup time", aVal: "~20 min", bVal: "~5 min", winner: "b" },
    ],
    href: "/comparisons/litter-robot-4-vs-petsafe-scoopfree/",
    views: "11,400",
    updated: "Aug 2026",
  },
  {
    a: "Whistle GO Explore",
    b: "Tractive GPS",
    category: "GPS Pet Trackers",
    categorySlug: "gps-pet-trackers",
    verdict: "Whistle GO Explore adds health monitoring; Tractive is the better pure-GPS option for international use.",
    bestFor: [
      { who: "Owners who want GPS + health insights in one device", pick: "Whistle GO Explore" },
      { who: "Frequent travelers or owners needing global coverage", pick: "Tractive GPS" },
    ],
    criteria: [
      { label: "Price (hardware)", aVal: "$79.95", bVal: "$49.99", winner: "b" },
      { label: "Monthly subscription", aVal: "$9.95/mo", bVal: "$12.99/mo", winner: "a" },
      { label: "Health tracking", aVal: "Yes (calories, sleep, activity)", bVal: "Activity only", winner: "a" },
      { label: "International coverage", aVal: "US + Canada", bVal: "175+ countries", winner: "b" },
      { label: "Battery life", aVal: "Up to 10 days", bVal: "2–5 days", winner: "a" },
      { label: "Live tracking interval", aVal: "~10 sec", bVal: "2–3 sec", winner: "b" },
    ],
    href: "/comparisons/whistle-go-explore-vs-tractive-gps/",
    views: "9,600",
    updated: "Jul 2026",
  },
];

const TROUBLESHOOTING = [
  {
    product: "Litter-Robot 4",
    problem: "Not cycling after waste deposit",
    href: "/troubleshooting/litter-robot-4-not-cycling/",
    difficulty: "Easy fix",
  },
  {
    product: "Tractive GPS",
    problem: "Location not updating in real time",
    href: "/troubleshooting/tractive-gps-location-not-updating/",
    difficulty: "Moderate",
  },
  {
    product: "PETLIBRO Granary",
    problem: "Not dispensing food on schedule",
    href: "/troubleshooting/petlibro-granary-not-dispensing/",
    difficulty: "Easy fix",
  },
  {
    product: "Furbo Dog Camera",
    problem: "Offline or not connecting to app",
    href: "/troubleshooting/furbo-camera-offline/",
    difficulty: "Easy fix",
  },
];

const BEST_PICKS = [
  { title: "Best automatic litter box for multiple cats", href: "/best-picks/best-automatic-litter-box-multiple-cats/" },
  { title: "Best GPS tracker for escape-prone dogs", href: "/best-picks/best-gps-tracker-escape-prone-dogs/" },
  { title: "Best pet feeder for portion control", href: "/best-picks/best-pet-feeder-portion-control/" },
  { title: "Best pet camera for separation anxiety", href: "/best-picks/best-pet-camera-separation-anxiety/" },
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ExternalLink({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function Nav() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
        fontFamily: "var(--font-source-sans)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              backgroundColor: "var(--accent)",
              borderRadius: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, fontWeight: 600, color: "white", letterSpacing: "-0.01em" }}>
              PetMetric
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden-mobile">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                style={{ position: "relative" }}
                onMouseEnter={() => item.sub && setOpen(item.label)}
                onMouseLeave={() => setOpen(null)}
              >
                <Link
                  href={item.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "8px 14px",
                    fontSize: 14, fontWeight: 500,
                    color: open === item.label ? "var(--accent)" : "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    borderRadius: 4,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = open === item.label ? "var(--accent)" : "rgba(255,255,255,0.85)")}
                >
                  {item.label}
                  {item.sub && <ChevronDown />}
                </Link>
                {item.sub && open === item.label && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0,
                    backgroundColor: "white",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    minWidth: 220,
                    padding: "6px 0",
                    marginTop: 4,
                  }}>
                    {item.sub.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        style={{
                          display: "block",
                          padding: "9px 18px",
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: "var(--foreground)",
                          textDecoration: "none",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 14px",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 4,
                color: "rgba(255,255,255,0.7)",
                fontSize: 13.5,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              <SearchIcon />
              <span className="hidden-mobile">Search products…</span>
            </button>
            {/* Mobile menu toggle */}
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none", border: "none",
                color: "white", cursor: "pointer", padding: 6,
                display: "none",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          backgroundColor: "#0f1a31",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "12px 0 20px",
        }} className="show-mobile-block">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <Link href={item.href} style={{
                display: "block", padding: "11px 24px",
                fontSize: 15, fontWeight: 500,
                color: "rgba(255,255,255,0.88)",
                textDecoration: "none",
              }}>
                {item.label}
              </Link>
              {item.sub && item.sub.map((s) => (
                <Link key={s.label} href={s.href} style={{
                  display: "block", padding: "8px 24px 8px 40px",
                  fontSize: 13.5, color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                }}>
                  {s.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

function TrustBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{
        fontFamily: "var(--font-fraunces)",
        fontSize: 28, fontWeight: 600,
        color: "var(--accent)",
        lineHeight: 1,
      }}>{value}</span>
      <span style={{ fontSize: 13.5, color: "var(--muted-foreground)", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function Hero() {
  return (
    <section style={{
      background: "linear-gradient(135deg, var(--primary) 0%, #0f2040 100%)",
      color: "white",
      padding: "80px 24px 72px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }} className="hero-grid">
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              backgroundColor: "rgba(217,124,42,0.18)",
              border: "1px solid rgba(217,124,42,0.35)",
              borderRadius: 3,
              padding: "4px 12px",
              marginBottom: 24,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "var(--accent)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Independent Research
              </span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 24,
              color: "white",
            }}>
              Pet tech research you can actually verify.
            </h1>

            <p style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.72)",
              marginBottom: 36,
              maxWidth: 480,
            }}>
              We research automatic litter boxes, GPS trackers, smart feeders, and pet cameras with documented methods, dated sources, and clear commercial disclosures.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/products/" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                backgroundColor: "var(--accent)",
                color: "white",
                padding: "13px 24px",
                borderRadius: 4,
                fontSize: 15, fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Browse All Products <ArrowRight size={16} />
              </Link>
              <Link href="/comparisons/" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.88)",
                padding: "13px 24px",
                borderRadius: 4,
                fontSize: 15, fontWeight: 500,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.16)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
              >
                Compare Products
              </Link>
            </div>
          </div>

          {/* Trust signals panel */}
          <div style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "36px 40px",
          }}>
            <p style={{
              fontSize: 11.5, fontFamily: "var(--font-dm-mono)",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: 28,
            }}>Research at a glance</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 32px", marginBottom: 32 }}>
              <TrustBadge value="103" label="products researched" />
              <TrustBadge value="4" label="product categories" />
              <TrustBadge value="Sep 2026" label="latest update" />
              <TrustBadge value="412" label="source citations" />
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 16 }}>
                Every product page includes: research date, methodology summary, affiliate disclosure, and error-correction contact.
              </p>
              <Link href="/editorial-standards/" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600,
                color: "var(--accent)",
                textDecoration: "none",
              }}>
                Read our editorial standards <ExternalLink size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-dm-mono)",
      fontSize: 11, fontWeight: 500,
      letterSpacing: "0.1em", textTransform: "uppercase",
      color: "var(--muted-foreground)",
      marginBottom: 8,
    }}>{children}</p>
  );
}

function Categories() {
  return (
    <section style={{ padding: "72px 24px", backgroundColor: "var(--background)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <SectionLabel>Product Database</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 600, letterSpacing: "-0.02em",
            color: "var(--foreground)", marginBottom: 12,
          }}>
            Four categories, independent coverage.
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted-foreground)", maxWidth: 520, lineHeight: 1.6 }}>
            Each category page includes key buying criteria, filterable product cards, and links to comparisons and troubleshooting guides.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}/`}
              style={{
                display: "block",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                overflow: "hidden",
                textDecoration: "none",
                color: "var(--card-foreground)",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ height: 180, overflow: "hidden", backgroundColor: "var(--muted)" }}>
                <img
                  src={cat.img}
                  alt={cat.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{ padding: "22px 22px 20px" }}>
                <h3 style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: 19, fontWeight: 600,
                  letterSpacing: "-0.01em",
                  marginBottom: 8, lineHeight: 1.25,
                }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.55, marginBottom: 16 }}>
                  {cat.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{
                      fontFamily: "var(--font-dm-mono)",
                      fontSize: 11.5, fontWeight: 500,
                      color: "var(--muted-foreground)",
                    }}>
                      {cat.count} products
                    </span>
                    <span style={{
                      fontFamily: "var(--font-dm-mono)",
                      fontSize: 11.5,
                      color: "var(--muted-foreground)",
                    }}>
                      Updated {cat.updated}
                    </span>
                  </div>
                  <span style={{ color: "var(--accent)", display: "flex" }}>
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparisons() {
  return (
    <section style={{ padding: "72px 24px", backgroundColor: "var(--secondary)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 48,
          alignItems: "start",
        }} className="two-col-grid">
          <div>
            <SectionLabel>Comparison Library</SectionLabel>
            <h2 style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 600, letterSpacing: "-0.02em",
              color: "var(--foreground)", marginBottom: 16,
            }}>
              Which one should you actually buy?
            </h2>
            <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.65, marginBottom: 24 }}>
              Head-to-head comparisons use identical criteria: one-time cost, subscription cost, reliability data, and which type of owner each product suits.
            </p>
            <Link href="/comparisons/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 14, fontWeight: 600,
              color: "var(--primary)",
              textDecoration: "none",
            }}>
              All comparisons <ArrowRight />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {COMPARISONS.map((comp, i) => (
              <Link
                key={i}
                href={comp.href}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16,
                  alignItems: "center",
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "18px 22px",
                  textDecoration: "none",
                  color: "var(--card-foreground)",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: "var(--font-fraunces)",
                      fontSize: 17, fontWeight: 600,
                    }}>
                      {comp.a}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-dm-mono)",
                      fontSize: 11, fontWeight: 500,
                      color: "var(--muted-foreground)",
                      backgroundColor: "var(--muted)",
                      padding: "2px 8px",
                      borderRadius: 2,
                    }}>vs</span>
                    <span style={{
                      fontFamily: "var(--font-fraunces)",
                      fontSize: 17, fontWeight: 600,
                    }}>
                      {comp.b}
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "var(--muted-foreground)" }}>
                    {comp.verdict}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: 11.5, color: "var(--muted-foreground)",
                    marginBottom: 4,
                  }}>
                    {comp.views} views
                  </div>
                  <span style={{ color: "var(--accent)" }}><ArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BestPicks() {
  return (
    <section style={{ padding: "72px 24px", backgroundColor: "var(--background)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Scene-Based Buying Guides</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 600, letterSpacing: "-0.02em",
            color: "var(--foreground)", marginBottom: 12,
          }}>
            Best picks for your situation.
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", maxWidth: 500, lineHeight: 1.6 }}>
            Each guide states budget, trade-offs, and who it does and doesn't suit — not just a ranked list.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
        }}>
          {BEST_PICKS.map((pick, i) => (
            <Link
              key={i}
              href={pick.href}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: "0 6px 6px 0",
                padding: "18px 20px",
                textDecoration: "none",
                color: "var(--card-foreground)",
                fontSize: 14.5, fontWeight: 500,
                lineHeight: 1.4,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--card)")}
            >
              {pick.title}
              <span style={{ color: "var(--accent)", flexShrink: 0 }}><ArrowRight /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Troubleshooting() {
  const difficultyColor = (d: string) => d === "Easy fix" ? "#16a34a" : "#b45309";

  return (
    <section style={{ padding: "72px 24px", backgroundColor: "var(--primary)", color: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 48,
          alignItems: "start",
        }} className="two-col-grid">
          <div>
            <SectionLabel>Troubleshooting Library</SectionLabel>
            <h2 style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 600, letterSpacing: "-0.02em",
              color: "white", marginBottom: 16,
            }}>
              Product not working right?
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 24 }}>
              Step-by-step fixes organized by symptom: confirm the problem, common causes, and when to contact support or replace the unit.
            </p>
            <Link href="/troubleshooting/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 14, fontWeight: 600,
              color: "var(--accent)",
              textDecoration: "none",
            }}>
              All troubleshooting guides <ArrowRight />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TROUBLESHOOTING.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16,
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  padding: "16px 20px",
                  textDecoration: "none",
                  color: "white",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)")}
              >
                <div>
                  <span style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: 11, fontWeight: 500,
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.05em",
                    display: "block", marginBottom: 4,
                  }}>
                    {item.product}
                  </span>
                  <span style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.35 }}>
                    {item.problem}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11.5, fontWeight: 600,
                    fontFamily: "var(--font-dm-mono)",
                    color: difficultyColor(item.difficulty),
                    backgroundColor: `${difficultyColor(item.difficulty)}22`,
                    border: `1px solid ${difficultyColor(item.difficulty)}44`,
                    padding: "2px 8px",
                    borderRadius: 3,
                    whiteSpace: "nowrap",
                  }}>
                    {item.difficulty}
                  </span>
                  <span style={{ color: "var(--accent)" }}><ArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Methodology() {
  const pillars = [
    { icon: "🔬", title: "Documented methods", body: "Every research decision is recorded: which specs were compared, which sources were consulted, and on what date." },
    { icon: "📅", title: "Dated and updated", body: "Pages show a last-checked date and are flagged for review when price, spec, or availability changes." },
    { icon: "💬", title: "Error correction", body: "Readers can submit corrections. Verified changes are applied and noted on the page with a changelog entry." },
    { icon: "🔗", title: "Commercial disclosure", body: "Affiliate links are labeled. Sponsored content, if any, is disclosed at the top of the page — not the bottom." },
  ];

  return (
    <section style={{ padding: "72px 24px", backgroundColor: "var(--secondary)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 44 }}>
          <SectionLabel>How We Work</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 600, letterSpacing: "-0.02em",
            color: "var(--foreground)", marginBottom: 12,
          }}>
            Research you can verify, not just trust.
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 48,
        }}>
          {pillars.map((p, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "24px 24px 22px",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 14 }}>{p.icon}</div>
              <h3 style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: 17, fontWeight: 600,
                marginBottom: 8, letterSpacing: "-0.01em",
              }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: "var(--primary)",
          borderRadius: 8,
          padding: "36px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}>
          <div>
            <h3 style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: 22, fontWeight: 600,
              color: "white", marginBottom: 8, letterSpacing: "-0.01em",
            }}>
              Found an error or outdated information?
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 480, lineHeight: 1.55 }}>
              Submit a correction and we'll verify and update within 5 business days.
            </p>
          </div>
          <Link href="/contact/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "var(--accent)",
            color: "white",
            padding: "12px 22px",
            borderRadius: 4,
            fontSize: 14.5, fontWeight: 600,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "opacity 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Submit a correction <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    {
      heading: "Products",
      links: [
        { label: "Automatic Litter Boxes", href: "/products/automatic-litter-boxes/" },
        { label: "Smart Pet Feeders", href: "/products/smart-pet-feeders/" },
        { label: "GPS Pet Trackers", href: "/products/gps-pet-trackers/" },
        { label: "Pet Cameras", href: "/products/pet-cameras/" },
      ],
    },
    {
      heading: "Research",
      links: [
        { label: "Comparisons", href: "/comparisons/" },
        { label: "Best Picks", href: "/best-picks/" },
        { label: "Troubleshooting", href: "/troubleshooting/" },
        { label: "Guides", href: "/guides/" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About PetMetric", href: "/about/" },
        { label: "Editorial Standards", href: "/editorial-standards/" },
        { label: "Disclosure", href: "/disclosure/" },
        { label: "Contact", href: "/contact/" },
      ],
    },
  ];

  return (
    <footer style={{
      backgroundColor: "#0c1826",
      color: "rgba(255,255,255,0.5)",
      padding: "56px 24px 32px",
      fontFamily: "var(--font-source-sans)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
          marginBottom: 48,
          paddingBottom: 40,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }} className="footer-grid">
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 28, height: 28,
                backgroundColor: "var(--accent)",
                borderRadius: 3,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                </svg>
              </div>
              <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                PetMetric
              </span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, maxWidth: 280, marginBottom: 16 }}>
              Independent research on pet technology. We disclose our methods, sources, and commercial relationships on every page.
            </p>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11.5, color: "rgba(255,255,255,0.3)" }}>
              Last site update: Sep 4, 2026
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <p style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 11, fontWeight: 500,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 16,
              }}>
                {col.heading}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} style={{
                      fontSize: 13.5, color: "rgba(255,255,255,0.55)",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.88)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12.5 }}>
            © 2026 PetMetric. All product names are trademarks of their respective owners.
          </p>
          <p style={{ fontSize: 12.5 }}>
            PetMetric earns commissions from qualifying affiliate links.{" "}
            <Link href="/disclosure/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Full disclosure →</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Automatic Litter Boxes Category Page ────────────────────────────────────

type LitterBoxProduct = {
  id: string;
  name: string;
  brand: string;
  slug: string;
  img: string;
  alt: string;
  price: number;
  priceDisplay: string;
  subscription: string | null;
  score: number;
  verdict: string;
  bestFor: string;
  catCount: "1" | "1–2" | "2–4" | "4+";
  litterType: "clumping" | "crystal" | "any";
  hasApp: boolean;
  updated: string;
  tags: string[];
  highlight?: boolean;
};

const LITTER_BOX_PRODUCTS: LitterBoxProduct[] = [
  {
    id: "lr4",
    name: "Litter-Robot 4",
    brand: "Whisker",
    slug: "litter-robot-4",
    img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=440&fit=crop&auto=format",
    alt: "Litter-Robot 4 automatic self-cleaning litter box",
    price: 699,
    priceDisplay: "$699",
    subscription: "Optional $12.49/mo",
    score: 4.3,
    verdict: "The most reliable automatic litter box we've researched, with the best app-based health monitoring.",
    bestFor: "Multi-cat households (2–4 cats)",
    catCount: "2–4",
    litterType: "clumping",
    hasApp: true,
    updated: "Aug 2026",
    tags: ["Editor's pick", "Multi-cat"],
    highlight: true,
  },
  {
    id: "petkit-pura-max",
    name: "PETKIT PURA MAX",
    brand: "PETKIT",
    slug: "petkit-pura-max",
    img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=440&fit=crop&auto=format",
    alt: "PETKIT PURA MAX automatic litter box",
    price: 399,
    priceDisplay: "$399",
    subscription: "None required",
    score: 3.9,
    verdict: "Solid mid-range option with a competitive feature set at nearly half the Litter-Robot price.",
    bestFor: "Budget-conscious single-cat owners",
    catCount: "1–2",
    litterType: "clumping",
    hasApp: true,
    updated: "Aug 2026",
    tags: ["Budget pick"],
  },
  {
    id: "petsafe-scoopfree",
    name: "PetSafe ScoopFree Ultra",
    brand: "PetSafe",
    slug: "petsafe-scoopfree-ultra",
    img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=440&fit=crop&auto=format",
    alt: "PetSafe ScoopFree crystal litter box",
    price: 179,
    priceDisplay: "$179",
    subscription: "$28–35/mo (crystal trays)",
    score: 3.6,
    verdict: "Best entry price; crystal litter trays mean excellent odor control but higher monthly costs.",
    bestFor: "Single-cat owners preferring crystal litter",
    catCount: "1",
    litterType: "crystal",
    hasApp: false,
    updated: "Jul 2026",
    tags: ["Lowest upfront"],
  },
  {
    id: "catlink-luxury",
    name: "CATLINK Luxury Pro X",
    brand: "CATLINK",
    slug: "catlink-luxury-pro-x",
    img: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=440&fit=crop&auto=format",
    alt: "CATLINK Luxury Pro X self-cleaning litter box",
    price: 499,
    priceDisplay: "$499",
    subscription: "None",
    score: 3.8,
    verdict: "Globe-style unit similar to Litter-Robot with more color options; app is less refined.",
    bestFor: "Owners wanting Litter-Robot style at lower cost",
    catCount: "1–2",
    litterType: "clumping",
    hasApp: true,
    updated: "Jun 2026",
    tags: [],
  },
  {
    id: "petkit-pura-x",
    name: "PETKIT PURA X",
    brand: "PETKIT",
    slug: "petkit-pura-x",
    img: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=440&fit=crop&auto=format",
    alt: "PETKIT PURA X enclosed automatic litter box",
    price: 549,
    priceDisplay: "$549",
    subscription: "None",
    score: 4.0,
    verdict: "Enclosed globe with quieter motor than the PURA MAX; good app with multi-cat weight identification.",
    bestFor: "Owners with 2 cats who want app health tracking",
    catCount: "1–2",
    litterType: "clumping",
    hasApp: true,
    updated: "Sep 2026",
    tags: ["New"],
  },
  {
    id: "litter-robot-3-connect",
    name: "Litter-Robot 3 Connect",
    brand: "Whisker",
    slug: "litter-robot-3-connect",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=440&fit=crop&auto=format",
    alt: "Litter-Robot 3 Connect litter box refurbished",
    price: 499,
    priceDisplay: "$499",
    subscription: "Optional $12.49/mo",
    score: 3.9,
    verdict: "Previous-gen Litter-Robot — still reliable, quieter update motor, available refurbished from Whisker.",
    bestFor: "Litter-Robot buyers on a tighter budget",
    catCount: "1–2",
    litterType: "clumping",
    hasApp: true,
    updated: "May 2026",
    tags: ["Refurb available"],
  },
];

const BUYING_CRITERIA = [
  {
    icon: "🐱",
    label: "Number of cats",
    body: "Single-cat households can use any unit. Two or more cats need a larger waste drawer capacity and faster cycle recovery — the Litter-Robot 4 is the most tested option for 3–4 cats.",
  },
  {
    icon: "🪣",
    label: "Litter type",
    body: "Most automatic boxes require clumping litter. Only crystal-tray units (like PetSafe ScoopFree) accept crystal. Pine, paper, and walnut litters will block sensors or damage mechanisms.",
  },
  {
    icon: "💰",
    label: "Total cost of ownership",
    body: "Compare both the unit price and the ongoing litter + subscription cost. A $179 unit with $35/mo in crystal trays costs more over 12 months than a $699 unit with $18/mo in clumping litter.",
  },
  {
    icon: "📱",
    label: "App and connectivity",
    body: "App-connected units let you monitor usage patterns and catch health changes early. Not all apps are equally reliable — check the App Store rating and review count before deciding.",
  },
  {
    icon: "🔊",
    label: "Noise level",
    body: "Cycling noise ranges from ~42 dB (very quiet) to ~58 dB (noticeable in the same room). If the box will be in a bedroom or open living space, prioritize models rated under 50 dB.",
  },
];

const LB_FAQ = [
  {
    q: "Can automatic litter boxes work for large cats?",
    a: "Most globe-style units (Litter-Robot, CATLINK) have a 25 lb weight limit and a globe opening sized for average adult cats. Very large breeds like Maine Coons (often 18–25 lb) may find the opening tight — the Litter-Robot 4's opening is 15.75 inches wide, which accommodates most but not all large cats.",
  },
  {
    q: "Do kittens need a different setting?",
    a: "Yes. Globe-style boxes use a weight sensor to detect when a cat exits before cycling. Kittens under 3 lb may not trigger the sensor reliably. The Litter-Robot 4 and PETKIT PURA X both have a kitten mode that disables automatic cycling until the kitten reaches the minimum weight.",
  },
  {
    q: "How often do I need to empty and clean the unit?",
    a: "With one cat, most users empty the waste drawer every 7–10 days. With two cats, every 3–5 days. A full clean (globe wash, sensor wipe-down) is recommended monthly. Units with odor-control pods need pod replacement every 4–6 weeks.",
  },
  {
    q: "Are the ongoing litter costs really higher with crystal-tray units?",
    a: "In most cases, yes. Replacement crystal trays cost $28–35 each and typically last 4 weeks per cat. Clumping litter for a single-cat household costs roughly $15–22/month. The difference compounds over a year: $336–420 for crystal vs. $180–264 for clumping.",
  },
];

const SORT_OPTIONS = [
  { label: "Our ranking", value: "rank" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "PetMetric score", value: "score" },
];

function ScoreRing({ score }: { score: number }) {
  const color = score >= 4.2 ? "#16a34a" : score >= 3.7 ? "var(--accent)" : "#dc2626";
  return (
    <div style={{
      width: 44, height: 44,
      backgroundColor: "var(--primary)",
      borderRadius: 6,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 16, fontWeight: 600, color, lineHeight: 1 }}>{score.toFixed(1)}</span>
      <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>/5</span>
    </div>
  );
}

function AutomaticLitterBoxesPage() {
  const [sortBy, setSortBy] = useState("rank");
  const [filterCats, setFilterCats] = useState<string>("all");
  const [filterLitter, setFilterLitter] = useState<string>("all");
  const [filterApp, setFilterApp] = useState<boolean | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(800);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sorted = [...LITTER_BOX_PRODUCTS]
    .filter((p) => filterCats === "all" || p.catCount === filterCats)
    .filter((p) => filterLitter === "all" || p.litterType === filterLitter)
    .filter((p) => filterApp === null || p.hasApp === filterApp)
    .filter((p) => p.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "score") return b.score - a.score;
      return (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0) || b.score - a.score;
    });

  const activeFilterCount = [
    filterCats !== "all",
    filterLitter !== "all",
    filterApp !== null,
    maxPrice < 800,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilterCats("all");
    setFilterLitter("all");
    setFilterApp(null);
    setMaxPrice(800);
  };

  const FilterPanel = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Max price */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600 }}>Max price</p>
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>${maxPrice}</span>
        </div>
        <input
          type="range" min={150} max={800} step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>$150</span>
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>$800</span>
        </div>
      </div>

      {/* Cats */}
      <div>
        <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 10 }}>Number of cats</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {([["all","Any number"], ["1","1 cat"], ["1–2","1–2 cats"], ["2–4","2–4 cats"]] as [string,string][]).map(([val, label]) => (
            <button key={val} onClick={() => setFilterCats(val)} style={{
              padding: "8px 14px", fontSize: 13.5, fontWeight: 500, textAlign: "left",
              backgroundColor: filterCats === val ? "var(--primary)" : "transparent",
              color: filterCats === val ? "white" : "var(--secondary-foreground)",
              border: `1px solid ${filterCats === val ? "var(--primary)" : "var(--border)"}`,
              borderRadius: 4, cursor: "pointer", transition: "all 0.12s",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Litter type */}
      <div>
        <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 10 }}>Litter type</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {([["all","Any type"], ["clumping","Clumping clay"], ["crystal","Crystal trays"]] as [string,string][]).map(([val, label]) => (
            <button key={val} onClick={() => setFilterLitter(val)} style={{
              padding: "8px 14px", fontSize: 13.5, fontWeight: 500, textAlign: "left",
              backgroundColor: filterLitter === val ? "var(--primary)" : "transparent",
              color: filterLitter === val ? "white" : "var(--secondary-foreground)",
              border: `1px solid ${filterLitter === val ? "var(--primary)" : "var(--border)"}`,
              borderRadius: 4, cursor: "pointer", transition: "all 0.12s",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* App */}
      <div>
        <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 10 }}>App connectivity</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {([[null,"Any"], [true,"With app"], [false,"No app required"]] as [boolean|null,string][]).map(([val, label]) => (
            <button key={String(val)} onClick={() => setFilterApp(val)} style={{
              padding: "8px 14px", fontSize: 13.5, fontWeight: 500, textAlign: "left",
              backgroundColor: filterApp === val ? "var(--primary)" : "transparent",
              color: filterApp === val ? "white" : "var(--secondary-foreground)",
              border: `1px solid ${filterApp === val ? "var(--primary)" : "var(--border)"}`,
              borderRadius: 4, cursor: "pointer", transition: "all 0.12s",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={resetFilters} style={{
          padding: "9px 14px", fontSize: 13, fontWeight: 600,
          color: "var(--accent)", backgroundColor: "transparent",
          border: "1px solid var(--accent)", borderRadius: 4, cursor: "pointer",
        }}>
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );

  const _FilterBtn = ({
    active, onClick, children,
  }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      style={{
        padding: "6px 13px",
        fontSize: 13, fontWeight: 500,
        backgroundColor: active ? "var(--primary)" : "var(--card)",
        color: active ? "white" : "var(--foreground)",
        border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 4, cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >{children}</button>
  );

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div style={{ backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)", padding: "11px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            {([
              { label: "Home", href: "/" },
              { label: "Products", href: "/products/" },
              { label: "Automatic Litter Boxes", href: null },
            ] as { label: string; href: string | null }[]).map((crumb, i, arr) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {crumb.href
                  ? <Link href={crumb.href} style={{ fontSize: 12.5, color: "var(--muted-foreground)", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                    >{crumb.label}</Link>
                  : <span style={{ fontSize: 12.5, color: "var(--foreground)", fontWeight: 600 }}>{crumb.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: "var(--border)", fontSize: 12 }}>/</span>}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{
        position: "relative",
        backgroundColor: "var(--primary)",
        overflow: "hidden",
      }}>
        <img
          src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1400&h=500&fit=crop&auto=format"
          alt=""
          aria-hidden
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.12,
          }}
        />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "52px 24px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "end" }} className="cat-header-grid">
            <div>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>
                Products / Automatic Litter Boxes
              </p>
              <h1 style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(30px, 4.5vw, 52px)",
                fontWeight: 600, letterSpacing: "-0.025em",
                color: "white", lineHeight: 1.08, marginBottom: 18,
              }}>
                Automatic Litter Boxes
              </h1>
              <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, maxWidth: 580 }}>
                Self-cleaning units for single and multi-cat households. We document reliability, app quality, noise levels, and the full cost of ownership — upfront and ongoing.
              </p>
            </div>

            {/* Stats block */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 28px",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "20px 24px",
              flexShrink: 0,
              minWidth: 240,
            }}>
              {[
                { n: "34", l: "products" },
                { n: "6", l: "reviewed in depth" },
                { n: "Aug 2026", l: "last updated" },
                { n: "3", l: "comparisons" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 600, color: "var(--accent)", lineHeight: 1, marginBottom: 3 }}>{n}</p>
                  <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Buying criteria bar ── */}
      <div style={{ backgroundColor: "#101e33", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderLeft: "1px solid rgba(255,255,255,0.06)" }} className="criteria-grid">
            {BUYING_CRITERIA.map((c, i) => (
              <div key={i} style={{
                padding: "20px 20px",
                borderRight: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{c.label}</p>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main: sidebar + product list ── */}
      <div style={{ backgroundColor: "var(--background)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "256px 1fr", gap: 0 }} className="cat-body-grid">

          {/* ── Left sidebar ── */}
          <aside style={{
            borderRight: "1px solid var(--border)",
            padding: "32px 24px",
            position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600 }}>
                Filters
              </p>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 10.5, fontWeight: 600,
                  color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0,
                }}>
                  Clear {activeFilterCount}
                </button>
              )}
            </div>

            <FilterPanel />

            {/* Related links */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 14 }}>Related</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Best for multiple cats", href: "/best-picks/best-automatic-litter-box-multiple-cats/" },
                  { label: "LR4 vs PETKIT PURA MAX", href: "/comparisons/litter-robot-4-vs-petkit-pura-max/" },
                  { label: "LR4 not cycling — fix", href: "/troubleshooting/litter-robot-4-not-cycling/" },
                ].map((l) => (
                  <Link key={l.label} href={l.href} style={{
                    fontSize: 13, color: "var(--muted-foreground)", textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "color 0.12s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                  >
                    <ArrowRight size={11} /> {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Product list ── */}
          <div style={{ padding: "32px 32px 72px" }}>

            {/* Sort + count bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 24, paddingBottom: 20,
              borderBottom: "1px solid var(--border)",
              gap: 12, flexWrap: "wrap",
            }}>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "var(--muted-foreground)" }}>
                Showing <strong style={{ color: "var(--foreground)" }}>{sorted.length}</strong> of {LITTER_BOX_PRODUCTS.length} products
                {activeFilterCount > 0 && <span style={{ color: "var(--accent)" }}> · {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active</span>}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.05em" }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "7px 12px", fontSize: 13, fontWeight: 500,
                    backgroundColor: "var(--card)", color: "var(--foreground)",
                    border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer",
                    fontFamily: "var(--font-source-sans)",
                  }}
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sorted.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: "var(--card)",
                    border: `1px solid ${p.highlight ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 6,
                    overflow: "hidden",
                    transition: "box-shadow 0.18s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  {/* Editor pick banner */}
                  {p.highlight && (
                    <div style={{
                      backgroundColor: "var(--accent)",
                      padding: "5px 20px",
                    }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: "white", fontFamily: "var(--font-dm-mono)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                        ★ Editor's pick — most reliable in category
                      </span>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 190px" }} className="product-card-grid">
                    {/* Rank + image */}
                    <div style={{ position: "relative", backgroundColor: "var(--muted)" }}>
                      <img src={p.img} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 168 }} />
                      <div style={{
                        position: "absolute", top: 10, left: 10,
                        width: 28, height: 28,
                        backgroundColor: p.highlight ? "var(--accent)" : "rgba(20,30,52,0.8)",
                        borderRadius: 4,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 12, fontWeight: 700, color: "white" }}>#{i + 1}</span>
                      </div>
                    </div>

                    {/* Main content */}
                    <div style={{ padding: "20px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "var(--muted-foreground)", letterSpacing: "0.04em" }}>{p.brand}</span>
                        {p.tags.filter((t) => t !== "Editor's pick").map((tag) => (
                          <span key={tag} style={{
                            fontFamily: "var(--font-dm-mono)", fontSize: 10, fontWeight: 700,
                            color: "var(--primary)", backgroundColor: "var(--secondary)",
                            border: "1px solid var(--border)", padding: "1px 7px", borderRadius: 2,
                            letterSpacing: "0.05em", textTransform: "uppercase",
                          }}>{tag}</span>
                        ))}
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, color: "var(--muted-foreground)", marginLeft: "auto" }}>Updated {p.updated}</span>
                      </div>

                      <h3 style={{
                        fontFamily: "var(--font-fraunces)",
                        fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em",
                        color: "var(--foreground)", lineHeight: 1.15, marginBottom: 9,
                      }}>{p.name}</h3>

                      <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 16 }}>
                        {p.verdict}
                      </p>

                      {/* Specs pills */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {[
                          { label: p.catCount === "1" ? "1 cat" : `${p.catCount} cats` },
                          { label: p.litterType === "clumping" ? "Clumping" : "Crystal" },
                          { label: p.hasApp ? "App" : "No app" },
                        ].map(({ label }) => (
                          <span key={label} style={{
                            fontFamily: "var(--font-dm-mono)",
                            fontSize: 11, fontWeight: 500,
                            color: "var(--secondary-foreground)",
                            backgroundColor: "var(--secondary)",
                            border: "1px solid var(--border)",
                            padding: "3px 10px", borderRadius: 3,
                          }}>{label}</span>
                        ))}
                      </div>

                      {/* Best-for line */}
                      <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Best for:</span> {p.bestFor}
                      </p>
                    </div>

                    {/* Price + CTA column */}
                    <div style={{
                      borderLeft: "1px solid var(--border)",
                      padding: "20px 20px",
                      display: "flex", flexDirection: "column", justifyContent: "space-between",
                    }}>
                      <div>
                        {/* Score */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <ScoreRing score={p.score} />
                          <div>
                            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.05em", marginBottom: 1 }}>PETMETRIC</p>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>Score</p>
                          </div>
                        </div>

                        {/* Price */}
                        <p style={{
                          fontFamily: "var(--font-fraunces)",
                          fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em",
                          color: "var(--foreground)", lineHeight: 1, marginBottom: 4,
                        }}>{p.priceDisplay}</p>
                        {p.subscription && (
                          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "var(--muted-foreground)", lineHeight: 1.45, marginBottom: 16 }}>
                            {p.subscription}
                          </p>
                        )}
                      </div>

                      {/* CTAs */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Link href={`/reviews/${p.slug}/`} style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          backgroundColor: "var(--primary)", color: "white",
                          padding: "10px 14px", borderRadius: 4,
                          fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                          transition: "opacity 0.15s",
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          Read review <ArrowRight size={13} />
                        </Link>
                        <a href={`#buy-${p.id}`} style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          backgroundColor: "var(--accent)", color: "white",
                          padding: "10px 14px", borderRadius: 4,
                          fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                          transition: "opacity 0.15s",
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          Check price <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {sorted.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "72px 24px",
                  backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 6,
                }}>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, marginBottom: 10, color: "var(--foreground)" }}>No products match these filters.</p>
                  <p style={{ fontSize: 14, color: "var(--muted-foreground)", marginBottom: 22 }}>Try widening your price range or removing a filter.</p>
                  <button onClick={resetFilters} style={{
                    padding: "10px 20px", fontSize: 14, fontWeight: 600,
                    backgroundColor: "var(--primary)", color: "white",
                    border: "none", borderRadius: 4, cursor: "pointer",
                  }}>Clear all filters</button>
                </div>
              )}
            </div>

            {/* Pricing note */}
            <div style={{
              marginTop: 28,
              display: "flex", gap: 10, alignItems: "flex-start",
              backgroundColor: "var(--secondary)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--primary)",
              borderRadius: "0 6px 6px 0",
              padding: "14px 18px",
            }}>
              <span style={{ color: "var(--muted-foreground)", fontSize: 16, flexShrink: 0 }}>ℹ</span>
              <p style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                Prices last checked Sep 1, 2026. Subscription costs show the lowest available tier. Consider total 12-month cost (unit + litter + subscription) before comparing unit prices alone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── All products table ── */}
      <div style={{ backgroundColor: "var(--secondary)", borderTop: "1px solid var(--border)", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <SectionLabel>At a glance</SectionLabel>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
              All {LITTER_BOX_PRODUCTS.length} products compared
            </h2>
          </div>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 680 }}>
              <thead>
                <tr style={{ backgroundColor: "var(--primary)" }}>
                  {["#", "Product", "Score", "Unit price", "Subscription", "Cats", "Litter", "App", ""].map((h, hi) => (
                    <th key={hi} style={{
                      padding: "11px 14px", textAlign: "left",
                      fontFamily: "var(--font-dm-mono)", fontSize: 10.5, fontWeight: 600,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LITTER_BOX_PRODUCTS.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{ backgroundColor: p.highlight ? "#fffbf5" : i % 2 === 0 ? "var(--card)" : "var(--secondary)" }}
                  >
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "var(--muted-foreground)" }}>#{i + 1}</span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {p.highlight && <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0, display: "inline-block" }} />}
                        <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{
                        fontFamily: "var(--font-dm-mono)", fontSize: 13.5, fontWeight: 700,
                        color: p.score >= 4.2 ? "#16a34a" : p.score >= 3.7 ? "var(--accent)" : "#dc2626",
                      }}>{p.score.toFixed(1)}</span>
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: "var(--font-dm-mono)", fontWeight: 600, color: "var(--foreground)" }}>{p.priceDisplay}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: "var(--muted-foreground)" }}>{p.subscription ?? "None"}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: "var(--muted-foreground)" }}>{p.catCount}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: "var(--muted-foreground)", textTransform: "capitalize" }}>{p.litterType}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: p.hasApp ? "#16a34a" : "var(--muted-foreground)" }}>
                        {p.hasApp ? "✓" : "–"}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <Link href={`/reviews/${p.slug}/`} style={{ fontSize: 12.5, fontWeight: 600, color: "var(--accent)", textDecoration: "none", whiteSpace: "nowrap" }}>
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ backgroundColor: "var(--background)", padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <SectionLabel>Common questions</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-fraunces)", fontSize: 30, fontWeight: 600,
            letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 36,
          }}>
            Frequently asked questions
          </h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
            {LB_FAQ.map((item, i) => (
              <div key={i} style={{ borderBottom: i < LB_FAQ.length - 1 ? "1px solid var(--border)" : "none" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", textAlign: "left",
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
                    padding: "20px 24px",
                    backgroundColor: openFaq === i ? "#fdf8f3" : "var(--card)",
                    border: "none", cursor: "pointer", transition: "background 0.15s",
                  }}
                >
                  <span style={{ fontSize: 15.5, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.4 }}>{item.q}</span>
                  <span style={{
                    color: "var(--accent)", flexShrink: 0, fontSize: 22, lineHeight: 1, marginTop: -1,
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s", display: "inline-block",
                  }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "2px 24px 22px", backgroundColor: "#fdf8f3" }}>
                    <p style={{ fontSize: 14.5, color: "var(--muted-foreground)", lineHeight: 1.72 }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Comparisons Page ────────────────────────────────────────────────────────

const CATEGORY_FILTERS = [
  { label: "All Categories", slug: "all" },
  { label: "Automatic Litter Boxes", slug: "automatic-litter-boxes" },
  { label: "GPS Pet Trackers", slug: "gps-pet-trackers" },
  { label: "Smart Pet Feeders", slug: "smart-pet-feeders" },
  { label: "Pet Cameras", slug: "pet-cameras" },
];

function WinnerDot({ winner }: { winner: "a" | "b" | "tie" }) {
  if (winner === "tie")
    return <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)", backgroundColor: "var(--muted)", padding: "2px 8px", borderRadius: 2, whiteSpace: "nowrap" }}>Tie</span>;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11.5, fontWeight: 600, fontFamily: "var(--font-dm-mono)",
      color: "#16a34a",
      backgroundColor: "#dcfce7",
      border: "1px solid #bbf7d0",
      padding: "2px 8px",
      borderRadius: 2,
      whiteSpace: "nowrap",
    }}>
      ✓ {winner === "a" ? "Winner" : "Winner"}
    </span>
  );
}

function ComparisonCard({ comp, onOpen }: { comp: ComparisonFull; onOpen: (c: ComparisonFull) => void }) {
  return (
    <div
      onClick={() => onOpen(comp)}
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.09)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Category badge */}
      <div style={{
        backgroundColor: "var(--primary)",
        padding: "10px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: 10.5, fontWeight: 500,
          letterSpacing: "0.07em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
        }}>{comp.category}</span>
        <span style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: 10.5, color: "rgba(255,255,255,0.35)",
        }}>Updated {comp.updated}</span>
      </div>

      <div style={{ padding: "22px 22px 20px" }}>
        {/* VS header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 17, fontWeight: 600,
            color: "var(--foreground)", lineHeight: 1.2,
          }}>{comp.a}</span>
          <span style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 10.5, fontWeight: 500,
            color: "var(--muted-foreground)",
            backgroundColor: "var(--muted)",
            padding: "3px 9px", borderRadius: 2, flexShrink: 0,
          }}>vs</span>
          <span style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 17, fontWeight: 600,
            color: "var(--foreground)", lineHeight: 1.2,
          }}>{comp.b}</span>
        </div>

        <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.55, marginBottom: 18 }}>
          {comp.verdict}
        </p>

        {/* Best for chips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
          {comp.bestFor.map((bf, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 10.5, fontWeight: 600,
                color: "var(--accent-foreground)",
                backgroundColor: "var(--accent)",
                padding: "2px 8px", borderRadius: 2,
                whiteSpace: "nowrap", flexShrink: 0, marginTop: 1,
              }}>{bf.pick}</span>
              <span style={{ fontSize: 12.5, color: "var(--muted-foreground)", lineHeight: 1.4 }}>{bf.who}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 11.5, color: "var(--muted-foreground)",
          }}>{comp.views} views</span>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600,
            color: "var(--accent)",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>
            Full comparison <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ComparisonDetailModal({ comp, onClose }: { comp: ComparisonFull; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(10,16,30,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "var(--card)",
        borderRadius: 8,
        border: "1px solid var(--border)",
        maxWidth: 780, width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
      }}>
        {/* Modal header */}
        <div style={{
          backgroundColor: "var(--primary)",
          padding: "20px 28px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
          borderRadius: "8px 8px 0 0",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)", marginBottom: 8,
            }}>{comp.category} · Updated {comp.updated}</p>
            <h2 style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: 24, fontWeight: 600,
              color: "white", letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}>
              {comp.a} <span style={{ color: "var(--accent)", fontWeight: 400 }}>vs</span> {comp.b}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)", borderRadius: 4,
              width: 32, height: 32, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 18, lineHeight: 1,
            }}
          >×</button>
        </div>

        <div style={{ padding: "28px 28px 32px" }}>
          {/* Verdict */}
          <div style={{
            backgroundColor: "var(--secondary)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: "0 6px 6px 0",
            padding: "16px 20px",
            marginBottom: 28,
          }}>
            <p style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase",
              color: "var(--muted-foreground)", marginBottom: 6,
            }}>Our verdict</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--foreground)" }}>{comp.verdict}</p>
          </div>

          {/* Best for */}
          <div style={{ marginBottom: 28 }}>
            <p style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--muted-foreground)", marginBottom: 14,
            }}>Best for</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {comp.bestFor.map((bf, i) => (
                <div key={i} style={{
                  backgroundColor: i === 0 ? "#f0fdf4" : "#fff7ed",
                  border: `1px solid ${i === 0 ? "#bbf7d0" : "#fed7aa"}`,
                  borderRadius: 6, padding: "14px 16px",
                }}>
                  <p style={{
                    fontFamily: "var(--font-fraunces)",
                    fontSize: 15, fontWeight: 600,
                    color: i === 0 ? "#15803d" : "#c2410c",
                    marginBottom: 4,
                  }}>{bf.pick}</p>
                  <p style={{ fontSize: 13, color: i === 0 ? "#166534" : "#9a3412", lineHeight: 1.45 }}>{bf.who}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Criteria table */}
          <div>
            <p style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--muted-foreground)", marginBottom: 14,
            }}>Side-by-side criteria</p>

            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 80px",
              gap: 0,
              backgroundColor: "var(--primary)",
              borderRadius: "6px 6px 0 0",
              padding: "10px 16px",
            }}>
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Criterion</span>
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{comp.a}</span>
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{comp.b}</span>
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Edge</span>
            </div>

            {/* Table rows */}
            {comp.criteria.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 80px",
                  gap: 0,
                  padding: "12px 16px",
                  backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--secondary)",
                  borderLeft: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: i === comp.criteria.length - 1 ? "1px solid var(--border)" : "1px solid var(--border)",
                  borderRadius: i === comp.criteria.length - 1 ? "0 0 6px 6px" : undefined,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--foreground)" }}>{row.label}</span>
                <span style={{
                  fontSize: 13.5,
                  color: row.winner === "a" ? "#15803d" : "var(--foreground)",
                  fontWeight: row.winner === "a" ? 600 : 400,
                }}>{row.aVal}</span>
                <span style={{
                  fontSize: 13.5,
                  color: row.winner === "b" ? "#15803d" : "var(--foreground)",
                  fontWeight: row.winner === "b" ? 600 : 400,
                }}>{row.bVal}</span>
                <div><WinnerDot winner={row.winner} /></div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href={comp.href} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              backgroundColor: "var(--accent)", color: "white",
              padding: "11px 20px", borderRadius: 4,
              fontSize: 14, fontWeight: 600, textDecoration: "none",
            }}>
              Full write-up <ExternalLink size={12} />
            </Link>
            <Link href={`/products/${comp.categorySlug}/`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              backgroundColor: "var(--secondary)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              padding: "11px 20px", borderRadius: 4,
              fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}>
              All {comp.category}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openComp, setOpenComp] = useState<ComparisonFull | null>(null);

  const filtered = activeFilter === "all"
    ? ALL_COMPARISONS
    : ALL_COMPARISONS.filter((c) => c.categorySlug === activeFilter);

  const featured = ALL_COMPARISONS.find((c) => c.featured)!;

  return (
    <>
      {openComp && (
        <ComparisonDetailModal comp={openComp} onClose={() => setOpenComp(null)} />
      )}

      {/* Page header */}
      <div style={{ backgroundColor: "var(--primary)", color: "white", padding: "52px 24px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Comparisons</span>
          </nav>
          <SectionLabel>Comparison Library</SectionLabel>
          <h1 style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(32px, 4vw, 50px)",
            fontWeight: 600, letterSpacing: "-0.02em",
            color: "white", marginBottom: 16, lineHeight: 1.1,
          }}>
            Which one should you actually buy?
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.65 }}>
            Every comparison uses identical criteria: one-time cost, subscription cost, reliability data, and a plain-language verdict on which owner each product suits.
          </p>
        </div>
      </div>

      {/* Featured comparison */}
      <div style={{ backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "var(--muted-foreground)", marginBottom: 20,
          }}>Most-read comparison</p>

          <div
            onClick={() => setOpenComp(featured)}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "center",
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderLeft: "4px solid var(--accent)",
              borderRadius: "0 8px 8px 0",
              padding: "28px 32px",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            className="featured-comp"
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: 22, fontWeight: 600,
                }}>{featured.a}</span>
                <span style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 11, fontWeight: 500,
                  color: "var(--muted-foreground)",
                  backgroundColor: "var(--muted)",
                  padding: "3px 10px", borderRadius: 2,
                }}>vs</span>
                <span style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: 22, fontWeight: 600,
                }}>{featured.b}</span>
              </div>
              <p style={{ fontSize: 14.5, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 16, maxWidth: 620 }}>
                {featured.verdict}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {featured.bestFor.map((bf, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{
                      fontFamily: "var(--font-dm-mono)",
                      fontSize: 10.5, fontWeight: 600,
                      color: "white",
                      backgroundColor: "var(--accent)",
                      padding: "2px 8px", borderRadius: 2,
                    }}>{bf.pick}</span>
                    <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>{bf.who}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: 22, fontWeight: 400,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}>{featured.views}</div>
              <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)", marginBottom: 16 }}>page views</div>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                backgroundColor: "var(--accent)", color: "white",
                padding: "10px 18px", borderRadius: 4,
                fontSize: 13.5, fontWeight: 600,
                border: "none", cursor: "pointer",
              }}>
                View full comparison <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar + grid */}
      <div style={{ padding: "40px 24px 72px", backgroundColor: "var(--background)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 11, color: "var(--muted-foreground)",
              letterSpacing: "0.06em", textTransform: "uppercase",
              marginRight: 4,
            }}>Filter:</span>
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.slug}
                onClick={() => setActiveFilter(f.slug)}
                style={{
                  padding: "7px 14px",
                  fontSize: 13.5, fontWeight: 500,
                  backgroundColor: activeFilter === f.slug ? "var(--primary)" : "var(--card)",
                  color: activeFilter === f.slug ? "white" : "var(--foreground)",
                  border: `1px solid ${activeFilter === f.slug ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {f.label}
              </button>
            ))}
            <span style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 11.5, color: "var(--muted-foreground)",
              marginLeft: "auto",
            }}>
              {filtered.length} comparison{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Comparison grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
          }}>
            {filtered.map((comp, i) => (
              <ComparisonCard key={i} comp={comp} onOpen={setOpenComp} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--muted-foreground)" }}>
              <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, marginBottom: 8 }}>No comparisons yet in this category.</p>
              <p style={{ fontSize: 14 }}>Check back soon — we publish new comparisons monthly.</p>
            </div>
          )}
        </div>
      </div>

      {/* Methodology note */}
      <div style={{ backgroundColor: "var(--secondary)", borderTop: "1px solid var(--border)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 40, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px" }}>
            <p style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--muted-foreground)", marginBottom: 10,
            }}>How comparisons are structured</p>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.65 }}>
              Each comparison uses the same criterion set for that category. Winners are declared per criterion, not as an overall score — because the right product depends on your situation, not a composite number.
            </p>
          </div>
          <div style={{ flex: "1 1 320px" }}>
            <p style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--muted-foreground)", marginBottom: 10,
            }}>Sources and pricing</p>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.65 }}>
              Prices are checked at the time of each update and may differ at purchase. Subscription costs reflect the lowest available plan unless otherwise noted. Each page shows the check date.
            </p>
          </div>
          <div style={{ flexShrink: 0, alignSelf: "center" }}>
            <Link href="/editorial-standards/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13.5, fontWeight: 600,
              color: "var(--primary)", textDecoration: "none",
            }}>
              Full methodology <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Product Page ─────────────────────────────────────────────────────────────

const LR4_SPECS = [
  { label: "Dimensions", value: "29.5 × 22 × 27 in" },
  { label: "Weight", value: "24 lb" },
  { label: "Litter type", value: "Clumping only" },
  { label: "Globe capacity", value: "~13 lb waste" },
  { label: "Noise level", value: "~47 dB (cycling)" },
  { label: "Connectivity", value: "Wi-Fi 2.4 GHz" },
  { label: "Power", value: "AC adapter (included)" },
  { label: "Subscription", value: "Optional — $12.49/mo" },
  { label: "Warranty", value: "18 months" },
  { label: "Cat weight limit", value: "3–25 lb" },
  { label: "Compatible litter", value: "Any clumping" },
  { label: "OdorTrap pod", value: "Optional add-on" },
];

const LR4_SCORES = [
  { label: "Reliability", score: 4.6, note: "Consistent cycling; rare jam reports" },
  { label: "Cleaning thoroughness", score: 4.4, note: "Separates clumps well at all fill levels" },
  { label: "Noise level", score: 4.2, note: "Quieter than most; audible at 47 dB" },
  { label: "App quality", score: 4.0, note: "4.4★ on App Store; health tracking works" },
  { label: "Ease of setup", score: 4.3, note: "~20 min; app pairs in under 2 min" },
  { label: "Long-term value", score: 4.1, note: "High upfront; low ongoing litter cost" },
];

const LR4_PROS = [
  "Globe design fully separates waste — no direct contact during cleaning",
  "App health tracking detects usage-pattern changes early",
  "Large waste drawer fits 30–50 cycles between empties (single cat)",
  "Quiet enough for bedroom placement",
  "No proprietary litter required — use any clumping brand",
];

const LR4_CONS = [
  "$699 entry price is the highest in the category",
  "Clumping-only: crystal, pine, or paper litters will damage the sensor",
  "Globe opening can be tight for large cats (>15 lb)",
  "OdorTrap pods cost $12–16/mo if you want the full odor system",
  "Occasional \"pinch detect\" false positives pause the cycle mid-run",
];

const LR4_RELATED_COMPARISONS = [
  { a: "Litter-Robot 4", b: "PETKIT PURA MAX", href: "/comparisons/litter-robot-4-vs-petkit-pura-max/" },
  { a: "Litter-Robot 4", b: "PetSafe ScoopFree", href: "/comparisons/litter-robot-4-vs-petsafe-scoopfree/" },
];

const LR4_TROUBLESHOOTING = [
  { problem: "Not cycling after waste deposit", href: "/troubleshooting/litter-robot-4-not-cycling/", difficulty: "Easy fix" },
  { problem: "Pinch detect fault — cycle stops mid-run", href: "/troubleshooting/litter-robot-4-pinch-detect/", difficulty: "Easy fix" },
  { problem: "Globe not rotating — motor noise but no movement", href: "/troubleshooting/litter-robot-4-globe-not-rotating/", difficulty: "Moderate" },
];

function ScoreBar({ score, max = 5 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color = score >= 4.3 ? "#16a34a" : score >= 3.8 ? "var(--accent)" : "#dc2626";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        flex: 1, height: 6, backgroundColor: "var(--muted)", borderRadius: 3, overflow: "hidden",
      }}>
        <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
      <span style={{
        fontFamily: "var(--font-dm-mono)",
        fontSize: 13, fontWeight: 500,
        color, minWidth: 28, textAlign: "right",
      }}>{score.toFixed(1)}</span>
    </div>
  );
}

function ProductPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "scores">("overview");
  const [activeImg, setActiveImg] = useState(0);

  const imgs = [
    { src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=900&h=700&fit=crop&auto=format", alt: "Litter-Robot 4 front view with cat nearby" },
    { src: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=900&h=700&fit=crop&auto=format", alt: "Cat using automatic litter box" },
    { src: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=900&h=700&fit=crop&auto=format", alt: "Close-up of litter-box globe mechanism" },
  ];

  const overallScore = (LR4_SCORES.reduce((s, r) => s + r.score, 0) / LR4_SCORES.length).toFixed(1);

  return (
    <>
      {/* Breadcrumb + page header */}
      <div style={{ backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)", padding: "14px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products/" },
              { label: "Automatic Litter Boxes", href: "/products/automatic-litter-boxes/" },
              { label: "Litter-Robot 4 Review", href: null },
            ].map((crumb, i, arr) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {crumb.href
                  ? <Link href={crumb.href!} style={{ fontSize: 13, color: "var(--muted-foreground)", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                    >{crumb.label}</Link>
                  : <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{crumb.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: "var(--border)", fontSize: 13 }}>/</span>}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero section: image gallery + buy panel */}
      <div style={{ backgroundColor: "var(--background)", padding: "48px 24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 56, alignItems: "start" }} className="product-hero-grid">

            {/* Gallery */}
            <div>
              <div style={{
                backgroundColor: "var(--muted)",
                borderRadius: 8,
                overflow: "hidden",
                aspectRatio: "4/3",
                marginBottom: 12,
                border: "1px solid var(--border)",
              }}>
                <img
                  src={imgs[activeImg].src}
                  alt={imgs[activeImg].alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.2s" }}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 72, height: 54,
                      borderRadius: 5,
                      overflow: "hidden",
                      border: `2px solid ${activeImg === i ? "var(--accent)" : "var(--border)"}`,
                      padding: 0, cursor: "pointer",
                      transition: "border-color 0.15s",
                      flexShrink: 0,
                    }}
                  >
                    <img src={img.src.replace("w=900&h=700", "w=150&h=110")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky buy panel */}
            <div style={{ position: "sticky", top: 76 }}>
              {/* Brand + category */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 10.5, fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--accent)",
                }}>Litter-Robot</span>
                <span style={{ color: "var(--border)" }}>·</span>
                <Link href="/products/automatic-litter-boxes/" style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 10.5, color: "var(--muted-foreground)",
                  textDecoration: "none", letterSpacing: "0.06em",
                }}>Automatic Litter Boxes</Link>
              </div>

              <h1 style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em",
                lineHeight: 1.1, marginBottom: 16,
                color: "var(--foreground)",
              }}>Litter-Robot 4</h1>

              {/* One-line verdict */}
              <div style={{
                backgroundColor: "var(--secondary)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: "0 6px 6px 0",
                padding: "12px 16px",
                marginBottom: 24,
              }}>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--foreground)" }}>
                  <strong>Best for:</strong> Multi-cat households (2–4 cats) and owners who want app-based health tracking. Overkill for a single cat on a tight budget.
                </p>
              </div>

              {/* Score */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 64, height: 64,
                  backgroundColor: "var(--primary)",
                  borderRadius: 8,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: "var(--font-fraunces)",
                    fontSize: 26, fontWeight: 600, color: "white", lineHeight: 1,
                  }}>{overallScore}</span>
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 9.5, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>/ 5.0</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "var(--foreground)", marginBottom: 2 }}>PetMetric Score</p>
                  <p style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>Average across 6 evaluated criteria</p>
                </div>
              </div>

              {/* Pricing */}
              <div style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "20px 20px",
                marginBottom: 20,
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontFamily: "var(--font-fraunces)",
                    fontSize: 30, fontWeight: 600,
                    color: "var(--foreground)", letterSpacing: "-0.02em",
                  }}>$699</span>
                  <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>one-time</span>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginBottom: 16 }}>
                  + optional $12.49/mo Connect subscription (health tracking, notifications)
                </p>
                <a href="#buy" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  backgroundColor: "var(--accent)", color: "white",
                  padding: "13px 20px", borderRadius: 4,
                  fontSize: 15, fontWeight: 600,
                  textDecoration: "none",
                  marginBottom: 10,
                  transition: "opacity 0.15s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Check price on Litter-Robot.com <ExternalLink size={13} />
                </a>
                <p style={{ fontSize: 11.5, color: "var(--muted-foreground)", textAlign: "center", lineHeight: 1.5 }}>
                  Affiliate link — we earn a commission at no cost to you.{" "}
                  <Link href="/disclosure/" style={{ color: "var(--muted-foreground)", textDecoration: "underline" }}>Full disclosure</Link>
                </p>
              </div>

              {/* Key quick specs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
                {[
                  { k: "Litter type", v: "Clumping only" },
                  { k: "Noise", v: "~47 dB" },
                  { k: "Warranty", v: "18 months" },
                  { k: "Subscription", v: "Optional" },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "var(--muted-foreground)", letterSpacing: "0.05em", marginBottom: 2 }}>{k}</p>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ backgroundColor: "var(--background)", position: "sticky", top: 60, zIndex: 10, borderBottom: "1px solid var(--border)", marginTop: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0 }}>
          {(["overview", "specs", "scores"] as const).map((tab) => {
            const labels = { overview: "Overview", specs: "Full Specs", scores: "Criteria Scores" };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "14px 22px",
                  fontSize: 14, fontWeight: 600,
                  color: activeTab === tab ? "var(--accent)" : "var(--muted-foreground)",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${activeTab === tab ? "var(--accent)" : "transparent"}`,
                  cursor: "pointer",
                  transition: "color 0.15s",
                  marginBottom: -1,
                }}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 56, alignItems: "start" }} className="product-body-grid">

        {/* Main content */}
        <div>
          {/* ── Overview tab ── */}
          {activeTab === "overview" && (
            <div>
              <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 16, color: "var(--foreground)" }}>
                  What it is
                </h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--foreground)", marginBottom: 14 }}>
                  The Litter-Robot 4 is Whisker's fourth-generation automatic self-cleaning litter box. It uses a rotating globe to separate clumps from clean litter, depositing waste into a sealed drawer below. A built-in weight sensor and infrared emitters detect when a cat has exited before each cleaning cycle begins.
                </p>
                <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--foreground)", marginBottom: 14 }}>
                  Compared to the Litter-Robot 3 Connect, the 4 adds a quieter motor, a redesigned OdorTrap port for carbon filter pods, a redesigned app with usage-based health monitoring, and a lower-profile base that's easier to clean underneath.
                </p>
                <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--foreground)" }}>
                  It does not support any litter type other than clumping clay. Owners using crystal, pine, or paper litter will need a different unit — the weight sensor and globe mechanism rely on clumping behavior to function correctly.
                </p>
              </section>

              {/* Pros / Cons */}
              <section style={{ marginBottom: 48 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="pros-cons-grid">
                  {/* Pros */}
                  <div style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 6,
                    padding: "22px 22px",
                  }}>
                    <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#16a34a", marginBottom: 16, fontWeight: 600 }}>Strengths</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {LR4_PROS.map((pro, i) => (
                        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ color: "#16a34a", flexShrink: 0, marginTop: 1, fontSize: 14 }}>✓</span>
                          <span style={{ fontSize: 14, lineHeight: 1.55, color: "#166534" }}>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Cons */}
                  <div style={{
                    backgroundColor: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: 6,
                    padding: "22px 22px",
                  }}>
                    <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#c2410c", marginBottom: 16, fontWeight: 600 }}>Limitations</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {LR4_CONS.map((con, i) => (
                        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ color: "#c2410c", flexShrink: 0, marginTop: 1, fontSize: 14 }}>–</span>
                          <span style={{ fontSize: 14, lineHeight: 1.55, color: "#9a3412" }}>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Dimension detail sections */}
              {[
                {
                  heading: "Reliability",
                  score: 4.6,
                  body: "Across user reports aggregated from Amazon, Reddit's r/litter_robot, and Whisker's own community forum, the Litter-Robot 4 completes cycles without interruption in the large majority of cases. The most common fault — pinch-detect false positives — typically resolves by re-leveling the unit. Motor failures in the first 18 months are rare and covered under warranty.",
                },
                {
                  heading: "App & connectivity",
                  score: 4.0,
                  body: "The Whisker app (iOS and Android) holds a 4.4★ average on the App Store from over 12,000 reviews as of August 2026. The health monitoring dashboard tracks cycle count per cat, average waste weight over time, and flags multi-day changes. The app requires an account; there is no offline-only mode. Connect subscription ($12.49/mo) unlocks historical health data beyond 30 days and priority support.",
                },
                {
                  heading: "Noise and placement",
                  score: 4.2,
                  body: "We measured cycling noise at ~47 dB at 1 meter — quieter than a normal conversation (60 dB) and comparable to a library ambient level. Most users report it's suitable for bedroom placement. The base fan (for odor venting) runs continuously at ~32 dB. Placement on hard floors rather than carpet reduces vibration transfer noticeably.",
                },
                {
                  heading: "Long-term cost",
                  score: 4.1,
                  body: "Litter cost is the primary ongoing expense. At $699 entry, the unit pays for itself in avoided litter waste relative to a standard box — estimates vary by brand and cat count, but most owners report using 15–25% less litter annually due to the separation mechanism. OdorTrap pods ($12–16/mo) are optional; a $10 carbon filter insert works adequately for single-cat setups.",
                },
              ].map((section) => (
                <section key={section.heading} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--foreground)" }}>
                      {section.heading}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <ScoreBar score={section.score} />
                    </div>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--foreground)" }}>{section.body}</p>
                </section>
              ))}
            </div>
          )}

          {/* ── Specs tab ── */}
          {activeTab === "specs" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 24, color: "var(--foreground)" }}>
                Full specifications
              </h2>
              <div style={{ border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ backgroundColor: "var(--primary)", padding: "10px 20px", display: "grid", gridTemplateColumns: "1fr 2fr" }}>
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Specification</span>
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Value</span>
                </div>
                {LR4_SPECS.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid", gridTemplateColumns: "1fr 2fr",
                      padding: "13px 20px",
                      backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--secondary)",
                      borderBottom: i < LR4_SPECS.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 13, color: "var(--muted-foreground)", fontWeight: 500 }}>{spec.label}</span>
                    <span style={{ fontSize: 14, color: "var(--foreground)", fontWeight: 500 }}>{spec.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 12, lineHeight: 1.55 }}>
                Specs sourced from Whisker's official product page and verified against packaging. Last checked: August 2026.
              </p>
            </div>
          )}

          {/* ── Scores tab ── */}
          {activeTab === "scores" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--foreground)" }}>
                Criteria scores
              </h2>
              <p style={{ fontSize: 14.5, color: "var(--muted-foreground)", marginBottom: 32, lineHeight: 1.6 }}>
                Each criterion is scored 1.0–5.0 based on aggregated user reports, manufacturer specifications, and third-party test data where available. Scores are not weighted equally toward the overall.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ backgroundColor: "var(--primary)", padding: "10px 20px", display: "grid", gridTemplateColumns: "1.5fr 200px 1fr" }}>
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Criterion</span>
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Score</span>
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Note</span>
                </div>
                {LR4_SCORES.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid", gridTemplateColumns: "1.5fr 200px 1fr",
                      padding: "16px 20px",
                      backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--secondary)",
                      borderBottom: i < LR4_SCORES.length - 1 ? "1px solid var(--border)" : "none",
                      alignItems: "center", gap: 16,
                    }}
                  >
                    <span style={{ fontSize: 14.5, fontWeight: 500, color: "var(--foreground)" }}>{row.label}</span>
                    <ScoreBar score={row.score} />
                    <span style={{ fontSize: 12.5, color: "var(--muted-foreground)", lineHeight: 1.45 }}>{row.note}</span>
                  </div>
                ))}
                {/* Average row */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1.5fr 200px 1fr",
                  padding: "16px 20px",
                  backgroundColor: "var(--primary)",
                  alignItems: "center", gap: 16,
                }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: "white", fontFamily: "var(--font-fraunces)" }}>PetMetric Score</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(parseFloat(overallScore) / 5) * 100}%`, height: "100%", backgroundColor: "var(--accent)", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 14, fontWeight: 700, color: "var(--accent)", minWidth: 28, textAlign: "right" }}>{overallScore}</span>
                  </div>
                  <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>Unweighted average across 6 criteria</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside style={{ position: "sticky", top: 120 }}>
          {/* Metadata card */}
          <div style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "20px 20px",
            marginBottom: 20,
          }}>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 14 }}>Page information</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { k: "Research date", v: "August 14, 2026" },
                { k: "Last price check", v: "September 1, 2026" },
                { k: "Next review due", v: "November 2026" },
                { k: "Sources cited", v: "11 sources" },
              ].map(({ k, v }) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11.5, color: "var(--muted-foreground)" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 14 }}>
              <Link href="/contact/" style={{ fontSize: 13, color: "var(--muted-foreground)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <span>✏</span> Submit a correction
              </Link>
            </div>
          </div>

          {/* Comparisons */}
          <div style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "20px 20px",
            marginBottom: 20,
          }}>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 14 }}>Compare Litter-Robot 4</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {LR4_RELATED_COMPARISONS.map((c, i) => (
                <Link key={i} href={c.href} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  fontSize: 13.5, color: "var(--foreground)",
                  textDecoration: "none", fontWeight: 500,
                  padding: "9px 12px",
                  backgroundColor: "var(--secondary)",
                  borderRadius: 4,
                  transition: "background 0.15s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--muted)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
                >
                  <span>vs {c.b}</span>
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </div>

          {/* Troubleshooting */}
          <div style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "20px 20px",
          }}>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 14 }}>Troubleshooting</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {LR4_TROUBLESHOOTING.map((t, i) => (
                <Link key={i} href={t.href} style={{
                  display: "flex", flexDirection: "column", gap: 5,
                  padding: "10px 12px",
                  backgroundColor: "var(--secondary)",
                  borderRadius: 4,
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--muted)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
                >
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--foreground)", lineHeight: 1.35 }}>{t.problem}</span>
                  <span style={{
                    alignSelf: "flex-start",
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: 10.5, fontWeight: 600,
                    color: t.difficulty === "Easy fix" ? "#16a34a" : "#b45309",
                    backgroundColor: t.difficulty === "Easy fix" ? "#dcfce7" : "#fef3c7",
                    border: `1px solid ${t.difficulty === "Easy fix" ? "#bbf7d0" : "#fde68a"}`,
                    padding: "1px 7px", borderRadius: 2,
                  }}>{t.difficulty}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Disclosure footer */}
      <div style={{ backgroundColor: "var(--secondary)", borderTop: "1px solid var(--border)", padding: "24px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", lineHeight: 1.65, maxWidth: 800 }}>
            <strong>Affiliate disclosure:</strong> This page contains affiliate links to Litter-Robot.com. PetMetric earns a commission on qualifying purchases at no additional cost to you. This relationship does not affect our research methodology, scores, or verdicts. <Link href="/disclosure/" style={{ color: "var(--muted-foreground)", textDecoration: "underline" }}>Full commercial disclosure →</Link>
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Best Picks Page ─────────────────────────────────────────────────────────

const BEST_PICKS_ALL = [
  {
    slug: "best-automatic-litter-box-multiple-cats",
    category: "Automatic Litter Boxes",
    categorySlug: "automatic-litter-boxes",
    title: "Best automatic litter box for multiple cats",
    pick: "Litter-Robot 4",
    budget: "$699 + ~$18/mo litter",
    img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=700&h=480&fit=crop&auto=format",
    alt: "Cat next to Litter-Robot 4",
    verdict: "The Litter-Robot 4 handles 2–4 cats reliably, with a large enough waste drawer to go 3–5 days between empties. Its weight sensor distinguishes cats by mass, so the health-tracking dashboard per cat works in multi-cat households.",
    bestFor: "Owners with 2–4 cats who want app-based health monitoring and minimum daily maintenance.",
    notFor: "Single-cat owners on a tight budget — the cost premium is hard to justify for one cat.",
    alternatives: [
      { name: "PETKIT PURA X", note: "Supports 2 cats with weight ID; $150 cheaper" },
      { name: "CATLINK Luxury Pro X", note: "Globe-style; slightly lower reliability data" },
    ],
    updated: "Aug 2026",
  },
  {
    slug: "best-gps-tracker-escape-prone-dogs",
    category: "GPS Pet Trackers",
    categorySlug: "gps-pet-trackers",
    title: "Best GPS tracker for escape-prone dogs",
    pick: "Fi Series 3",
    budget: "$149 + $8.25/mo",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&h=480&fit=crop&auto=format",
    alt: "Dog with GPS tracker collar running in a field",
    verdict: "Fi Series 3 uses LTE-M and Wi-Fi triangulation with up to 3 months of battery life — critical for a dog that gets out and may not be found quickly. The US-only LTE-M network provides better rural coverage than Tractive in most regions.",
    bestFor: "US-based owners with high-energy or escape-prone dogs who need long battery life and reliable alerts.",
    notFor: "Owners who travel internationally with their dogs — Fi only works in the US.",
    alternatives: [
      { name: "Tractive GPS", note: "Works in 175+ countries; much shorter battery life" },
      { name: "Whistle GO Explore", note: "Adds health metrics; covers US + Canada only" },
    ],
    updated: "Aug 2026",
  },
  {
    slug: "best-pet-feeder-portion-control",
    category: "Smart Pet Feeders",
    categorySlug: "smart-pet-feeders",
    title: "Best pet feeder for portion control",
    pick: "PETLIBRO Granary",
    budget: "$89.99",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&h=480&fit=crop&auto=format",
    alt: "Dog eating from an automatic feeder",
    verdict: "Tested at ±2% dispensing variance across all portion sizes, the PETLIBRO Granary is the most accurate feeder we've evaluated. Its 1-meal scheduling interval (vs. 4 meals/day max for most competitors) makes it suitable for medically prescribed feeding schedules.",
    bestFor: "Cats or dogs on a vet-prescribed diet where portion accuracy directly affects health.",
    notFor: "Pet owners who just want a basic schedule feeder — the Arf Pets Feeder does that adequately for $35 less.",
    alternatives: [
      { name: "Arf Pets Feeder", note: "$54.99; adequate for standard schedules" },
      { name: "PetSafe Healthy Pet Simply Feed", note: "Reliable; no camera; $99" },
    ],
    updated: "Sep 2026",
  },
  {
    slug: "best-pet-camera-separation-anxiety",
    category: "Pet Cameras",
    categorySlug: "pet-cameras",
    title: "Best pet camera for separation anxiety",
    pick: "Furbo 360°",
    budget: "$169 + $8.99/mo",
    img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=700&h=480&fit=crop&auto=format",
    alt: "Dog sitting near a pet camera",
    verdict: "Furbo 360°'s combination of 360° pan, color night vision, and Dog Alert AI (which detects barking and pacing) makes it the most useful camera for owners managing separation anxiety in dogs. The two-way audio quality is better than any competitor we tested.",
    bestFor: "Dog owners who need real-time behavioral alerts and want to interact remotely through high-quality audio.",
    notFor: "Cat owners or owners who just want basic live video — Petcube Bites 2 at $89.99 is sufficient.",
    alternatives: [
      { name: "Petcube Bites 2", note: "$89.99; lower subscription; no 360° pan" },
      { name: "Wyze Cam v3", note: "$35; no treat dispenser; no pet alerts" },
    ],
    updated: "Jul 2026",
  },
];

const BP_CAT_FILTERS = [
  { label: "All", slug: "all" },
  { label: "Litter Boxes", slug: "automatic-litter-boxes" },
  { label: "GPS Trackers", slug: "gps-pet-trackers" },
  { label: "Feeders", slug: "smart-pet-feeders" },
  { label: "Cameras", slug: "pet-cameras" },
];

function BestPicksPage() {
  const [catFilter, setCatFilter] = useState("all");
  const [openPick, setOpenPick] = useState<string | null>(null);

  const filtered = catFilter === "all"
    ? BEST_PICKS_ALL
    : BEST_PICKS_ALL.filter((p) => p.categorySlug === catFilter);

  const active = openPick ? BEST_PICKS_ALL.find((p) => p.slug === openPick) : null;

  return (
    <>
      {/* Hero */}
      <div style={{ backgroundColor: "var(--primary)", padding: "52px 24px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 20 }}>
            <Link href="/" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>Best Picks</span>
          </nav>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>Scene-Based Buying Guides</p>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 600, letterSpacing: "-0.025em", color: "white", lineHeight: 1.08, marginBottom: 16 }}>
            The best pick for your situation.
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.62)", lineHeight: 1.68, maxWidth: 560 }}>
            Every guide names a winner, explains the trade-offs, and states who it does and doesn't suit. No composite scores — just a clear recommendation for a specific use case.
          </p>
        </div>
      </div>

      {/* Filter + grid */}
      <div style={{ backgroundColor: "var(--background)", padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Filter bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>Category:</span>
            {BP_CAT_FILTERS.map((f) => (
              <button key={f.slug} onClick={() => setCatFilter(f.slug)} style={{
                padding: "7px 16px", fontSize: 13.5, fontWeight: 500,
                backgroundColor: catFilter === f.slug ? "var(--primary)" : "var(--card)",
                color: catFilter === f.slug ? "white" : "var(--foreground)",
                border: `1px solid ${catFilter === f.slug ? "var(--primary)" : "var(--border)"}`,
                borderRadius: 4, cursor: "pointer", transition: "all 0.15s",
              }}>{f.label}</button>
            ))}
          </div>

          {/* Guide cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))", gap: 20 }} className="bp-grid">
            {filtered.map((pick) => (
              <div
                key={pick.slug}
                onClick={() => setOpenPick(openPick === pick.slug ? null : pick.slug)}
                style={{
                  backgroundColor: "var(--card)",
                  border: `1px solid ${openPick === pick.slug ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 6, overflow: "hidden", cursor: "pointer",
                  transition: "box-shadow 0.18s, transform 0.15s",
                  boxShadow: openPick === pick.slug ? "0 0 0 1px var(--accent)" : "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = openPick === pick.slug ? "0 0 0 1px var(--accent)" : "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Image */}
                <div style={{ height: 200, overflow: "hidden", backgroundColor: "var(--muted)", position: "relative" }}>
                  <img src={pick.img} alt={pick.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,25,45,0.7) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>{pick.category}</span>
                  </div>
                </div>

                <div style={{ padding: "22px 22px 20px" }}>
                  <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25, marginBottom: 14, color: "var(--foreground)" }}>
                    {pick.title}
                  </h2>

                  {/* Winner chip */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Our pick</span>
                    <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 16, fontWeight: 600, color: "var(--accent)" }}>{pick.pick}</span>
                    <span style={{ marginLeft: "auto", fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "var(--muted-foreground)" }}>{pick.budget}</span>
                  </div>

                  <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 16 }}>{pick.verdict}</p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)" }}>Updated {pick.updated}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 5 }}>
                      {openPick === pick.slug ? "Less detail" : "Full guide"} <ArrowRight size={12} />
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {openPick === pick.slug && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: "20px 22px", backgroundColor: "var(--secondary)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                      <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 5, padding: "14px 16px" }}>
                        <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: "#16a34a", fontWeight: 700, marginBottom: 6 }}>Best for</p>
                        <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>{pick.bestFor}</p>
                      </div>
                      <div style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 5, padding: "14px 16px" }}>
                        <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: "#c2410c", fontWeight: 700, marginBottom: 6 }}>Not for</p>
                        <p style={{ fontSize: 13, color: "#9a3412", lineHeight: 1.5 }}>{pick.notFor}</p>
                      </div>
                    </div>
                    <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 10 }}>Also consider</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {pick.alternatives.map((alt) => (
                        <div key={alt.name} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                          <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--foreground)", flexShrink: 0 }}>{alt.name}</span>
                          <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>— {alt.note}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                      <Link href={`/best-picks/${pick.slug}/`} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        backgroundColor: "var(--accent)", color: "white",
                        padding: "10px 18px", borderRadius: 4, fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                      }}>Full write-up <ExternalLink size={11} /></Link>
                      <Link href={`/products/${pick.categorySlug}/`} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        backgroundColor: "var(--card)", border: "1px solid var(--border)",
                        color: "var(--foreground)", padding: "10px 18px", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none",
                      }}>All {pick.category}</Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ backgroundColor: "var(--secondary)", borderTop: "1px solid var(--border)", padding: "48px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 8 }}>Still deciding?</p>
            <h3 style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--foreground)", marginBottom: 6 }}>Compare products head-to-head.</h3>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6 }}>Our comparison library uses identical criteria across every matchup.</p>
          </div>
          <Link href="/comparisons/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "var(--primary)", color: "white",
            padding: "13px 24px", borderRadius: 4, fontSize: 15, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
            flexShrink: 0,
          }}>Browse comparisons <ArrowRight size={15} /></Link>
        </div>
      </div>
    </>
  );
}

// ─── Troubleshooting Page ─────────────────────────────────────────────────────

const ALL_TROUBLES = [
  { product: "Litter-Robot 4", brand: "Whisker", problem: "Not cycling after waste deposit", slug: "litter-robot-4-not-cycling", category: "automatic-litter-boxes", difficulty: "Easy fix", views: "18,400", steps: ["Re-level the unit on a flat, hard surface", "Check that the globe is fully seated on the base", "Clean the DFI lens with a dry cloth", "Reset via the app: Settings → Reset Cycle"], updated: "Aug 2026" },
  { product: "Litter-Robot 4", brand: "Whisker", problem: "Pinch detect fault — cycle stops mid-run", slug: "litter-robot-4-pinch-detect", category: "automatic-litter-boxes", difficulty: "Easy fix", views: "9,200", steps: ["Remove all litter and check for foreign objects in the globe", "Inspect the bonnet seal for tears", "Clean the pinch-detect strips with a damp cloth", "Perform a factory reset if the fault persists"], updated: "Jul 2026" },
  { product: "Tractive GPS", brand: "Tractive", problem: "Location not updating in real time", slug: "tractive-gps-location-not-updating", category: "gps-pet-trackers", difficulty: "Moderate", views: "14,100", steps: ["Confirm the tracker has at least 20% battery", "Verify the SIM is registered in the Tractive app under Device Settings", "Switch live tracking interval from Power Saving to Real-Time", "If outdoors signal is weak, wait for the device to acquire GPS lock (up to 2 min)"], updated: "Aug 2026" },
  { product: "PETLIBRO Granary", brand: "PETLIBRO", problem: "Not dispensing food on schedule", slug: "petlibro-granary-not-dispensing", category: "smart-pet-feeders", difficulty: "Easy fix", views: "7,600", steps: ["Check that the schedule is saved — exit editing before closing the app", "Confirm the feeder is connected to 2.4 GHz Wi-Fi (not 5 GHz)", "Verify the food hopper is not empty or bridging (tap the sides)", "Manually trigger a meal from the app to test the motor"], updated: "Sep 2026" },
  { product: "Furbo Dog Camera", brand: "Furbo", problem: "Offline or not connecting to app", slug: "furbo-camera-offline", category: "pet-cameras", difficulty: "Easy fix", views: "6,800", steps: ["Power-cycle the Furbo (unplug 30 sec, replug)", "Confirm your phone and Furbo are on the same Wi-Fi network", "Re-pair via Settings → Add Device if the camera doesn't appear", "Check the LED ring: solid blue = connected, blinking yellow = connecting"], updated: "Jul 2026" },
  { product: "Litter-Robot 4", brand: "Whisker", problem: "Globe not rotating — motor noise but no movement", slug: "litter-robot-4-globe-not-rotating", category: "automatic-litter-boxes", difficulty: "Moderate", views: "5,100", steps: ["Remove the globe and check the gear teeth for wear or debris", "Lubricate the globe pins with a silicone-based lubricant (not WD-40)", "Inspect the motor coupler for cracks", "If the motor sounds strained, contact Whisker support — likely warrantied"], updated: "Jun 2026" },
  { product: "Fi Series 3", brand: "Fi", problem: "Dog not showing on map after escaping", slug: "fi-series-3-dog-not-on-map", category: "gps-pet-trackers", difficulty: "Moderate", views: "4,300", steps: ["Open the Fi app and tap the dog's name — the last known location shows even offline", "Switch to LTE-M mode in Device Settings if the default Wi-Fi mode hasn't updated", "Call Fi support at 1-833-434-5050 — they can push a location poll directly to the device", "Check the Fi community Lost Dog board: other Fi owners can see escaped-dog alerts in your area"], updated: "Aug 2026" },
  { product: "PETKIT PURA MAX", brand: "PETKIT", problem: "Cat not using the litter box after setup", slug: "petkit-pura-max-cat-not-using", category: "automatic-litter-boxes", difficulty: "Easy fix", views: "3,900", steps: ["Disable automatic cleaning for 48 hours to let the cat adjust", "Place the old litter box beside the PETKIT for a transition period", "Use the same litter brand the cat is used to", "If the entrance angle is an issue, some owners temporarily remove the top dome"], updated: "Jul 2026" },
];

const TROUBLE_CAT_FILTERS = [
  { label: "All", slug: "all" },
  { label: "Litter Boxes", slug: "automatic-litter-boxes" },
  { label: "GPS Trackers", slug: "gps-pet-trackers" },
  { label: "Feeders", slug: "smart-pet-feeders" },
  { label: "Cameras", slug: "pet-cameras" },
];

function TroubleshootingPage() {
  const [catFilter, setTrCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const filtered = ALL_TROUBLES
    .filter((t) => catFilter === "all" || t.category === catFilter)
    .filter((t) =>
      search === "" ||
      t.product.toLowerCase().includes(search.toLowerCase()) ||
      t.problem.toLowerCase().includes(search.toLowerCase())
    );

  const diffColor = (d: string) => d === "Easy fix" ? "#16a34a" : "#b45309";
  const diffBg = (d: string) => d === "Easy fix" ? "#dcfce7" : "#fef3c7";
  const diffBorder = (d: string) => d === "Easy fix" ? "#bbf7d0" : "#fde68a";

  return (
    <>
      {/* Hero */}
      <div style={{ backgroundColor: "var(--primary)", padding: "52px 24px 44px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 20 }}>
            <Link href="/" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>Troubleshooting</span>
          </nav>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>Fix Library</p>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 600, letterSpacing: "-0.025em", color: "white", lineHeight: 1.08, marginBottom: 16 }}>
            Product not working right?
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.62)", lineHeight: 1.68, maxWidth: 540, marginBottom: 32 }}>
            Symptom-first fixes. Every guide covers: confirm the problem → common causes → step-by-step resolution → when to contact support.
          </p>
          {/* Search */}
          <div style={{ position: "relative", maxWidth: 520 }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", display: "flex" }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by product or symptom…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "13px 16px 13px 44px",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 6, fontSize: 15,
                color: "white", outline: "none",
                fontFamily: "var(--font-source-sans)",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter + list */}
      <div style={{ backgroundColor: "var(--background)", padding: "36px 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Category filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>Category:</span>
            {TROUBLE_CAT_FILTERS.map((f) => (
              <button key={f.slug} onClick={() => setTrCatFilter(f.slug)} style={{
                padding: "7px 14px", fontSize: 13.5, fontWeight: 500,
                backgroundColor: catFilter === f.slug ? "var(--primary)" : "var(--card)",
                color: catFilter === f.slug ? "white" : "var(--foreground)",
                border: `1px solid ${catFilter === f.slug ? "var(--primary)" : "var(--border)"}`,
                borderRadius: 4, cursor: "pointer", transition: "all 0.15s",
              }}>{f.label}</button>
            ))}
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11.5, color: "var(--muted-foreground)", marginLeft: "auto" }}>
              {filtered.length} guide{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Trouble list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
            {filtered.map((t, i) => (
              <div key={t.slug} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                {/* Row */}
                <div
                  onClick={() => setOpenSlug(openSlug === t.slug ? null : t.slug)}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr auto",
                    gap: 16, alignItems: "center",
                    padding: "18px 22px",
                    backgroundColor: openSlug === t.slug ? "var(--secondary)" : i % 2 === 0 ? "var(--card)" : "#fbfaf8",
                    cursor: "pointer",
                    transition: "background 0.12s",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.05em" }}>{t.product}</span>
                      <span style={{
                        fontFamily: "var(--font-dm-mono)", fontSize: 10.5, fontWeight: 600,
                        color: diffColor(t.difficulty), backgroundColor: diffBg(t.difficulty),
                        border: `1px solid ${diffBorder(t.difficulty)}`, padding: "1px 8px", borderRadius: 2,
                      }}>{t.difficulty}</span>
                      <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "var(--muted-foreground)" }}>{t.views} views</span>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.35 }}>{t.problem}</p>
                  </div>
                  <span style={{
                    color: "var(--accent)", fontSize: 20,
                    transform: openSlug === t.slug ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s", display: "inline-block", lineHeight: 1, flexShrink: 0,
                  }}>+</span>
                </div>

                {/* Expanded steps */}
                {openSlug === t.slug && (
                  <div style={{ padding: "6px 22px 24px", backgroundColor: "var(--secondary)", borderTop: "1px solid var(--border)" }}>
                    <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 16, marginTop: 16 }}>Resolution steps</p>
                    <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                      {t.steps.map((step, si) => (
                        <li key={si} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                          <span style={{
                            fontFamily: "var(--font-dm-mono)", fontSize: 12, fontWeight: 700,
                            color: "white", backgroundColor: "var(--primary)",
                            width: 24, height: 24, borderRadius: 4, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>{si + 1}</span>
                          <span style={{ fontSize: 14.5, color: "var(--foreground)", lineHeight: 1.55, paddingTop: 2 }}>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <Link href={`/troubleshooting/${t.slug}/`} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        backgroundColor: "var(--accent)", color: "white",
                        padding: "9px 16px", borderRadius: 4, fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                      }}>Full guide <ExternalLink size={11} /></Link>
                      <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>Updated {t.updated} · <Link href="/contact/" style={{ color: "var(--muted-foreground)" }}>Submit a correction</Link></span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, color: "var(--foreground)", marginBottom: 8 }}>No guides match your search.</p>
                <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>Try a different product name or symptom description.</p>
              </div>
            )}
          </div>

          {/* Can't fix it CTA */}
          <div style={{
            marginTop: 36, backgroundColor: "var(--primary)", borderRadius: 8, padding: "28px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
          }}>
            <div>
              <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, fontWeight: 600, color: "white", marginBottom: 6 }}>Still can't fix it?</p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>Submit the issue and we'll research a fix or contact the manufacturer on your behalf.</p>
            </div>
            <Link href="/contact/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              backgroundColor: "var(--accent)", color: "white",
              padding: "11px 20px", borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
            }}>Submit your issue <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────

function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ backgroundColor: "var(--primary)", padding: "64px 24px 60px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <nav style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 24 }}>
            <Link href="/" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>About</span>
          </nav>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 16 }}>About PetMetric</p>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px, 4.5vw, 54px)", fontWeight: 600, letterSpacing: "-0.025em", color: "white", lineHeight: 1.08, marginBottom: 20 }}>
            Independent research on pet technology.
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.72, maxWidth: 640 }}>
            PetMetric exists because most pet tech content is written to rank on search engines, not to help pet owners make better decisions. We're trying to fix that.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div style={{ backgroundColor: "var(--background)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60 }} className="two-col-grid">
            <div>
              <SectionLabel>What we do</SectionLabel>
              <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 16 }}>Research you can verify.</h2>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.75 }}>
                Every page on PetMetric includes a research date, the sources we used, and a clear disclosure of any commercial relationships. We document our methodology so that you — or anyone else — can check our work.
              </p>
            </div>
            <div>
              <SectionLabel>What we don't do</SectionLabel>
              <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 16 }}>No sponsored rankings.</h2>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.75 }}>
                We don't accept payment to rank products higher, write "sponsored" reviews without disclosing them, or adjust our verdicts based on affiliate commission rates. If a product is bad, we say so.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
            border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden",
            marginBottom: 60,
          }}>
            {[
              { n: "103", l: "Products researched" },
              { n: "412", l: "Source citations" },
              { n: "Sep 2026", l: "Latest update" },
              { n: "100%", l: "Affiliate disclosed" },
            ].map(({ n, l }, i) => (
              <div key={l} style={{
                padding: "28px 24px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
                backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--secondary)",
              }}>
                <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 30, fontWeight: 600, color: "var(--accent)", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 8 }}>{n}</p>
                <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.05em" }}>{l}</p>
              </div>
            ))}
          </div>

          {/* Coverage areas */}
          <SectionLabel>What we cover</SectionLabel>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 24 }}>Four product categories.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 60 }}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/products/${cat.slug}/`} style={{
                display: "flex", alignItems: "center", gap: 16,
                backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 6,
                padding: "18px 20px", textDecoration: "none", color: "var(--foreground)",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{ width: 56, height: 56, borderRadius: 5, overflow: "hidden", backgroundColor: "var(--muted)", flexShrink: 0 }}>
                  <img src={cat.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14.5, color: "var(--foreground)", marginBottom: 2 }}>{cat.title}</p>
                  <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "var(--muted-foreground)" }}>{cat.count} products · Updated {cat.updated}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Editorial standards", href: "/editorial-standards/" },
              { label: "Commercial disclosure", href: "/disclosure/" },
              { label: "Submit a correction", href: "/contact/" },
            ].map((l) => (
              <Link key={l.label} href={l.href} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                backgroundColor: "var(--secondary)", border: "1px solid var(--border)",
                color: "var(--foreground)", padding: "11px 20px", borderRadius: 4,
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                {l.label} <ArrowRight size={13} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Editorial Standards Page ─────────────────────────────────────────────────

const METHODOLOGY_SECTIONS = [
  {
    id: "sources",
    heading: "How we source information",
    body: [
      "We use manufacturer specifications, FCC filings, and official product documentation as the foundation for specifications. Where manufacturer data conflicts with measurable reality (e.g., noise levels, dispensing accuracy), we prioritize third-party test data over marketing copy.",
      "For reliability and long-term performance, we aggregate owner reports from Amazon reviews (filtering for verified purchases), Reddit communities (r/litter_robot, r/dogs, r/cats), and manufacturer support forums. We note sample size and source in the methodology section of each page.",
      "We do not rely solely on press samples or loan units provided by manufacturers. Where we have tested a product ourselves, we say so. Where we haven't, we state the sources we relied on and their limitations.",
    ],
  },
  {
    id: "scoring",
    heading: "How we score products",
    body: [
      "PetMetric scores are criterion-level, not composite. We score each relevant dimension (reliability, app quality, noise, cost, etc.) on a 1.0–5.0 scale. The overall PetMetric Score is an unweighted average of those criteria scores — we don't weight criteria because importance varies by owner situation.",
      "Scores are based on data available at the time of research. A product that was 4.6 in 2025 may be 4.2 in 2026 if firmware updates degraded app reliability or new user reports surfaced. We flag score changes in our update log.",
      "We do not inflate scores for products with higher affiliate commission rates. Commission rates are not visible to our researchers when scoring.",
    ],
  },
  {
    id: "updates",
    heading: "How we update content",
    body: [
      "Every page carries a 'last checked' date. We review pages on a rolling schedule: high-traffic pages every 3 months, lower-traffic pages every 6 months. Pages are also flagged for immediate review when: a manufacturer releases a major firmware or hardware update, a product is discontinued, or a reader submits a correction.",
      "When we update a score or verdict, we note the change at the bottom of the page with a one-line changelog entry: what changed, why, and when. We don't silently revise scores.",
    ],
  },
  {
    id: "corrections",
    heading: "Corrections and errors",
    body: [
      "We make mistakes. When a reader submits a correction via our contact form, we verify it against primary sources within 5 business days. If the correction is verified, we update the page and note the correction in the changelog.",
      "If we can't verify a correction, we explain why in our response. We don't ignore corrections because they're inconvenient.",
    ],
  },
  {
    id: "affiliate",
    heading: "Affiliate relationships",
    body: [
      "Some links on PetMetric are affiliate links, meaning we earn a commission if you purchase through them. We disclose affiliate links at the page level (not buried in a footer) and at the point of use.",
      "Affiliate commission rates do not influence product rankings, scores, or verdicts. We maintain a list of products we recommend that don't have affiliate programs, and we include them alongside products that do.",
      "If a product is the best choice for a use case and we have no affiliate relationship, we still recommend it. If a product is a bad choice and we do have an affiliate relationship, we still say it's a bad choice.",
    ],
  },
];

function EditorialStandardsPage() {
  const [activeSection, setActiveSection] = useState("sources");

  return (
    <>
      <div style={{ backgroundColor: "var(--primary)", padding: "52px 24px 48px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <nav style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 20 }}>
            <Link href="/" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <Link href="/about/" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>About</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>Editorial Standards</span>
          </nav>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>Methodology</p>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, letterSpacing: "-0.025em", color: "white", lineHeight: 1.1, marginBottom: 16 }}>
            Editorial standards &amp; research methodology
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.68, maxWidth: 580 }}>
            How we source, score, update, and correct our research. Last reviewed: September 2026.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--background)", padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "220px 1fr", gap: 48, paddingTop: 48 }} className="two-col-grid">
          {/* Sidebar nav */}
          <nav style={{ position: "sticky", top: 80, height: "fit-content" }}>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 14 }}>Sections</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {METHODOLOGY_SECTIONS.map((s) => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                  textAlign: "left", padding: "9px 14px",
                  fontSize: 13.5, fontWeight: activeSection === s.id ? 600 : 400,
                  color: activeSection === s.id ? "var(--accent)" : "var(--muted-foreground)",
                  backgroundColor: activeSection === s.id ? "#fff5ea" : "transparent",
                  border: "none", borderLeft: `2px solid ${activeSection === s.id ? "var(--accent)" : "transparent"}`,
                  cursor: "pointer", transition: "all 0.15s", lineHeight: 1.4,
                }}>{s.heading}</button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <article>
            {METHODOLOGY_SECTIONS.map((s) => (
              <section
                key={s.id}
                style={{
                  marginBottom: 52, paddingBottom: 52,
                  borderBottom: "1px solid var(--border)",
                  opacity: activeSection === s.id || activeSection === "all" ? 1 : 0.45,
                  transition: "opacity 0.2s",
                }}
                onClick={() => setActiveSection(s.id)}
              >
                <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--foreground)", marginBottom: 20 }}>
                  {s.heading}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {s.body.map((para, i) => (
                    <p key={i} style={{ fontSize: 15.5, color: "var(--foreground)", lineHeight: 1.78 }}>{para}</p>
                  ))}
                </div>
              </section>
            ))}

            {/* Contact CTA */}
            <div style={{
              backgroundColor: "var(--secondary)", border: "1px solid var(--border)",
              borderLeft: "3px solid var(--accent)", borderRadius: "0 6px 6px 0",
              padding: "20px 24px",
            }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--foreground)", marginBottom: 6 }}>Found something we got wrong?</p>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 14 }}>
                We verify corrections within 5 business days. Use the contact form below and we'll respond with what we found.
              </p>
              <Link href="/contact/" style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                backgroundColor: "var(--accent)", color: "white",
                padding: "10px 18px", borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: "none",
              }}>Submit a correction <ArrowRight size={13} /></Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

// ─── Disclosure Page ──────────────────────────────────────────────────────────

function DisclosurePage() {
  return (
    <>
      <div style={{ backgroundColor: "var(--primary)", padding: "52px 24px 44px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <nav style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 20 }}>
            <Link href="/" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>Disclosure</span>
          </nav>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>Commercial Disclosure</p>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 600, letterSpacing: "-0.025em", color: "white", lineHeight: 1.1, marginBottom: 14 }}>
            How PetMetric makes money
          </h1>
          <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.68 }}>
            We believe readers deserve to know exactly how our commercial relationships work. This page is the full picture.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--background)", padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
          {[
            {
              heading: "Affiliate links",
              body: "When you click a 'Check price' or retailer link on PetMetric and make a purchase, we may earn a commission. This is called an affiliate relationship. The price you pay is not affected. We have affiliate relationships with Litter-Robot (Whisker), Amazon Associates, Tractive, and PETLIBRO, among others.",
              important: "Affiliate relationships do not determine which products we recommend. If a product is the best choice for a use case, we recommend it whether or not we have an affiliate agreement.",
            },
            {
              heading: "Sponsored content",
              body: "We do not currently publish sponsored content. If we ever do, it will be labeled 'Sponsored' at the top of the page — not in a footer, not in a tooltip. Sponsored content would be maintained separately from our editorial research and would not influence product rankings or scores.",
              important: null,
            },
            {
              heading: "Product samples",
              body: "Some manufacturers have offered us product samples for evaluation. When we evaluate a sample unit, we note it on the product page. Sample relationships do not guarantee positive coverage — we've declined to recommend products we received as samples.",
              important: "We do not accept samples in exchange for positive reviews, and we return or donate products after evaluation.",
            },
            {
              heading: "Display advertising",
              body: "We do not currently run display advertising (banner ads, programmatic ads). If we introduce it in the future, we will update this page and note which pages carry advertising.",
              important: null,
            },
            {
              heading: "FTC compliance",
              body: "This disclosure is consistent with FTC guidelines on endorsements and testimonials (16 CFR Part 255). Affiliate links are identified in page-level disclosure notices and at the point of use on individual product pages.",
              important: null,
            },
          ].map((section, i) => (
            <div key={i} style={{
              backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "28px 30px",
            }}>
              <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--foreground)", marginBottom: 14 }}>{section.heading}</h2>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.75, marginBottom: section.important ? 16 : 0 }}>{section.body}</p>
              {section.important && (
                <div style={{
                  backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderLeft: "3px solid #16a34a", borderRadius: "0 4px 4px 0",
                  padding: "12px 16px",
                }}>
                  <p style={{ fontSize: 14, color: "#166534", lineHeight: 1.6 }}>
                    <strong>Important:</strong> {section.important}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Affiliate partners table */}
          <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ backgroundColor: "var(--primary)", padding: "12px 22px" }}>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>Current affiliate partners</p>
            </div>
            {[
              { partner: "Whisker (Litter-Robot)", program: "Whisker Affiliate Program", commission: "8%" },
              { partner: "Tractive", program: "Tractive Partner Program", commission: "12%" },
              { partner: "PETLIBRO", program: "PETLIBRO Affiliate", commission: "10%" },
              { partner: "Amazon", program: "Amazon Associates", commission: "3–4%" },
              { partner: "Fi (dog collar)", program: "Fi Ambassador Program", commission: "15%" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr auto",
                padding: "12px 22px",
                backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--secondary)",
                borderBottom: i < 4 ? "1px solid var(--border)" : "none",
                alignItems: "center", gap: 16,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{row.partner}</span>
                <span style={{ fontSize: 13.5, color: "var(--muted-foreground)" }}>{row.program}</span>
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{row.commission}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            Questions about our commercial relationships? <Link href="/contact/" style={{ color: "var(--accent)", textDecoration: "none" }}>Contact us →</Link>
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "sent">("idle");
  const [type, setType] = useState("correction");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sent");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    backgroundColor: "var(--card)", color: "var(--foreground)",
    border: "1px solid var(--border)", borderRadius: 4,
    fontSize: 15, fontFamily: "var(--font-source-sans)",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return (
    <>
      <div style={{ backgroundColor: "var(--primary)", padding: "52px 24px 44px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <nav style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 20 }}>
            <Link href="/" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>Contact</span>
          </nav>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>Get in touch</p>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 600, letterSpacing: "-0.025em", color: "white", lineHeight: 1.1, marginBottom: 14 }}>
            Corrections, questions &amp; feedback
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.68, maxWidth: 540 }}>
            Found an error? Have a question we haven't answered? We respond to all messages within 5 business days.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--background)", padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 48 }} className="two-col-grid">

          {/* Form */}
          <div>
            {formState === "sent" ? (
              <div style={{
                backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8,
                padding: "40px 36px", textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, fontWeight: 600, color: "#15803d", marginBottom: 10 }}>Message received</h2>
                <p style={{ fontSize: 15, color: "#166534", lineHeight: 1.65 }}>
                  We'll verify your correction and respond within 5 business days. Thank you for helping us get it right.
                </p>
                <button onClick={() => { setFormState("idle"); setMessage(""); setName(""); setEmail(""); setUrl(""); }} style={{
                  marginTop: 24, padding: "10px 20px", fontSize: 14, fontWeight: 600,
                  backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: 4, cursor: "pointer",
                }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {/* Type selector */}
                <div>
                  <label style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, display: "block", marginBottom: 10 }}>
                    Message type
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { val: "correction", label: "Correction" },
                      { val: "question", label: "Question" },
                      { val: "press", label: "Press / media" },
                      { val: "other", label: "Other" },
                    ].map(({ val, label }) => (
                      <button type="button" key={val} onClick={() => setType(val)} style={{
                        padding: "8px 16px", fontSize: 13.5, fontWeight: 500,
                        backgroundColor: type === val ? "var(--primary)" : "var(--card)",
                        color: type === val ? "white" : "var(--foreground)",
                        border: `1px solid ${type === val ? "var(--primary)" : "var(--border)"}`,
                        borderRadius: 4, cursor: "pointer", transition: "all 0.15s",
                      }}>{label}</button>
                    ))}
                  </div>
                </div>

                {/* Name + email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, display: "block", marginBottom: 8 }}>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, display: "block", marginBottom: 8 }}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                </div>

                {/* URL (for corrections) */}
                {type === "correction" && (
                  <div>
                    <label style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Page URL <span style={{ color: "var(--muted-foreground)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(which page has the error?)</span>
                    </label>
                    <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://petmetric.com/reviews/…" style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, display: "block", marginBottom: 8 }}>
                    {type === "correction" ? "What's wrong, and what should it say?" : "Your message"}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={type === "correction" ? "Describe the error and include a source if you have one…" : "Your message…"}
                    rows={6}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>

                <button type="submit" style={{
                  padding: "13px 24px", fontSize: 15, fontWeight: 600,
                  backgroundColor: "var(--accent)", color: "white",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  alignSelf: "flex-start", transition: "opacity 0.15s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Send message
                </button>
              </form>
            )}
          </div>

          {/* Sidebar info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { icon: "📋", heading: "Corrections", body: "We verify corrections within 5 business days. Verified changes are applied immediately and noted in the page changelog." },
              { icon: "❓", heading: "Research questions", body: "We answer questions about our methodology and sourcing. We can't give personalized pet health advice." },
              { icon: "📰", heading: "Press & media", body: "For media inquiries, include your publication and deadline. We aim to respond within 24 hours for time-sensitive requests." },
            ].map(({ icon, heading, body }) => (
              <div key={heading} style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "20px 22px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, color: "var(--foreground)", marginBottom: 6 }}>{heading}</p>
                    <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.6 }}>{body}</p>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "18px 22px" }}>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 10 }}>Response time</p>
              <p style={{ fontSize: 13.5, color: "var(--foreground)", fontWeight: 600, marginBottom: 4 }}>Within 5 business days</p>
              <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>We read every message. Corrections get priority.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function PageHero({ breadcrumb, eyebrow, title, subtitle, stats }: {
  breadcrumb: { label: string; href?: string }[];
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  stats?: { n: string; l: string }[];
}) {
  return (
    <div style={{ position: "relative", backgroundColor: "var(--primary)", padding: "52px 24px 48px", overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
        <nav style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
          {breadcrumb.map((c, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {c.href
                ? <Link href={c.href!} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{c.label}</Link>
                : <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{c.label}</span>}
              {i < breadcrumb.length - 1 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>/</span>}
            </span>
          ))}
        </nav>
        <div style={{ display: "grid", gridTemplateColumns: stats ? "1fr auto" : "1fr", gap: 40, alignItems: "end" }} className="cat-header-grid">
          <div>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>{eyebrow}</p>
            <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 600, letterSpacing: "-0.025em", color: "white", lineHeight: 1.08, marginBottom: 16 }}>{title}</h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, maxWidth: 580 }}>{subtitle}</p>
          </div>
          {stats && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 28px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "20px 26px", flexShrink: 0 }}>
              {stats.map(({ n, l }) => (
                <div key={l}>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 600, color: "var(--accent)", lineHeight: 1, marginBottom: 3 }}>{n}</p>
                  <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Products Hub Page ────────────────────────────────────────────────────────

const CATEGORY_CARDS = [
  {
    slug: "automatic-litter-boxes",
    title: "Automatic Litter Boxes",
    count: 34, updated: "Aug 2026",
    img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=700&h=500&fit=crop&auto=format",
    alt: "Cat beside automatic litter box",
    desc: "Self-cleaning units for single and multi-cat households. Ranked by reliability and long-term cost.",
    topPick: "Litter-Robot 4",
    topScore: 4.3,
    priceRange: "$179–$699",
    keyConsiderations: ["Cats per household", "Litter type (clumping vs. crystal)", "App connectivity", "Total 12-month cost"],
  },
  {
    slug: "smart-pet-feeders",
    title: "Smart Pet Feeders",
    count: 28, updated: "Sep 2026",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&h=500&fit=crop&auto=format",
    alt: "Dog eating from an automatic feeder",
    desc: "Portion-controlled and camera-enabled feeders. Tested for dispensing accuracy and scheduling flexibility.",
    topPick: "PETLIBRO Granary",
    topScore: 4.2,
    priceRange: "$50–$130",
    keyConsiderations: ["Dispensing accuracy", "Portion scheduling granularity", "Camera included?", "Dual-power (plug + battery)"],
  },
  {
    slug: "gps-pet-trackers",
    title: "GPS Pet Trackers",
    count: 19, updated: "Aug 2026",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&h=500&fit=crop&auto=format",
    alt: "Dog wearing a GPS tracker collar",
    desc: "Real-time location devices compared on coverage area, battery life, subscription cost, and app reliability.",
    topPick: "Fi Series 3",
    topScore: 4.1,
    priceRange: "$50–$150",
    keyConsiderations: ["US only vs. international coverage", "Battery life vs. update frequency", "Monthly subscription cost", "Health monitoring add-ons"],
  },
  {
    slug: "pet-cameras",
    title: "Pet Cameras",
    count: 22, updated: "Jul 2026",
    img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=700&h=500&fit=crop&auto=format",
    alt: "Cat being monitored by a home pet camera",
    desc: "Two-way audio, treat dispensing, and night vision — evaluated for video quality and app stability.",
    topPick: "Furbo 360°",
    topScore: 4.0,
    priceRange: "$35–$169",
    keyConsiderations: ["Field of view (fixed vs. pan)", "Night vision quality", "Treat dispensing range", "Subscription requirement"],
  },
];

function ProductsHubPage() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
        eyebrow="Product Database"
        title="Pet tech, researched and ranked."
        subtitle="103 products across four categories. Every entry includes reliability data, full-cost analysis, and a plain-language verdict on who it's for."
        stats={[
          { n: "103", l: "products total" },
          { n: "4", l: "categories" },
          { n: "Sep 2026", l: "last updated" },
          { n: "412", l: "sources cited" },
        ]}
      />

      {/* How we evaluate strip */}
      <div style={{ backgroundColor: "#101e33", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "18px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>We evaluate every product on:</p>
          {["Reliability", "App quality", "Noise level", "Setup ease", "Long-term cost", "Support quality"].map((item) => (
            <span key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0, display: "inline-block" }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Category cards */}
      <div style={{ backgroundColor: "var(--background)", padding: "52px 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <SectionLabel>Four categories</SectionLabel>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
              Choose your product type.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="two-col-grid">
            {CATEGORY_CARDS.map((cat) => (
              <div
                key={cat.slug}
                style={{
                  backgroundColor: "var(--card)",
                  border: `1px solid ${activeCard === cat.slug ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 8, overflow: "hidden",
                  transition: "box-shadow 0.18s",
                  cursor: "pointer",
                }}
                onClick={() => setActiveCard(activeCard === cat.slug ? null : cat.slug)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,0,0,0.09)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Image with overlay */}
                <div style={{ height: 220, position: "relative", backgroundColor: "var(--muted)" }}>
                  <img src={cat.img} alt={cat.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,25,45,0.82) 0%, rgba(15,25,45,0.2) 55%, transparent 100%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", marginBottom: 4 }}>{cat.count} products · {cat.priceRange}</p>
                        <h3 style={{ fontFamily: "var(--font-fraunces)", fontSize: 21, fontWeight: 600, color: "white", letterSpacing: "-0.01em", lineHeight: 1.1 }}>{cat.title}</h3>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>Top pick</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{cat.topPick}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "20px 22px 18px" }}>
                  <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 16 }}>{cat.desc}</p>

                  {/* Key considerations */}
                  <div style={{ marginBottom: 18 }}>
                    <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 8 }}>Key buying criteria</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {cat.keyConsiderations.map((c) => (
                        <div key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "var(--secondary-foreground)" }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <Link href={`/products/${cat.slug}/`} style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      backgroundColor: "var(--primary)", color: "white",
                      padding: "10px 14px", borderRadius: 4, fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                      transition: "opacity 0.15s",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Browse {cat.count} products <ArrowRight size={13} />
                    </Link>
                    <Link href={`/best-picks/`} style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: "var(--secondary)", border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      padding: "10px 14px", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none",
                    }}>Best picks</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Not sure where to start */}
          <div style={{
            marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          }} className="hub-links-grid">
            {[
              { icon: "⚖️", heading: "Compare products", body: "Head-to-head on identical criteria.", href: "/comparisons/", cta: "Comparison library" },
              { icon: "🎯", heading: "Best picks by use case", body: "Named winners for specific situations.", href: "/best-picks/", cta: "See best picks" },
              { icon: "🔧", heading: "Fix a problem", body: "Symptom-first troubleshooting guides.", href: "/troubleshooting/", cta: "Troubleshooting" },
            ].map(({ icon, heading, body, href, cta }) => (
              <Link key={heading} href={href} style={{
                backgroundColor: "var(--secondary)", border: "1px solid var(--border)", borderRadius: 6,
                padding: "22px 22px 20px", textDecoration: "none", color: "var(--foreground)",
                display: "flex", flexDirection: "column", gap: 8,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <span style={{ fontSize: 22 }}>{icon}</span>
                <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 17, fontWeight: 600, color: "var(--foreground)" }}>{heading}</p>
                <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.55, flex: 1 }}>{body}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                  {cta} <ArrowRight size={12} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Generic Category Page (reusable template) ────────────────────────────────

type GenericProduct = {
  id: string; name: string; brand: string; slug: string;
  img: string; alt: string; price: number; priceDisplay: string;
  subscription: string | null; score: number; verdict: string;
  bestFor: string; tags: string[]; specChips: string[]; updated: string;
  highlight?: boolean;
};

type CategoryConfig = {
  slug: string; title: string; eyebrow: string; subtitle: string;
  count: number; lastUpdated: string;
  criteria: { icon: string; label: string; body: string }[];
  products: GenericProduct[];
  relatedLinks: { label: string; href: string }[];
  sortOptions: { label: string; value: string }[];
};

function GenericCategoryPage({ config }: { config: CategoryConfig }) {
  const [sortBy, setSortBy] = useState("rank");
  const [maxPrice, setMaxPrice] = useState(300);
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sorted = [...config.products]
    .filter((p) => p.price <= maxPrice)
    .filter((p) => search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "score") return b.score - a.score;
      return (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0) || b.score - a.score;
    });

  const scoreColor = (s: number) => s >= 4.1 ? "#16a34a" : s >= 3.7 ? "var(--accent)" : "#dc2626";

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products", href: "/products/" }, { label: config.title }]}
        eyebrow={config.eyebrow}
        title={config.title}
        subtitle={config.subtitle}
        stats={[
          { n: String(config.count), l: "products" },
          { n: String(config.products.length), l: "reviewed in depth" },
          { n: config.lastUpdated, l: "last updated" },
          { n: "3+", l: "comparisons" },
        ]}
      />

      {/* Criteria strip */}
      <div style={{ backgroundColor: "#101e33", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${config.criteria.length}, 1fr)`, borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
            {config.criteria.map((c, i) => (
              <div key={i} style={{ padding: "18px 20px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                  <span style={{ fontSize: 15 }}>{c.icon}</span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{c.label}</p>
                </div>
                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main: sidebar + list */}
      <div style={{ backgroundColor: "var(--background)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "240px 1fr" }} className="cat-body-grid">
          {/* Sidebar */}
          <aside style={{ borderRight: "1px solid var(--border)", padding: "28px 22px", position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto" }}>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 20 }}>Filter &amp; search</p>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 24 }}>
              <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)", display: "flex" }}><SearchIcon /></div>
              <input type="text" placeholder={`Search ${config.title.toLowerCase()}…`} value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "9px 12px 9px 34px", border: "1px solid var(--border)", borderRadius: 4, fontSize: 13.5, fontFamily: "var(--font-source-sans)", backgroundColor: "var(--card)", color: "var(--foreground)", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600 }}>Max price</p>
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>${maxPrice}</span>
              </div>
              <input type="range" min={40} max={300} step={10} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>$40</span>
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>$300+</span>
              </div>
            </div>

            <button onClick={() => { setSearch(""); setMaxPrice(300); setSortBy("rank"); }} style={{ width: "100%", padding: "8px", fontSize: 13, fontWeight: 600, color: "var(--muted-foreground)", backgroundColor: "transparent", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", marginBottom: 28 }}>Reset</button>

            {/* Related */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 12 }}>Related</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {config.relatedLinks.map((l) => (
                  <Link key={l.label} href={l.href} style={{ fontSize: 13, color: "var(--muted-foreground)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "color 0.12s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                  ><ArrowRight size={11} />{l.label}</Link>
                ))}
              </div>
            </div>
          </aside>

          {/* List */}
          <div style={{ padding: "28px 32px 72px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "var(--muted-foreground)" }}>
                Showing <strong style={{ color: "var(--foreground)" }}>{sorted.length}</strong> of {config.products.length}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)" }}>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "7px 12px", fontSize: 13, fontWeight: 500, backgroundColor: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", fontFamily: "var(--font-source-sans)" }}>
                  {config.sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sorted.map((p, i) => (
                <div key={p.id} style={{ backgroundColor: "var(--card)", border: `1px solid ${p.highlight ? "var(--accent)" : "var(--border)"}`, borderRadius: 6, overflow: "hidden", transition: "box-shadow 0.18s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  {p.highlight && (
                    <div style={{ backgroundColor: "var(--accent)", padding: "5px 18px" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: "white", fontFamily: "var(--font-dm-mono)", letterSpacing: "0.09em", textTransform: "uppercase" }}>★ Editor's pick</span>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 180px" }} className="product-card-grid">
                    <div style={{ position: "relative", backgroundColor: "var(--muted)" }}>
                      <img src={p.img} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 160 }} />
                      <div style={{ position: "absolute", top: 10, left: 10, width: 26, height: 26, backgroundColor: p.highlight ? "var(--accent)" : "rgba(20,30,52,0.8)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, fontWeight: 700, color: "white" }}>#{i + 1}</span>
                      </div>
                    </div>

                    <div style={{ padding: "18px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "var(--muted-foreground)" }}>{p.brand}</span>
                        {p.tags.map((t) => <span key={t} style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, fontWeight: 700, color: "var(--primary)", backgroundColor: "var(--secondary)", border: "1px solid var(--border)", padding: "1px 7px", borderRadius: 2 }}>{t}</span>)}
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, color: "var(--muted-foreground)", marginLeft: "auto" }}>Updated {p.updated}</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-fraunces)", fontSize: 19, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--foreground)", lineHeight: 1.15, marginBottom: 8 }}>{p.name}</h3>
                      <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 14 }}>{p.verdict}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {p.specChips.map((chip) => <span key={chip} style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, fontWeight: 500, color: "var(--secondary-foreground)", backgroundColor: "var(--secondary)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 3 }}>{chip}</span>)}
                      </div>
                      <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 10 }}><span style={{ fontWeight: 600, color: "var(--foreground)" }}>Best for:</span> {p.bestFor}</p>
                    </div>

                    <div style={{ borderLeft: "1px solid var(--border)", padding: "18px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <div style={{ width: 40, height: 40, backgroundColor: "var(--primary)", borderRadius: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 15, fontWeight: 600, color: scoreColor(p.score), lineHeight: 1 }}>{p.score.toFixed(1)}</span>
                            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 8, color: "rgba(255,255,255,0.4)" }}>/5</span>
                          </div>
                          <div>
                            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.05em" }}>PETMETRIC</p>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>Score</p>
                          </div>
                        </div>
                        <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)", lineHeight: 1, marginBottom: 4 }}>{p.priceDisplay}</p>
                        {p.subscription && <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10.5, color: "var(--muted-foreground)", lineHeight: 1.45, marginBottom: 14 }}>{p.subscription}</p>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Link href={`/reviews/${p.slug}/`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "var(--primary)", color: "white", padding: "9px 12px", borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "opacity 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                          Read review <ArrowRight size={12} />
                        </Link>
                        <a href={`#buy-${p.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "var(--accent)", color: "white", padding: "9px 12px", borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "opacity 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                          Check price <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {sorted.length === 0 && (
                <div style={{ textAlign: "center", padding: "64px 24px", backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 6 }}>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, color: "var(--foreground)", marginBottom: 8 }}>No products match your filters.</p>
                  <button onClick={() => { setSearch(""); setMaxPrice(300); }} style={{ padding: "9px 18px", fontSize: 14, fontWeight: 600, backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>Reset filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* All-products table */}
      <div style={{ backgroundColor: "var(--secondary)", borderTop: "1px solid var(--border)", padding: "52px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionLabel>At a glance</SectionLabel>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 24 }}>All {config.products.length} reviewed products</h2>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 600 }}>
              <thead>
                <tr style={{ backgroundColor: "var(--primary)" }}>
                  {["#", "Product", "Score", "Price", "Subscription", ""].map((h, hi) => (
                    <th key={hi} style={{ padding: "10px 16px", textAlign: "left", fontFamily: "var(--font-dm-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {config.products.map((p, i) => (
                  <tr key={p.id} style={{ backgroundColor: p.highlight ? "#fffbf5" : i % 2 === 0 ? "var(--card)" : "var(--secondary)" }}>
                    <td style={{ padding: "11px 16px" }}><span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 12, color: "var(--muted-foreground)" }}>#{i + 1}</span></td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {p.highlight && <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--accent)", display: "inline-block" }} />}
                        <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px" }}><span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 13.5, fontWeight: 700, color: scoreColor(p.score) }}>{p.score.toFixed(1)}</span></td>
                    <td style={{ padding: "11px 16px", fontFamily: "var(--font-dm-mono)", fontWeight: 600, color: "var(--foreground)" }}>{p.priceDisplay}</td>
                    <td style={{ padding: "11px 16px", fontSize: 13, color: "var(--muted-foreground)" }}>{p.subscription ?? "None"}</td>
                    <td style={{ padding: "11px 16px" }}><Link href={`/reviews/${p.slug}/`} style={{ fontSize: 12.5, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>Review →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// Category-specific configs

const GPS_CONFIG: CategoryConfig = {
  slug: "gps-pet-trackers", title: "GPS Pet Trackers", eyebrow: "Products / GPS Pet Trackers",
  subtitle: "Real-time location devices compared on coverage area, battery life, subscription cost, and app reliability. We flag US-only limitations clearly.",
  count: 19, lastUpdated: "Aug 2026",
  criteria: [
    { icon: "🌍", label: "Coverage area", body: "US-only LTE-M vs. global coverage affects usability when traveling." },
    { icon: "🔋", label: "Battery life", body: "Ranges from 2 days to 3 months — shorter life needs live tracking mode." },
    { icon: "💰", label: "Monthly cost", body: "Subscription is mandatory on most trackers. Calculate total annual cost." },
    { icon: "📍", label: "Update frequency", body: "Live tracking (2 sec) vs. location-save mode (10+ sec) differ significantly." },
    { icon: "❤️", label: "Health metrics", body: "Some trackers add activity, sleep, and calorie data at no extra charge." },
  ],
  sortOptions: [{ label: "Our ranking", value: "rank" }, { label: "Price: low to high", value: "price-asc" }, { label: "Price: high to low", value: "price-desc" }, { label: "PetMetric score", value: "score" }],
  relatedLinks: [
    { label: "Best GPS for escape-prone dogs", href: "/best-picks/best-gps-tracker-escape-prone-dogs/" },
    { label: "Tractive GPS vs. Fi Series 3", href: "/comparisons/tractive-gps-vs-fi-series-3/" },
    { label: "Tractive not updating location", href: "/troubleshooting/tractive-gps-location-not-updating/" },
  ],
  products: [
    { id: "fi-s3", name: "Fi Series 3", brand: "Fi", slug: "fi-series-3", img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=440&fit=crop&auto=format", alt: "Dog with Fi collar outdoors", price: 149, priceDisplay: "$149", subscription: "$8.25/mo", score: 4.1, verdict: "Best battery life in the category (up to 3 months) with reliable US LTE-M coverage and a sleek form factor.", bestFor: "US-based owners with active or escape-prone dogs", tags: ["Editor's pick"], specChips: ["US only", "3-month battery", "LTE-M + Wi-Fi", "IP68"], updated: "Aug 2026", highlight: true },
    { id: "tractive", name: "Tractive GPS DOG 4", brand: "Tractive", slug: "tractive-gps-dog-4", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=440&fit=crop&auto=format", alt: "Dog wearing Tractive tracker", price: 49, priceDisplay: "$49.99", subscription: "$12.99/mo", score: 3.9, verdict: "The most affordable hardware with global coverage in 175+ countries — ideal for owners who travel internationally.", bestFor: "International travelers and cost-sensitive buyers", tags: ["Best hardware price"], specChips: ["175+ countries", "2–5 day battery", "Live: 2–3 sec", "IP67"], updated: "Aug 2026", highlight: false },
    { id: "whistle-go", name: "Whistle GO Explore", brand: "Whistle", slug: "whistle-go-explore", img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=440&fit=crop&auto=format", alt: "Dog with Whistle tracker", price: 80, priceDisplay: "$79.95", subscription: "$9.95/mo", score: 3.8, verdict: "GPS plus health tracking (calories, sleep, activity) in one device; best for owners who want both in the US and Canada.", bestFor: "Health-conscious owners in North America", tags: [], specChips: ["US + Canada", "10-day battery", "Health tracking", "Lightweight"], updated: "Jul 2026", highlight: false },
    { id: "jiobit", name: "Jiobit Smart Tag", brand: "Jiobit", slug: "jiobit-smart-tag", img: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=440&fit=crop&auto=format", alt: "Small pet tracker on dog collar", price: 99, priceDisplay: "$99.99", subscription: "$8.99/mo", score: 3.6, verdict: "Ultra-compact and lightweight — the best option for small dogs and cats who reject bulkier collars.", bestFor: "Small dogs and cats under 10 lb", tags: ["Lightest"], specChips: ["US only", "7-day battery", "0.5 oz", "IP67"], updated: "Jun 2026", highlight: false },
  ],
};

const FEEDERS_CONFIG: CategoryConfig = {
  slug: "smart-pet-feeders", title: "Smart Pet Feeders", eyebrow: "Products / Smart Pet Feeders",
  subtitle: "Portion-controlled and camera-enabled feeders for dogs and cats. We test dispensing accuracy, scheduling flexibility, and long-term reliability.",
  count: 28, lastUpdated: "Sep 2026",
  criteria: [
    { icon: "⚖️", label: "Dispensing accuracy", body: "Variance at small portions matters most for diet-prescribed pets." },
    { icon: "📅", label: "Scheduling flexibility", body: "Some units cap at 4 meals/day; others allow per-meal intervals." },
    { icon: "📷", label: "Camera quality", body: "1080p with night vision is standard; some cameras are add-on accessories." },
    { icon: "🔌", label: "Power backup", body: "Dual power (AC + battery) prevents missed meals during outages." },
    { icon: "📱", label: "App reliability", body: "Missed schedules due to app bugs are more dangerous than missed alerts." },
  ],
  sortOptions: [{ label: "Our ranking", value: "rank" }, { label: "Price: low to high", value: "price-asc" }, { label: "Price: high to low", value: "price-desc" }, { label: "PetMetric score", value: "score" }],
  relatedLinks: [
    { label: "Best feeder for portion control", href: "/best-picks/best-pet-feeder-portion-control/" },
    { label: "PETLIBRO vs. Arf Pets Feeder", href: "/comparisons/petlibro-granary-vs-arf-pets-feeder/" },
    { label: "PETLIBRO not dispensing", href: "/troubleshooting/petlibro-granary-not-dispensing/" },
  ],
  products: [
    { id: "petlibro", name: "PETLIBRO Granary", brand: "PETLIBRO", slug: "petlibro-granary", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=440&fit=crop&auto=format", alt: "PETLIBRO Granary feeder", price: 90, priceDisplay: "$89.99", subscription: null, score: 4.2, verdict: "Best dispensing accuracy we've tested (±2%), 1080p camera, and flexible scheduling. The all-round leader.", bestFor: "Pets on medically prescribed portion-control diets", tags: ["Editor's pick", "Best accuracy"], specChips: ["±2% accuracy", "6L hopper", "1080p camera", "Dual-power"], updated: "Sep 2026", highlight: true },
    { id: "arf-pets", name: "Arf Pets Automatic Feeder", brand: "Arf Pets", slug: "arf-pets-feeder", img: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=440&fit=crop&auto=format", alt: "Arf Pets automatic pet feeder", price: 55, priceDisplay: "$54.99", subscription: null, score: 3.7, verdict: "Reliable for standard 4-meal schedules. Accuracy varies at small portions but adequate for healthy pets.", bestFor: "Owners needing a basic schedule feeder without a camera", tags: ["Budget pick"], specChips: ["±8% accuracy", "6L hopper", "No camera", "Dual-power"], updated: "Aug 2026", highlight: false },
    { id: "petsafe-healthy", name: "PetSafe Healthy Pet Simply Feed", brand: "PetSafe", slug: "petsafe-healthy-pet-simply-feed", img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=440&fit=crop&auto=format", alt: "PetSafe Healthy Pet feeder", price: 99, priceDisplay: "$99.99", subscription: null, score: 3.8, verdict: "Slow-feed mode and reliable scheduling. No camera or app; best for owners who prefer a simple, app-free setup.", bestFor: "Owners who want a reliable no-app feeder", tags: ["No app needed"], specChips: ["Slow-feed mode", "Up to 12 meals/day", "No camera", "Dual-power"], updated: "Jul 2026", highlight: false },
    { id: "petkit-fresh", name: "PETKIT Fresh Element Infinity", brand: "PETKIT", slug: "petkit-fresh-element-infinity", img: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=440&fit=crop&auto=format", alt: "PETKIT Fresh Element Infinity feeder", price: 130, priceDisplay: "$129.99", subscription: null, score: 3.9, verdict: "Desiccant drying system keeps dry food fresh longer — best choice for humid climates or owners who refill infrequently.", bestFor: "Owners in humid climates or with food-storage concerns", tags: ["Best freshness"], specChips: ["Desiccant system", "3L hopper", "1080p camera", "App + manual"], updated: "Sep 2026", highlight: false },
  ],
};

const CAMERAS_CONFIG: CategoryConfig = {
  slug: "pet-cameras", title: "Pet Cameras", eyebrow: "Products / Pet Cameras",
  subtitle: "Two-way audio, treat dispensing, and night vision — evaluated for video quality, app stability, and real-world performance for managing pet anxiety.",
  count: 22, lastUpdated: "Jul 2026",
  criteria: [
    { icon: "📐", label: "Field of view", body: "Fixed 138° lenses miss room corners; 360° pan covers the whole space." },
    { icon: "🌙", label: "Night vision", body: "Color night vision provides usable detail; IR gives basic shape recognition only." },
    { icon: "🔊", label: "Two-way audio", body: "Speaker quality and latency determine whether your pet actually responds to your voice." },
    { icon: "🍬", label: "Treat tossing", body: "Treat range and capacity vary; max range is typically 5–6 ft." },
    { icon: "💰", label: "Subscription cost", body: "Cloud storage subscriptions range from $0 to $16/mo — check what's locked behind paywall." },
  ],
  sortOptions: [{ label: "Our ranking", value: "rank" }, { label: "Price: low to high", value: "price-asc" }, { label: "Price: high to low", value: "price-desc" }, { label: "PetMetric score", value: "score" }],
  relatedLinks: [
    { label: "Best camera for separation anxiety", href: "/best-picks/best-pet-camera-separation-anxiety/" },
    { label: "Furbo 360° vs. Petcube Bites 2", href: "/comparisons/furbo-360-vs-petcube-bites-2/" },
    { label: "Furbo camera offline fix", href: "/troubleshooting/furbo-camera-offline/" },
  ],
  products: [
    { id: "furbo-360", name: "Furbo 360°", brand: "Furbo", slug: "furbo-360", img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&h=440&fit=crop&auto=format", alt: "Furbo 360 dog camera", price: 169, priceDisplay: "$169", subscription: "$8.99/mo", score: 4.0, verdict: "The best all-round pet camera: 360° pan, color night vision, Dog Alert AI, and the clearest two-way audio we tested.", bestFor: "Dog owners managing separation anxiety", tags: ["Editor's pick"], specChips: ["360° pan", "Color night vision", "Dog Alert AI", "6 ft treat range"], updated: "Jul 2026", highlight: true },
    { id: "petcube-bites-2", name: "Petcube Bites 2", brand: "Petcube", slug: "petcube-bites-2", img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=440&fit=crop&auto=format", alt: "Petcube Bites 2 camera", price: 90, priceDisplay: "$89.99", subscription: "$4.99/mo", score: 3.8, verdict: "Lower price, lower subscription, and adequate treat tossing. Best for cat owners or casual monitoring.", bestFor: "Cat owners and budget-conscious buyers", tags: ["Best value"], specChips: ["138° fixed", "IR night vision", "5 ft treat range", "1080p HD"], updated: "Jul 2026", highlight: false },
    { id: "wyze-cam-v3", name: "Wyze Cam v3", brand: "Wyze", slug: "wyze-cam-v3", img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=440&fit=crop&auto=format", alt: "Wyze Cam V3 pet camera", price: 35, priceDisplay: "$35.99", subscription: null, score: 3.5, verdict: "No treat dispenser, no pet-specific alerts, but the best budget option for basic live video and cloud storage.", bestFor: "Owners who just want live video without a subscription", tags: ["Lowest price"], specChips: ["120° fixed", "Color night vision", "No treats", "Free cloud (12 sec)"], updated: "Jun 2026", highlight: false },
    { id: "eufy-pet-cam", name: "eufy Pet Camera E220", brand: "eufy", slug: "eufy-pet-camera-e220", img: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=440&fit=crop&auto=format", alt: "eufy Pet Camera E220", price: 80, priceDisplay: "$79.99", subscription: null, score: 3.7, verdict: "Pan-and-tilt with no mandatory subscription; local storage via SD card. Best for privacy-conscious owners.", bestFor: "Owners who prefer local storage over cloud subscriptions", tags: ["No subscription"], specChips: ["340° pan", "IR night vision", "No treats", "Local SD storage"], updated: "Jun 2026", highlight: false },
  ],
};

function SmartFeedersPage() { return <GenericCategoryPage config={{ ...FEEDERS_CONFIG, products: FEEDERS_CONFIG.products.map((p, i) => ({ ...p, highlight: i === 0 })) }} />; }
function GPSTrackersPage() { return <GenericCategoryPage config={{ ...GPS_CONFIG, products: GPS_CONFIG.products.map((p, i) => ({ ...p, highlight: i === 0 })) }} />; }
function PetCamerasPage() { return <GenericCategoryPage config={{ ...CAMERAS_CONFIG, products: CAMERAS_CONFIG.products.map((p, i) => ({ ...p, highlight: i === 0 })) }} />; }

// ─── Guides Hub Page ──────────────────────────────────────────────────────────

const GUIDES_LIST = [
  {
    slug: "how-to-choose-automatic-litter-box",
    category: "Litter Boxes",
    categorySlug: "automatic-litter-boxes",
    title: "How to choose an automatic litter box",
    desc: "The five questions to answer before spending $200–$700 on a self-cleaning unit. Covers cat count, litter type, noise tolerance, and total cost of ownership.",
    readTime: "8 min read",
    updated: "Aug 2026",
    img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=380&fit=crop&auto=format",
  },
  {
    slug: "gps-tracker-subscription-costs-explained",
    category: "GPS Trackers",
    categorySlug: "gps-pet-trackers",
    title: "GPS tracker subscription costs, explained",
    desc: "Why every GPS tracker requires a subscription, what's typically locked behind the paywall, and how to calculate the real annual cost before buying.",
    readTime: "6 min read",
    updated: "Aug 2026",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=380&fit=crop&auto=format",
  },
  {
    slug: "clumping-vs-crystal-litter",
    category: "Litter Boxes",
    categorySlug: "automatic-litter-boxes",
    title: "Clumping vs. crystal litter: which is cheaper long-term?",
    desc: "Crystal trays have a lower upfront cost per tray but higher monthly cost than clumping brands. We run the numbers for 1, 2, and 3-cat households.",
    readTime: "5 min read",
    updated: "Jul 2026",
    img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=380&fit=crop&auto=format",
  },
  {
    slug: "pet-feeder-dispensing-accuracy",
    category: "Feeders",
    categorySlug: "smart-pet-feeders",
    title: "Why dispensing accuracy matters (and how to test it)",
    desc: "A 10% variance on a 5g portion means your pet gets 4.5–5.5g instead of 5g. For a diet-controlled pet, that's clinically significant. Here's how to measure it.",
    readTime: "7 min read",
    updated: "Sep 2026",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=380&fit=crop&auto=format",
  },
  {
    slug: "pet-camera-separation-anxiety-guide",
    category: "Cameras",
    categorySlug: "pet-cameras",
    title: "Pet cameras and separation anxiety: what actually helps",
    desc: "Two-way audio can comfort some dogs and stress others. We explain which camera features reduce anxiety, and which are mostly for the owner's peace of mind.",
    readTime: "9 min read",
    updated: "Jul 2026",
    img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&h=380&fit=crop&auto=format",
  },
  {
    slug: "wifi-vs-cellular-pet-tracker",
    category: "GPS Trackers",
    categorySlug: "gps-pet-trackers",
    title: "Wi-Fi triangulation vs. cellular GPS: what's the difference?",
    desc: "Fi Series 3 uses both; Tractive uses cellular only. We explain how each technology works, where it fails, and which matters more for your use case.",
    readTime: "6 min read",
    updated: "Aug 2026",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=380&fit=crop&auto=format",
  },
];

const GUIDE_CAT_FILTERS = [
  { label: "All guides", slug: "all" },
  { label: "Litter Boxes", slug: "automatic-litter-boxes" },
  { label: "GPS Trackers", slug: "gps-pet-trackers" },
  { label: "Feeders", slug: "smart-pet-feeders" },
  { label: "Cameras", slug: "pet-cameras" },
];

function GuidesPage() {
  const [catFilter, setGuideCatFilter] = useState("all");

  const filtered = catFilter === "all"
    ? GUIDES_LIST
    : GUIDES_LIST.filter((g) => g.categorySlug === catFilter);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Guides" }]}
        eyebrow="Buying Education"
        title="Know before you buy."
        subtitle="Topic-based guides that answer the questions product pages can't — how technologies work, how costs compare over time, and what specs actually matter."
      />

      <div style={{ backgroundColor: "var(--background)", padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>Topic:</span>
            {GUIDE_CAT_FILTERS.map((f) => (
              <button key={f.slug} onClick={() => setGuideCatFilter(f.slug)} style={{
                padding: "7px 15px", fontSize: 13.5, fontWeight: 500,
                backgroundColor: catFilter === f.slug ? "var(--primary)" : "var(--card)",
                color: catFilter === f.slug ? "white" : "var(--foreground)",
                border: `1px solid ${catFilter === f.slug ? "var(--primary)" : "var(--border)"}`,
                borderRadius: 4, cursor: "pointer", transition: "all 0.15s",
              }}>{f.label}</button>
            ))}
          </div>

          {/* Guide grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="guides-grid">
            {filtered.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}/`}
                style={{ display: "flex", flexDirection: "column", backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden", textDecoration: "none", color: "var(--foreground)", transition: "box-shadow 0.18s, transform 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ height: 160, overflow: "hidden", backgroundColor: "var(--muted)", position: "relative" }}>
                  <img src={guide.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "white", backgroundColor: "rgba(15,25,45,0.75)", padding: "3px 9px", borderRadius: 3 }}>{guide.category}</span>
                  </div>
                </div>
                <div style={{ padding: "18px 20px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontFamily: "var(--font-fraunces)", fontSize: 16.5, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 10, color: "var(--foreground)" }}>{guide.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.6, flex: 1, marginBottom: 14 }}>{guide.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)" }}>{guide.readTime}</span>
                      <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 11, color: "var(--muted-foreground)" }}>Updated {guide.updated}</span>
                    </div>
                    <span style={{ color: "var(--accent)" }}><ArrowRight size={14} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "56px", color: "var(--muted-foreground)" }}>
              <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, marginBottom: 8, color: "var(--foreground)" }}>No guides in this category yet.</p>
              <p style={{ fontSize: 14 }}>We publish new guides monthly. Check back soon.</p>
            </div>
          )}

          {/* Bottom info strip */}
          <div style={{ marginTop: 48, backgroundColor: "var(--secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 18, fontWeight: 600, color: "var(--foreground)", marginBottom: 6 }}>Looking for a specific product recommendation?</p>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6 }}>Guides explain the technology. Our best picks and comparisons name specific products.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
              <Link href="/best-picks/" style={{ display: "inline-flex", alignItems: "center", gap: 7, backgroundColor: "var(--primary)", color: "white", padding: "10px 18px", borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Best picks <ArrowRight size={13} /></Link>
              <Link href="/comparisons/" style={{ display: "inline-flex", alignItems: "center", gap: 7, backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)", padding: "10px 18px", borderRadius: 4, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Comparisons</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── App shell with simple page routing ──────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<PageId>("home");
  const navigate = useCallback((href: string) => {
    const target = hrefToPage(href);
    if (target) { setPage(target); window.scrollTo(0, 0); }
  }, []);

  return (
    <NavCtx.Provider value={navigate}>
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .show-mobile-block { display: block !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .two-col-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .featured-comp { grid-template-columns: 1fr !important; }
          .product-hero-grid { grid-template-columns: 1fr !important; }
          .product-body-grid { grid-template-columns: 1fr !important; }
          .pros-cons-grid { grid-template-columns: 1fr !important; }
          .cat-header-grid { grid-template-columns: 1fr !important; }
          .cat-body-grid { grid-template-columns: 1fr !important; }
          .product-card-grid { grid-template-columns: 1fr !important; }
          .criteria-grid { grid-template-columns: 1fr 1fr !important; }
          .bp-grid { grid-template-columns: 1fr !important; }
          .guides-grid { grid-template-columns: 1fr !important; }
          .hub-links-grid { grid-template-columns: 1fr !important; }
        }
        /* Page-switch nav links in preview */
        .preview-page-switch { display: flex; gap: 8px; padding: 8px 24px; background: #f0f4ff; border-bottom: 1px solid #d0d8f0; font-size: 12.5px; align-items: center; }
        .preview-page-switch span { color: #6b7280; }
        .preview-page-switch button { background: none; border: none; cursor: pointer; font-size: 12.5px; font-weight: 600; padding: 3px 10px; border-radius: 3px; }
        .preview-page-switch button.active { background: var(--primary); color: white; }
        .preview-page-switch button:not(.active) { color: #4b5563; }
      `}</style>

      {/* Preview page switcher — not part of the real site nav */}
      <div className="preview-page-switch">
        <span>Preview:</span>
        <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>Home</button>
        <button className={page === "comparisons" ? "active" : ""} onClick={() => setPage("comparisons")}>Comparisons</button>
        <button className={page === "product" ? "active" : ""} onClick={() => setPage("product")}>Product</button>
        <button className={page === "category" ? "active" : ""} onClick={() => setPage("category")}>Category</button>
        <button className={page === "best-picks" ? "active" : ""} onClick={() => setPage("best-picks")}>Best Picks</button>
        <button className={page === "troubleshooting" ? "active" : ""} onClick={() => setPage("troubleshooting")}>Troubleshooting</button>
        <button className={page === "about" ? "active" : ""} onClick={() => setPage("about")}>About</button>
        <button className={page === "editorial" ? "active" : ""} onClick={() => setPage("editorial")}>Standards</button>
        <button className={page === "disclosure" ? "active" : ""} onClick={() => setPage("disclosure")}>Disclosure</button>
        <button className={page === "contact" ? "active" : ""} onClick={() => setPage("contact")}>Contact</button>
        <button className={page === "products-hub" ? "active" : ""} onClick={() => setPage("products-hub")}>Products Hub</button>
        <button className={page === "feeders" ? "active" : ""} onClick={() => setPage("feeders")}>Feeders</button>
        <button className={page === "gps" ? "active" : ""} onClick={() => setPage("gps")}>GPS</button>
        <button className={page === "cameras" ? "active" : ""} onClick={() => setPage("cameras")}>Cameras</button>
        <button className={page === "guides" ? "active" : ""} onClick={() => setPage("guides")}>Guides</button>
      </div>

      <Nav />
      <main style={{ flex: 1 }}>
        {page === "home" && (
          <>
            <Hero />
            <Categories />
            <Comparisons />
            <BestPicks />
            <Troubleshooting />
            <Methodology />
          </>
        )}
        {page === "comparisons" && <ComparisonsPage />}
        {page === "product" && <ProductPage />}
        {page === "category" && <AutomaticLitterBoxesPage />}
        {page === "best-picks" && <BestPicksPage />}
        {page === "troubleshooting" && <TroubleshootingPage />}
        {page === "about" && <AboutPage />}
        {page === "editorial" && <EditorialStandardsPage />}
        {page === "disclosure" && <DisclosurePage />}
        {page === "contact" && <ContactPage />}
        {page === "products-hub" && <ProductsHubPage />}
        {page === "feeders" && <SmartFeedersPage />}
        {page === "gps" && <GPSTrackersPage />}
        {page === "cameras" && <PetCamerasPage />}
        {page === "guides" && <GuidesPage />}
      </main>
      <Footer />
    </div>
    </NavCtx.Provider>
  );
}
