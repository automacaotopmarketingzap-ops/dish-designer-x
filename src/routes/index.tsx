import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { MenuHeader } from "@/components/menu/Header";
import { FeaturedRail } from "@/components/menu/FeaturedRail";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { ProductGrid } from "@/components/menu/ProductGrid";
import { ProductSheet } from "@/components/menu/ProductSheet";
import { CartBar, CartSheet } from "@/components/menu/CartSheet";
import { CartProvider } from "@/lib/menu-store";
import type { Product } from "@/lib/menu-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Restaurante Bela Vista — Cardápio Digital" },
      { name: "description", content: "Cardápio digital do Restaurante Bela Vista — Juara/MT. Peça pizza, rodízio, japonesa e lanches com entrega rápida." },
      { property: "og:title", content: "Restaurante Bela Vista — Cardápio Digital" },
      { property: "og:description", content: "Peça pelo cardápio: pizzas, rodízio Qui & Dom, japonesa fresca, lanches e bebidas." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <Menu />
    </CartProvider>
  );
}

function Menu() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <MenuHeader />
      <FeaturedRail onSelect={setSelected} />

      <div className="mx-auto w-full max-w-5xl px-5 pb-3">
        <label className="flex items-center gap-2 rounded-full bg-surface px-4 py-3 ring-1 ring-border focus-within:ring-ember/40">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar prato, pizza, bebida…"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none"
          />
        </label>
      </div>

      <CategoryNav />
      <ProductGrid onSelect={setSelected} query={query} />

      <ProductSheet product={selected} onClose={() => setSelected(null)} />
      <CartBar onOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
