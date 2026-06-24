import { PRODUCTS, type Product } from "@/lib/menu-data";

export function FeaturedRail({ onSelect }: { onSelect: (p: Product) => void }) {
  const featured = PRODUCTS.filter((p) => p.tags?.includes("mais_pedido")).slice(0, 6);

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-lg">Mais pedidos da casa</h2>
        <span className="text-xs text-muted-foreground">Toque para pedir</span>
      </div>
      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
        {featured.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="group flex w-[240px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-border transition-all hover:ring-ember/40 hover:shadow-[0_20px_40px_-20px_oklch(0.7_0.17_45/0.4)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-2 top-2 rounded-full bg-ember px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ember-foreground">
                Top
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3 text-left">
              <p className="font-display text-sm leading-tight">{p.name}</p>
              <p className="mt-auto text-base font-semibold text-ember-glow">
                R$ {p.price.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}