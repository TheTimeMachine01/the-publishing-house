import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Eye,
  Gamepad2,
  IndianRupee,
  Leaf,
  LibraryBig,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { PUBLICATIONS, formatRupees, type PublicationProduct } from "@/lib/publication-catalog";
import { calculateDiscount, calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/commerce";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartLine {
  productId: string;
  quantity: number;
}

interface StorefrontContextValue {
  cart: CartLine[];
  cartOpen: boolean;
  checkoutOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity?: number) => void;
  changeQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

const cartStorageKey = "drumil-cart-v1";

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(cartStorageKey);
      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed.filter(isCartLine));
        }
      }
    } catch {
      window.localStorage.removeItem(cartStorageKey);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, hydrated]);

  const value = useMemo<StorefrontContextValue>(
    () => ({
      cart,
      cartOpen,
      checkoutOpen,
      setCartOpen,
      setCheckoutOpen,
      addToCart: (productId, quantity = 1) => {
        if (!PUBLICATIONS.some((publication) => publication.id === productId)) return;
        setCart((current) => {
          const existing = current.find((line) => line.productId === productId);
          return existing
            ? current.map((line) =>
                line.productId === productId ? { ...line, quantity: line.quantity + quantity } : line,
              )
            : [...current, { productId, quantity }];
        });
        setCartOpen(true);
        toast.success("Added to your bag");
      },
      changeQuantity: (productId, delta) =>
        setCart((current) =>
          current
            .map((line) =>
              line.productId === productId ? { ...line, quantity: line.quantity + delta } : line,
            )
            .filter((line) => line.quantity > 0),
        ),
      removeFromCart: (productId) => setCart((current) => current.filter((line) => line.productId !== productId)),
    }),
    [cart, cartOpen, checkoutOpen],
  );

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { productId?: unknown; quantity?: unknown };
  return (
    typeof candidate.productId === "string" &&
    PUBLICATIONS.some((product) => product.id === candidate.productId) &&
    typeof candidate.quantity === "number" &&
    Number.isInteger(candidate.quantity) &&
    candidate.quantity > 0 &&
    candidate.quantity < 100
  );
}

export function useStorefront() {
  const storefront = useContext(StorefrontContext);
  if (!storefront) throw new Error("Storefront state must be used inside StorefrontProvider");
  return storefront;
}

export function StorefrontShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppContact />
    </>
  );
}

function Header() {
  const { cart, setCartOpen } = useStorefront();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const results = query.trim()
    ? PUBLICATIONS.filter((product) => product.title.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];

  const navLinks = [
    { label: "Shop all", to: "/shop" as const },
    { label: "EyeCue games", to: "/shop" as const },
    { label: "Wisdom books", to: "/shop" as const },
    { label: "Interactive lab", to: "/interactive-lab" as const },
    { label: "Our story", to: "/about" as const },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="bg-forest text-primary-foreground">
        <div className="page-wrap flex min-h-8 items-center justify-center gap-x-2 py-1 text-center text-[0.65rem] font-semibold sm:text-xs">
          <Sparkles className="size-3.5 text-saffron" aria-hidden="true" />
          <span>Flat 15% off your first order with YOUTH15</span>
          <span className="hidden text-primary-foreground/70 sm:inline">· Free shipping over ₹500</span>
          <Link className="hidden underline underline-offset-2 sm:inline" to="/shop">
            Shop now
          </Link>
        </div>
      </div>
      <div className="page-wrap flex min-h-[4.4rem] items-center justify-between gap-3">
        <Link aria-label="Drumil Publications home" className="group flex min-w-0 items-center gap-2.5" to="/">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-forest text-primary-foreground transition-transform group-hover:-rotate-3">
            <BookOpen className="size-5 text-saffron" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-sm font-extrabold sm:text-base">Drumil</span>
            <span className="block truncate text-[0.61rem] font-medium tracking-[0.12em] text-muted-foreground sm:text-[0.65rem]">
              PUBLICATIONS
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 xl:flex" aria-label="Main navigation">
          {navLinks.map((link, index) => (
            <Link
              key={`${link.label}-${index}`}
              to={link.to}
              className="nav-link whitespace-nowrap text-[0.78rem] font-semibold text-foreground/80 transition-colors hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden lg:block">
            {searchOpen ? (
              <div className="relative">
                <label className="sr-only" htmlFor="site-search">
                  Search publications
                </label>
                <Input
                  autoFocus
                  id="site-search"
                  className="h-9 w-44 pr-9 xl:w-48"
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setSearchOpen(false);
                      setQuery("");
                    }
                  }}
                  placeholder="Find a book or game"
                  value={query}
                />
                <Button
                  aria-label="Close search"
                  className="absolute right-0 top-0"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <X />
                </Button>
                {results.length > 0 && (
                  <div className="absolute right-0 top-11 z-50 w-72 border border-border bg-background p-2 shadow-lg">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        className="flex items-center justify-between gap-2 p-2 text-sm hover:bg-muted"
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                        params={{ slug: product.slug }}
                        to="/product/$slug"
                      >
                        <span className="line-clamp-1">{product.title}</span>
                        <span className="shrink-0 text-muted-foreground">{formatRupees(product.price)}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {query.trim() && results.length === 0 && (
                  <div className="absolute right-0 top-11 z-50 w-72 border border-border bg-background p-4 text-sm text-muted-foreground shadow-lg">
                    No matching titles. Try “EyeCue” or “wisdom”.
                  </div>
                )}
              </div>
            ) : (
              <Button aria-label="Search publications" onClick={() => setSearchOpen(true)} size="icon" variant="ghost">
                <Search />
              </Button>
            )}
          </div>
          <Button
            aria-label={`Open shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative"
            onClick={() => setCartOpen(true)}
            size="icon"
            variant="ghost"
          >
            <ShoppingBag />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-[1.15rem] place-items-center rounded-full bg-saffron text-[0.65rem] font-extrabold text-foreground">
                {count}
              </span>
            )}
          </Button>
          <Button
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="xl:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            size="icon"
            variant="ghost"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="border-t border-border bg-background xl:hidden" aria-label="Mobile navigation">
          <div className="page-wrap grid grid-cols-2 gap-x-4 gap-y-1 py-3">
            {navLinks.map((link, index) => (
              <Link
                key={`${link.label}-${index}`}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-10 items-center border-b border-border/70 px-1 text-sm font-semibold"
              >
                {link.label}
                <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground" />
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-10 items-center border-b border-border/70 px-1 text-sm font-semibold"
            >
              Contact
              <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/60 pb-20 pt-12 md:pb-8">
      <div className="page-wrap grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.3fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 font-display text-base font-extrabold">
            <BookOpen className="size-5 text-forest" /> Drumil Publications
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            Timeless wisdom, reimagined for curious, modern minds. Rooted in Chittorgarh, Rajasthan.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-display text-sm font-bold">Explore</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" to="/shop">Books & games</Link></li>
            <li><Link className="hover:text-foreground" to="/interactive-lab">Interactive lab</Link></li>
            <li><Link className="hover:text-foreground" to="/journal">The Mind Journal</Link></li>
            <li><Link className="hover:text-foreground" to="/about">Our story</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-display text-sm font-bold">Get in touch</h2>
          <address className="space-y-2 text-sm not-italic leading-5 text-muted-foreground">
            <p>Soham, 15 Krishna Vatika,<br />Madhuvan Senthi, Chittorgarh,<br />Rajasthan 312001</p>
            <a className="block hover:text-foreground" href="tel:+919460136485">+91 94601 36485</a>
          </address>
        </div>
        <div>
          <h2 className="mb-3 font-display text-sm font-bold">Made for the mind</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Independent publishing and screen-free play, shared from the heart of Rajasthan.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">© 2026 Drumil Publications</p>
        </div>
      </div>
      <div className="page-wrap mt-9 border-t border-border pt-4 text-xs text-muted-foreground">
        Prototype storefront · Orders and payments are not processed here.
      </div>
    </footer>
  );
}

function WhatsAppContact() {
  const message = encodeURIComponent("Hi Drumil Publications, I'd like to ask a question about your books/EyeCue games");
  return (
    <a
      aria-label="Contact Drumil Publications on WhatsApp"
      className="fixed bottom-4 right-4 z-30 grid size-12 place-items-center rounded-full border border-primary-foreground/35 bg-forest text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      href={`https://wa.me/919460136485?text=${message}`}
      rel="noreferrer"
      target="_blank"
      title="Chat with Drumil Publications"
    >
      <svg aria-hidden="true" className="size-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.42 0 .04 5.38.04 12c0 2.11.55 4.16 1.6 5.98L0 24l6.18-1.62a11.94 11.94 0 0 0 5.86 1.49h.01C18.66 23.87 24 18.5 24 11.88c0-3.2-1.25-6.2-3.48-8.4ZM12.05 21.84h-.01a9.91 9.91 0 0 1-5.05-1.38l-.36-.21-3.67.96.98-3.58-.24-.37a9.91 9.91 0 0 1-1.52-5.26C2.18 6.5 6.6 2.1 12.04 2.1a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.43 9.84-9.89 9.84Zm5.42-7.38c-.3-.15-1.78-.88-2.06-.98-.27-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.63-.94-2.23-.25-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.81.38-.28.3-1.07 1.05-1.07 2.54 0 1.5 1.1 2.94 1.25 3.14.15.2 2.15 3.28 5.2 4.6.73.32 1.3.5 1.75.65.74.23 1.41.2 1.94.12.59-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
      </svg>
    </a>
  );
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setCheckoutOpen, changeQuantity, removeFromCart } = useStorefront();
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState("");
  const [includeUpsell, setIncludeUpsell] = useState(false);
  const upsell = PUBLICATIONS.find((product) => product.id === "game-english");
  const cartProducts = cart.flatMap((line) => {
    const product = PUBLICATIONS.find((item) => item.id === line.productId);
    return product ? [{ ...product, quantity: line.quantity }] : [];
  });
  const subtotal = cartProducts.reduce((sum, line) => sum + line.price * line.quantity, 0) + (includeUpsell ? 299 : 0);
  const shipping = calculateShipping(subtotal);
  const discount = calculateDiscount(subtotal, coupon);
  const total = subtotal + shipping - discount;
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const applyCoupon = (value: string) => {
    const normalized = value.trim().toUpperCase();
    if (normalized !== "YOUTH10" && normalized !== "YOUTH15") {
      toast.error("Try YOUTH10 or YOUTH15");
      return;
    }
    setCoupon(normalized);
    setCouponInput(normalized);
    toast.success(`${normalized} applied`);
  };

  const openCheckout = () => {
    if (cartProducts.length === 0 && !includeUpsell) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <Sheet onOpenChange={setCartOpen} open={cartOpen}>
      <SheetContent className="flex w-full max-w-full flex-col overflow-hidden p-0 sm:w-[28rem] sm:max-w-[28rem]" side="right">
        <SheetHeader className="border-b border-border px-5 py-5 text-left sm:px-6">
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <ShoppingBag className="size-5 text-forest" /> Your bag
            <span className="grid size-6 place-items-center rounded-full bg-secondary text-xs font-bold">
              {cartProducts.reduce((sum, line) => sum + line.quantity, 0) + (includeUpsell ? 1 : 0)}
            </span>
          </SheetTitle>
          <SheetDescription className="sr-only">Review quantities, apply discounts, or start a demo checkout.</SheetDescription>
        </SheetHeader>
        {cartProducts.length === 0 && !includeUpsell ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-muted"><ShoppingBag className="size-7 text-muted-foreground" /></span>
            <h3 className="mt-5 font-display text-lg font-bold">A little room for curiosity</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Your bag is empty. Find a book or game that speaks to you.</p>
            <Button className="mt-5" onClick={() => setCartOpen(false)} asChild>
              <Link to="/shop">Explore the collection <ArrowRight /></Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold">{shipping === 0 ? "Free shipping unlocked" : "Shipping across India"}</span>
                <span className="text-muted-foreground">{shipping === 0 ? "₹0" : `${formatRupees(Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal))} to go`}</span>
              </div>
              <Progress aria-label={`${shippingProgress}% toward free shipping`} className="h-1.5 bg-secondary" value={shippingProgress} />
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
              {cartProducts.map((line) => (
                <div key={line.id} className="grid grid-cols-[3.75rem_minmax(0,1fr)_auto] gap-3 border-b border-border pb-4">
                  <ProductCover className="w-15" product={line} />
                  <div className="min-w-0">
                    <Link className="line-clamp-2 text-sm font-bold hover:text-forest" params={{ slug: line.slug }} to="/product/$slug">{line.title}</Link>
                    <p className="mt-1 text-sm font-bold">{formatRupees(line.price)}</p>
                    <div className="mt-2 inline-flex h-8 items-center border border-border">
                      <Button aria-label={`Decrease ${line.title} quantity`} className="size-7" onClick={() => changeQuantity(line.id, -1)} size="icon" variant="ghost"><Minus /></Button>
                      <span aria-live="polite" className="min-w-7 text-center text-xs font-semibold">{line.quantity}</span>
                      <Button aria-label={`Increase ${line.title} quantity`} className="size-7" onClick={() => changeQuantity(line.id, 1)} size="icon" variant="ghost"><Plus /></Button>
                    </div>
                  </div>
                  <Button aria-label={`Remove ${line.title}`} className="size-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(line.id)} size="icon" variant="ghost"><Trash2 /></Button>
                </div>
              ))}
              {includeUpsell && upsell && (
                <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                  <div className="flex min-w-0 gap-3">
                    <ProductCover className="w-15" product={upsell} />
                    <div className="min-w-0"><p className="line-clamp-2 text-sm font-bold">EyeCue English add-on</p><p className="mt-1 text-xs text-muted-foreground">Added at the bundle offer price</p><p className="mt-1 text-sm font-bold">₹299</p></div>
                  </div>
                  <Button aria-label="Remove EyeCue add-on" className="size-8 text-muted-foreground" onClick={() => setIncludeUpsell(false)} size="icon" variant="ghost"><Trash2 /></Button>
                </div>
              )}
              {!includeUpsell && upsell && (
                <div className="flex items-center justify-between gap-3 border border-dashed border-forest/35 bg-muted/50 p-3">
                  <div className="min-w-0"><span className="text-[0.62rem] font-bold uppercase text-forest">A little more play</span><p className="mt-1 text-xs font-semibold">Add EyeCue English for ₹299</p></div>
                  <Button className="shrink-0" onClick={() => setIncludeUpsell(true)} size="sm" variant="outline"><Plus /> Add</Button>
                </div>
              )}
              <div>
                <p className="mb-2 text-xs font-semibold">A little something extra?</p>
                <div className="flex gap-2">
                  <Input aria-label="Discount code" className="h-9" onChange={(event) => setCouponInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applyCoupon(couponInput); } }} placeholder="Enter code" value={couponInput} />
                  <Button onClick={() => applyCoupon(couponInput)} size="sm" variant="outline">Apply</Button>
                </div>
                <div className="mt-2 flex gap-2">
                  {(["YOUTH15", "YOUTH10"] as const).map((code) => (
                    <Button className="h-7 px-2 text-[0.65rem]" key={code} onClick={() => applyCoupon(code)} size="sm" variant={coupon === code ? "secondary" : "ghost"}>
                      {coupon === code && <Check />} {code}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter className="border-t border-border px-5 pb-5 pt-4 sm:px-6">
              <div className="w-full space-y-2 text-sm">
                <PriceRow label="Subtotal" value={formatRupees(subtotal)} />
                <PriceRow label="Shipping" value={shipping === 0 ? "Free" : formatRupees(shipping)} />
                {discount > 0 && <PriceRow label={`Discount · ${coupon}`} value={`−${formatRupees(discount)}`} />}
                <PriceRow bold label="Total" value={formatRupees(total)} />
                <Button className="mt-2 w-full" onClick={openCheckout} size="lg">Continue to demo checkout <ArrowRight /></Button>
                <p className="text-center text-[0.65rem] text-muted-foreground">Preview only · no payment will be taken</p>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
      <CheckoutDialog
        open={useStorefront().checkoutOpen}
        onOpenChange={useStorefront().setCheckoutOpen}
        subtotal={subtotal}
        shipping={shipping}
        discount={discount}
        total={total}
        clearCart={() => {
          cartProducts.forEach((product) => removeFromCart(product.id));
          setIncludeUpsell(false);
        }}
      />
    </Sheet>
  );
}

function PriceRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex items-center justify-between ${bold ? "border-t border-border pt-2 text-base font-extrabold" : "text-muted-foreground"}`}><span>{label}</span><span className={bold ? "text-foreground" : "text-foreground"}>{value}</span></div>;
}

function CheckoutDialog({
  open,
  onOpenChange,
  subtotal,
  shipping,
  discount,
  total,
  clearCart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  clearCart: () => void;
}) {
  const [complete, setComplete] = useState(false);
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [payment, setPayment] = useState("upi");

  useEffect(() => {
    try {
      setName(window.localStorage.getItem("drumil-checkout-name") ?? "");
      setEmailOrPhone(window.localStorage.getItem("drumil-checkout-contact") ?? "");
    } catch {
      setName("");
      setEmailOrPhone("");
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setComplete(false);
  }, [open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      window.localStorage.setItem("drumil-checkout-name", name);
      window.localStorage.setItem("drumil-checkout-contact", emailOrPhone);
    } catch {
      // The preview checkout remains usable when browser storage is unavailable.
    }
    setComplete(true);
    clearCart();
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto p-0 sm:max-w-2xl">
        {complete ? (
          <div className="px-6 py-12 text-center sm:px-10">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-forest"><Check className="size-7" /></div>
            <p className="mt-5 text-xs font-bold uppercase text-forest">Demo complete</p>
            <DialogHeader className="mt-2 text-center"><DialogTitle className="font-display text-2xl">Your preview is ready.</DialogTitle><DialogDescription className="mx-auto mt-2 max-w-sm text-sm leading-6">This is a sample checkout only. Nothing was charged, sent, or placed with a fulfillment service.</DialogDescription></DialogHeader>
            <div className="mx-auto mt-6 max-w-xs border border-border bg-muted/60 p-4 text-left text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-mono font-bold">DP-DEMO-001</span></div><div className="mt-2 flex justify-between"><span className="text-muted-foreground">Preview total</span><span className="font-bold">{formatRupees(total)}</span></div><div className="mt-2 flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-semibold">Not processed</span></div></div>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>Continue exploring <ArrowRight /></Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-5 py-5 pr-12 sm:px-7">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-forest"><ShoppingBag className="size-3.5" /> Guest checkout preview</div>
              <DialogHeader><DialogTitle className="font-display text-xl sm:text-2xl">Nearly yours.</DialogTitle><DialogDescription className="mt-1 text-sm">Enter sample details to see the demo confirmation. No payments are collected.</DialogDescription></DialogHeader>
            </div>
            <form className="grid gap-5 px-5 py-5 sm:grid-cols-[1fr_0.86fr] sm:px-7" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="grid gap-1.5 text-xs font-semibold" htmlFor="checkout-name">Full name<Input autoComplete="name" id="checkout-name" onChange={(event) => setName(event.target.value)} placeholder="Your name" required value={name} /></label>
                <label className="grid gap-1.5 text-xs font-semibold" htmlFor="checkout-contact">Email or mobile<Input autoComplete="email" id="checkout-contact" onChange={(event) => setEmailOrPhone(event.target.value)} placeholder="name@example.com or +91…" required value={emailOrPhone} /></label>
                <label className="grid gap-1.5 text-xs font-semibold" htmlFor="checkout-pincode">PIN code<Input autoComplete="postal-code" id="checkout-pincode" inputMode="numeric" maxLength={6} placeholder="312001" /></label>
                <label className="grid gap-1.5 text-xs font-semibold" htmlFor="checkout-address">Delivery address<Input autoComplete="street-address" id="checkout-address" placeholder="House / street (optional in demo)" /></label>
                <div className="mt-2 flex items-start gap-2 border border-dashed border-border bg-muted/60 p-3 text-xs leading-5 text-muted-foreground"><CircleHelp className="mt-0.5 size-4 shrink-0" /> Details stay in this browser only for the preview. No address or payment is sent.</div>
              </div>
              <div className="space-y-4">
                <fieldset className="space-y-2"><legend className="mb-2 text-xs font-semibold">Choose a demo payment</legend>
                  <label className="flex cursor-pointer gap-2 border border-border p-3 text-xs"><input checked={payment === "upi"} name="payment-method" onChange={() => setPayment("upi")} type="radio" value="upi" /><span><strong className="block">UPI · sample only</strong><span className="text-muted-foreground">No app or payment opens</span></span></label>
                  <label className="flex cursor-pointer gap-2 border border-border p-3 text-xs"><input checked={payment === "cod"} name="payment-method" onChange={() => setPayment("cod")} type="radio" value="cod" /><span><strong className="block">Cash on delivery · sample</strong><span className="text-muted-foreground">No order will be shipped</span></span></label>
                </fieldset>
                <div className="space-y-2 border-t border-border pt-3 text-xs">
                  <PriceRow label="Subtotal" value={formatRupees(subtotal)} />
                  <PriceRow label="Shipping" value={shipping === 0 ? "Free" : formatRupees(shipping)} />
                  {discount > 0 && <PriceRow label="Discount" value={`−${formatRupees(discount)}`} />}
                  <PriceRow bold label="Preview total" value={formatRupees(total)} />
                </div>
                <Button className="w-full" type="submit">Show sample confirmation <ArrowRight /></Button>
                <p className="text-center text-[0.65rem] leading-4 text-muted-foreground">Demo only · no payment, shipment, or real order is created.</p>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ProductCover({ product, className = "" }: { product: PublicationProduct; className?: string }) {
  return (
    <div aria-label={`${product.title} cover artwork`} className={`cover-art ${product.cover} ${className}`} role="img">
      <span className="cover-art__mark">Drumil · {product.category === "games" ? "EyeCue" : "Editions"}</span>
      <span className="cover-art__title">{product.title.replace(/^EyeCue( \(IQ Developer\))?:?\s*/, "EyeCue\n").replace(": ", "\n")}</span>
      <span className="cover-art__subtitle">{product.originalTitle && product.originalTitle !== product.title ? product.originalTitle : product.category === "games" ? "Think · notice · play" : "Timeless wisdom · modern minds"}</span>
    </div>
  );
}

export function ProductCard({ product, onPreview }: { product: PublicationProduct; onPreview?: (product: PublicationProduct) => void }) {
  const { addToCart } = useStorefront();
  const percentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  return (
    <article className="group flex min-w-0 flex-col border border-border bg-card transition-transform duration-300 hover:-translate-y-1">
      <Link aria-label={`View ${product.title}`} className="relative block overflow-hidden bg-muted" params={{ slug: product.slug }} to="/product/$slug">
        <ProductCover className="transition-transform duration-500 group-hover:scale-[1.025]" product={product} />
        <span className="absolute left-2 top-2 max-w-[85%] truncate border border-border/70 bg-background/95 px-2 py-1 text-[0.62rem] font-bold uppercase">{product.badges[0]}</span>
        <span className="absolute bottom-2 right-2 bg-forest px-2 py-1 text-[0.62rem] font-extrabold text-primary-foreground">{percentage}% off</span>
      </Link>
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
        <div className="flex items-center justify-between gap-2 text-[0.63rem] font-semibold text-muted-foreground"><span>{product.category === "games" ? "EYECUE · SCREEN-FREE PLAY" : "DRUMIL · WISDOM & IDEAS"}</span><span className="shrink-0 rounded-full bg-muted px-2 py-0.5">{product.targetAge}</span></div>
        <Link className="mt-2 line-clamp-2 min-h-[2.75rem] font-display text-sm font-bold leading-5 hover:text-forest sm:text-base" params={{ slug: product.slug }} to="/product/$slug">{product.title}</Link>
        <p className="mt-1.5 line-clamp-2 min-h-[2.4rem] text-xs leading-[1.2rem] text-muted-foreground">{product.tagline}</p>
        <div className="mt-2 flex items-baseline gap-2"><span className="text-base font-extrabold">{formatRupees(product.price)}</span><span className="text-xs text-muted-foreground line-through">{formatRupees(product.originalPrice)}</span></div>
        <div className="mt-3 flex items-center gap-2">
          <Button aria-label={`Add ${product.title} to bag`} className="min-w-0 flex-1" onClick={() => addToCart(product.id)} size="sm"><ShoppingBag /> <span className="truncate">Add to bag</span></Button>
          <Button aria-label={`Look inside ${product.title}`} className="shrink-0" onClick={() => onPreview?.(product)} size="icon" title="Look inside" variant="outline"><Eye /></Button>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, onPreview }: { products: PublicationProduct[]; onPreview?: (product: PublicationProduct) => void }) {
  if (products.length === 0) {
    return <div className="border border-dashed border-border py-16 text-center"><BookOpen className="mx-auto size-9 text-muted-foreground" /><h3 className="mt-4 font-display font-bold">No titles found</h3><p className="mt-2 text-sm text-muted-foreground">Try another search or category.</p></div>;
  }
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} onPreview={onPreview} product={product} />)}</div>;
}

export function PreviewDialog({ product, onClose }: { product: PublicationProduct | null; onClose: () => void }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => setFlipped(false), [product]);
  return (
    <Dialog onOpenChange={(open) => { if (!open) onClose(); }} open={product !== null}>
      <DialogContent className="max-h-[88dvh] max-w-2xl overflow-y-auto sm:max-w-2xl">
        {product && (
          <>
            <DialogHeader className="pr-6"><span className="text-xs font-bold uppercase text-forest">A closer look · {product.category === "games" ? "EyeCue" : "Drumil Editions"}</span><DialogTitle className="font-display text-xl">{product.title}</DialogTitle><DialogDescription>{product.tagline}</DialogDescription></DialogHeader>
            <div className="grid gap-5 py-2 sm:grid-cols-[0.72fr_1.28fr]">
              <div className="w-full max-w-[12rem]"><ProductCover product={product} /></div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold uppercase text-muted-foreground">Inside this edition</h3>
                {product.chapters?.length ? <ul className="mt-3 space-y-3">{product.chapters.map((chapter) => <li key={chapter.title} className="border-l-2 border-saffron pl-3"><h4 className="text-sm font-bold">{chapter.title}</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">{chapter.excerpt}</p></li>)}</ul> : <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">{product.features.map((feature) => <li className="flex items-start gap-2" key={feature}><Check className="mt-1 size-3.5 shrink-0 text-forest" />{feature}</li>)}</ul>}
                {product.category === "games" && <button aria-label="Flip sample game card" className="mt-4 flex h-16 w-full items-center justify-center border border-dashed border-forest/40 bg-secondary/60 text-xs font-bold transition-colors hover:bg-secondary" onClick={() => setFlipped((value) => !value)}>{flipped ? "A match is hiding in plain sight · tap to flip" : "Tap to flip a sample card"}<Sparkles className="ml-2 size-4 text-forest" /></button>}
                <Button asChild className="mt-4"><Link params={{ slug: product.slug }} to="/product/$slug">Explore this title <ArrowRight /></Link></Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function PageIntro({ eyebrow, title, description, accent = false }: { eyebrow: string; title: string; description: string; accent?: boolean }) {
  return (
    <section className={`border-b border-border ${accent ? "bg-secondary/50" : "bg-muted/35"}`}>
      <div className="page-wrap py-12 sm:py-16">
        <p className="text-xs font-extrabold uppercase text-forest">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-[1.08] sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, link, to }: { eyebrow: string; title: string; link?: string; to?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
      <div><p className="text-[0.67rem] font-extrabold uppercase text-forest">{eyebrow}</p><h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">{title}</h2></div>
      {link && to && <Button asChild variant="ghost" size="sm"><Link to={to}>{link} <ArrowRight /></Link></Button>}
    </div>
  );
}

export function CurrencyNote({ amount }: { amount: number }) {
  return <span className="inline-flex items-center"><IndianRupee className="size-3.5" />{amount.toLocaleString("en-IN")}</span>;
}