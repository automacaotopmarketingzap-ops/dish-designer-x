import { Plus } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/menu-data";

const TAG_STYLES: Record<string, string> = {
  mais_pedido: "bg-ember/15 text-ember-glow ring-ember/30",
  novo: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  promo: "bg-gold/15 text-gold ring-gold/40",
};

const TAG_LABEL: Record<string, string> = {
  mais_pedido: "Mais pedido",
  novo: "Novo",
  promo: "Promo",
};

export function ProductGrid({ onSelect, query }: { onSelect: (p: Product) => void; query: string }) {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    : PRODUCTS;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-32">
      {CATEGORIES.filter((c) => c.id !== "destaques").map((cat) => {
        const items = filtered.filter((p) => p.category === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-16 pt-8">
            <div className="mb-3 flex items-baseline justify-between px-2">
              <h2 className="font-display text-2xl">{cat.label}</h2>
              <span className="text-xs text-muted-foreground">{items.length} itens</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="group relative flex gap-3 overflow-hidden rounded-2xl bg-surface p-3 text-left ring-1 ring-border transition-all hover:ring-ember/40 hover:shadow-[0_12px_30px_-15px_oklch(0.7_0.17_45/0.35)]"
                >
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="mb-1 flex flex-wrap items-center gap-1">
                      {p.tags?.map((t) => (
                        <span
                          key={t}
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ${TAG_STYLES[t]}`}
                        >
                          {TAG_LABEL[t]}
                        </span>
                      ))}
                    </div>
                    <p className="font-display text-base leading-tight">{p.name}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {p.description}
                    </p>
                    <p className="mt-auto pt-2 text-base font-semibold text-ember-glow">
                      R$ {p.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-ember text-ember-foreground shadow-[0_6px_20px_-6px_oklch(0.7_0.17_45/0.6)] transition-transform group-hover:scale-110">
                    <Plus className="size-4" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
      {filtered.length === 0 && (
        <div className="grid place-items-center px-6 py-20 text-center">
          <p className="font-display text-lg">Nada encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente: pizza, picanha, sushi, fritas…
          </p>
        </div>
      )}
    </div>
  );
}