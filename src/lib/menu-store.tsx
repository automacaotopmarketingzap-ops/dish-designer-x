import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./menu-data";

export type CartItem = {
  key: string;
  product: Product;
  quantity: number;
  modifiers: { groupId: string; optionId: string; label: string; priceDelta: number }[];
  notes?: string;
  unitPrice: number;
};

type Ctx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, q: number) => void;
  clear: () => void;
  total: number;
  count: number;
  hasPizza: boolean;
  has2LSoda: boolean;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<Ctx>(() => {
    const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const hasPizza = items.some((i) => i.product.category === "pizza");
    const has2LSoda = items.some((i) => i.product.id === "coca-2l" || i.product.id === "guarana-2l");
    return {
      items,
      total,
      count,
      hasPizza,
      has2LSoda,
      addItem: (item) => {
        const key = `${item.product.id}-${item.modifiers.map((m) => m.optionId).join("-")}-${Date.now()}`;
        setItems((prev) => [...prev, { ...item, key }]);
      },
      removeItem: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
      updateQuantity: (key, q) =>
        setItems((prev) =>
          q <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, quantity: q } : i)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}