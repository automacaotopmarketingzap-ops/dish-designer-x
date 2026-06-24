import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { findProduct, useCart } from "@/lib/menu-store";
import { RESTAURANT } from "@/lib/menu-data";

export function CartBar({ onOpen }: { onOpen: () => void }) {
  const cart = useCart();
  if (cart.count === 0) return null;
  return (
    <button
      onClick={onOpen}
      className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-full bg-ember px-5 py-3.5 text-ember-foreground shadow-[0_20px_50px_-15px_oklch(0.7_0.17_45/0.7)] ring-1 ring-ember-glow/40 transition-transform hover:scale-[1.02] animate-fade-in"
    >
      <span className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-ember-foreground/15">
          <ShoppingBag className="size-4" />
        </span>
        <span className="text-sm font-medium">{cart.count} {cart.count === 1 ? "item" : "itens"}</span>
      </span>
      <span className="text-sm font-semibold">
        Ver carrinho · R$ {cart.total.toFixed(2).replace(".", ",")}
      </span>
    </button>
  );
}

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  if (!open) return null;

  const showSodaUpsell = cart.hasPizza && !cart.has2LSoda;
  const showDessertUpsell = cart.count > 0 && !cart.items.some((i) => i.product.category === "sobremesa");

  function addUpsell(id: string, price?: number) {
    const p = findProduct(id);
    if (!p) return;
    const finalPrice = price ?? p.price;
    cart.addItem({
      product: price ? { ...p, price: finalPrice, name: `${p.name} (Combo)` } : p,
      quantity: 1,
      modifiers: [],
      unitPrice: finalPrice,
    });
  }

  function checkout() {
    const lines = cart.items.map(
      (i) =>
        `• ${i.quantity}x ${i.product.name}` +
        (i.modifiers.length ? ` (${i.modifiers.map((m) => m.label).join(", ")})` : "") +
        ` — R$ ${(i.unitPrice * i.quantity).toFixed(2).replace(".", ",")}` +
        (i.notes ? `\n  obs: ${i.notes}` : ""),
    );
    const msg = encodeURIComponent(
      `Olá! Gostaria de fazer um pedido:\n\n${lines.join("\n")}\n\nTotal: R$ ${cart.total
        .toFixed(2)
        .replace(".", ",")}`,
    );
    window.open(`https://wa.me/${RESTAURANT.whatsapp}?text=${msg}`, "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center animate-fade-in" onClick={onClose}>
      <div
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-surface ring-1 ring-border md:rounded-3xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-xl">Seu pedido</h2>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-full bg-surface-2" aria-label="Fechar">
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Seu carrinho está vazio.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {cart.items.map((i) => (
                <li key={i.key} className="flex gap-3 rounded-2xl bg-surface-2 p-3 ring-1 ring-border">
                  <img src={i.product.image} alt={i.product.name} className="size-16 shrink-0 rounded-xl object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-medium leading-tight">{i.product.name}</p>
                    {i.modifiers.length > 0 && (
                      <p className="text-xs text-muted-foreground">{i.modifiers.map((m) => m.label).join(" · ")}</p>
                    )}
                    {i.notes && <p className="text-xs italic text-muted-foreground">"{i.notes}"</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full bg-background p-0.5 ring-1 ring-border">
                        <button onClick={() => cart.updateQuantity(i.key, i.quantity - 1)} className="grid size-7 place-items-center rounded-full text-muted-foreground hover:text-foreground" aria-label="Diminuir">
                          {i.quantity === 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}
                        </button>
                        <span className="w-5 text-center text-sm">{i.quantity}</span>
                        <button onClick={() => cart.updateQuantity(i.key, i.quantity + 1)} className="grid size-7 place-items-center rounded-full text-muted-foreground hover:text-foreground" aria-label="Aumentar">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-ember-glow">
                        R$ {(i.unitPrice * i.quantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {(showSodaUpsell || showDessertUpsell) && cart.items.length > 0 && (
            <section className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Que tal adicionar?</p>
              <div className="flex flex-col gap-2">
                {showSodaUpsell && (
                  <UpsellRow
                    title="Coca-Cola 2L (Combo)"
                    sub="Por R$ 12,90 (de R$ 15,90)"
                    image={findProduct("coca-2l")!.image}
                    onAdd={() => addUpsell("coca-2l", 12.9)}
                  />
                )}
                {showDessertUpsell && (
                  <UpsellRow
                    title="Petit Gateau"
                    sub="Bolo quente com sorvete · R$ 19,90"
                    image={findProduct("petit-gateau")!.image}
                    onAdd={() => addUpsell("petit-gateau")}
                  />
                )}
              </div>
            </section>
          )}
        </div>

        <footer className="border-t border-border bg-surface px-5 pb-5 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl">R$ {cart.total.toFixed(2).replace(".", ",")}</span>
          </div>
          <button
            onClick={checkout}
            disabled={cart.items.length === 0 || cart.total < RESTAURANT.minOrder}
            className="w-full rounded-full bg-ember px-5 py-3.5 font-medium text-ember-foreground transition-all hover:bg-ember-glow disabled:opacity-40"
          >
            {cart.total < RESTAURANT.minOrder
              ? `Pedido mínimo R$ ${RESTAURANT.minOrder}`
              : "Enviar pedido pelo WhatsApp"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function UpsellRow({ title, sub, image, onAdd }: { title: string; sub: string; image: string; onAdd: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-gold/10 to-transparent p-3 ring-1 ring-gold/25">
      <img src={image} alt="" className="size-12 rounded-xl object-cover" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <button onClick={onAdd} className="rounded-full bg-ember px-3.5 py-1.5 text-xs font-medium text-ember-foreground hover:bg-ember-glow">
        Adicionar
      </button>
    </div>
  );
}