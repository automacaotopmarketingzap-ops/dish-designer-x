import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { findProduct, useCart } from "@/lib/menu-store";
import type { Product } from "@/lib/menu-data";

export function ProductSheet({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [addCombo, setAddCombo] = useState(false);

  useEffect(() => {
    if (product) {
      setQty(1);
      setNotes("");
      const init: Record<string, string> = {};
      product.modifiers?.forEach((g) => {
        if (g.required) init[g.id] = g.options[0].id;
      });
      setSelections(init);
      setAddCombo(false);
    }
  }, [product]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    let p = product.price;
    product.modifiers?.forEach((g) => {
      const sel = selections[g.id];
      const opt = g.options.find((o) => o.id === sel);
      if (opt?.priceDelta) p += opt.priceDelta;
    });
    return p;
  }, [product, selections]);

  if (!product) return null;

  const showSodaCombo = product.category === "pizza" && !cart.has2LSoda;
  const comboPrice = 12.9;
  const total = unitPrice * qty + (showSodaCombo && addCombo ? comboPrice : 0);

  const pairs = product.pairsWith
    ?.map(findProduct)
    .filter((p): p is Product => Boolean(p))
    .slice(0, 3);

  const canAdd = !product.modifiers?.some((g) => g.required && !selections[g.id]);

  function handleAdd() {
    if (!canAdd || !product) return;
    const mods =
      product.modifiers?.map((g) => {
        const opt = g.options.find((o) => o.id === selections[g.id])!;
        return {
          groupId: g.id,
          optionId: opt.id,
          label: `${g.title}: ${opt.label}`,
          priceDelta: opt.priceDelta ?? 0,
        };
      }) ?? [];
    cart.addItem({ product, quantity: qty, modifiers: mods, notes, unitPrice });
    if (showSodaCombo && addCombo) {
      const coke = findProduct("coca-2l");
      if (coke) {
        cart.addItem({
          product: { ...coke, price: comboPrice, name: `${coke.name} (Combo)` },
          quantity: 1,
          modifiers: [],
          unitPrice: comboPrice,
        });
      }
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-surface ring-1 ring-border md:rounded-3xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background"
          aria-label="Fechar"
        >
          <X className="size-4" />
        </button>

        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img src={product.image} alt={product.name} className="size-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-2">
          <h2 className="font-display text-2xl leading-tight">{product.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>

          {product.modifiers?.map((g) => (
            <section key={g.id} className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">{g.title}</p>
                {g.required && (
                  <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[10px] font-medium uppercase text-ember-glow ring-1 ring-ember/30">
                    Obrigatório
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {g.options.map((o) => {
                  const checked = selections[g.id] === o.id;
                  return (
                    <label
                      key={o.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 ring-1 transition-all ${
                        checked
                          ? "bg-ember/10 ring-ember/40"
                          : "bg-surface-2 ring-border hover:ring-ember/20"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`grid size-5 place-items-center rounded-full ring-1 ${
                            checked ? "bg-ember ring-ember" : "bg-transparent ring-border"
                          }`}
                        >
                          {checked && <span className="size-2 rounded-full bg-ember-foreground" />}
                        </span>
                        <span className="text-sm">{o.label}</span>
                      </span>
                      {o.priceDelta ? (
                        <span className="text-xs font-medium text-muted-foreground">
                          + R$ {o.priceDelta.toFixed(2).replace(".", ",")}
                        </span>
                      ) : null}
                      <input
                        type="radio"
                        name={g.id}
                        className="sr-only"
                        checked={checked}
                        onChange={() => setSelections((s) => ({ ...s, [g.id]: o.id }))}
                      />
                    </label>
                  );
                })}
              </div>
            </section>
          ))}

          {showSodaCombo && (
            <section className="mt-5">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-gradient-to-br from-gold/10 to-ember/5 p-4 ring-1 ring-gold/30">
                <input
                  type="checkbox"
                  checked={addCombo}
                  onChange={(e) => setAddCombo(e.target.checked)}
                  className="mt-0.5 size-5 accent-ember"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gold">Combo Família 🥤</p>
                  <p className="text-xs text-muted-foreground">
                    Adicione Coca-Cola 2L por <strong className="text-foreground">R$ 12,90</strong>{" "}
                    <s className="text-muted-foreground/70">R$ 15,90</s>
                  </p>
                </div>
              </label>
            </section>
          )}

          {pairs && pairs.length > 0 && (
            <section className="mt-5">
              <p className="mb-2 text-sm font-medium">Vai bem com</p>
              <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
                {pairs.map((pp) => (
                  <div
                    key={pp.id}
                    className="flex w-[130px] shrink-0 flex-col overflow-hidden rounded-xl bg-surface-2 ring-1 ring-border"
                  >
                    <img src={pp.image} alt={pp.name} className="aspect-square w-full object-cover" />
                    <div className="p-2">
                      <p className="line-clamp-1 text-xs font-medium">{pp.name}</p>
                      <p className="text-xs text-ember-glow">
                        R$ {pp.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-5">
            <label className="mb-2 block text-sm font-medium">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex.: sem cebola, ponto da carne diferente…"
              rows={2}
              className="w-full resize-none rounded-xl bg-surface-2 px-3 py-2 text-sm placeholder:text-muted-foreground/60 ring-1 ring-border focus:outline-none focus:ring-ember/40"
            />
          </section>
        </div>

        <div className="flex items-center gap-3 border-t border-border bg-surface px-5 py-3">
          <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1 ring-1 ring-border">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-8 place-items-center rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Diminuir"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-6 text-center text-sm font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid size-8 place-items-center rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Aumentar"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="flex flex-1 items-center justify-between gap-3 rounded-full bg-ember px-5 py-3 font-medium text-ember-foreground transition-all hover:bg-ember-glow disabled:opacity-40"
          >
            <span>Adicionar</span>
            <span>R$ {total.toFixed(2).replace(".", ",")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}