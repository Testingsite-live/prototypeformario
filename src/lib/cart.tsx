import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PRODUCTS } from "@/data/site";
import { unitPrice } from "@/lib/shop";

export interface CartItem {
  id: string;
  slug: string;
  category: string;
  name: string;
  size?: string | undefined;
  wood?: string | undefined;
  variant?: string | undefined;
  engraving: string;
  engravingText?: string | undefined;
  notes?: string | undefined;
  qty: number;
}

export function optionLine(i: { wood?: string | undefined; size?: string | undefined; variant?: string | undefined; engraving: string }) {
  return [i.wood, i.size, i.variant, i.engraving].filter(Boolean).join(" · ");
}

const STORAGE_KEY = "kerf-cedar-cart-v1";
export const MAX_QTY = 10;

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (item: Omit<CartItem, "id">) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  priceOf: (item: CartItem) => number;
}

const Ctx = createContext<CartCtx | null>(null);

export function itemKey(i: Omit<CartItem, "id" | "qty">) {
  return [i.category, i.slug, i.size, i.wood, i.variant, i.engraving, i.engravingText, i.notes].join("|");
}

export function linePrice(item: CartItem) {
  const p = PRODUCTS.find((x) => x.slug === item.slug);
  if (!p) return 0;
  return unitPrice(p, item);
}

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((i) => i && typeof i.slug === "string" && PRODUCTS.some((p) => p.slug === i.slug))
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    setItems(readStorage());
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable: cart still works for this visit */
    }
  }, [items]);

  const add = useCallback((item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const id = itemKey(item);
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + item.qty) } : i));
      }
      return [...prev, { ...item, id }];
    });
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : i)));
  }, []);
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + linePrice(i) * i.qty, 0);
    return { items, count, subtotal, ready, add, setQty, remove, clear, priceOf: linePrice };
  }, [items, ready, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
