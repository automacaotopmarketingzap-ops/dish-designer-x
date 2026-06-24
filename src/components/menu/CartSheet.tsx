import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowLeft } from "lucide-react";
import { findProduct, useCart } from "@/lib/menu-store";
import { RESTAURANT } from "@/lib/menu-data";

type Step = "cart" | "checkout" | "success";

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
        <span className="text-sm font-medium">
          {cart.count} {cart.count === 1 ? "item" : "itens"}
        </span>
      </span>
      <span className="text-sm font-semibold">
        Ver carrinho · R$ {cart.total.toFixed(2).replace(".", ",")}
      </span>
    </button>
  );
}

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [tipo, setTipo] = useState<"entrega" | "retirada">("entrega");
  const [endereco, setEndereco] = useState("");
  const [pag, setPag] = useState<"pix" | "cartao" | "dinheiro">("pix");
  const [obs, setObs] = useState("");

  if (!open) return null;

  const showSodaUpsell = cart.hasPizza && !cart.has2LSoda;

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

  function handleClose() {
    onClose();
    setStep("cart");
    setNome(""); setTel(""); setEndereco(""); setObs("");
  }

  function validateCheckout() {
    if (!nome.trim()) { alert("Informe seu nome."); return false; }
    const digits = tel.replace(/\D/g, "");
    if (digits.length < 11) { alert("WhatsApp inválido — inclua DDD e o 9."); return false; }
    if (tipo === "entrega" && !endereco.trim()) { alert("Informe o endereço de entrega."); return false; }
    return true;
  }

  function sendWhatsApp() {
    if (!validateCheckout()) return;
    const lines = cart.items.map(
      (i) =>
        `• ${i.quantity}x ${i.product.name}` +
        (i.modifiers.length ? ` (${i.modifiers.map((m) => m.label).join(", ")})` : "") +
        ` — R$ ${(i.unitPrice * i.quantity).toFixed(2).replace(".", ",")}` +
        (i.notes ? `\n  Obs: ${i.notes}` : ""),
    );
    const entregaInfo =
      tipo === "entrega"
        ? `\n📍 Endereço: ${endereco}`
        : "\n🏪 Retirada no local";
    const msg = encodeURIComponent(
      `Olá! Gostaria de fazer um pedido:\n\n${lines.join("\n")}\n\nSubtotal: R$ ${cart.total.toFixed(2).replace(".", ",")}\n\n👤 Nome: ${nome}\n📱 WhatsApp: ${tel}${entregaInfo}\n💳 Pagamento: ${pag === "pix" ? "Pix" : pag === "cartao" ? "Cartão" : "Dinheiro"}${obs ? `\n\n📝 Obs: ${obs}` : ""}`,
    );
    window.open(`https://wa.me/${RESTAURANT.whatsapp}?text=${msg}`, "_blank");
    cart.clear();
    setStep("success");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-surface ring-1 ring-border md:rounded-3xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-5 py-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            {step === "checkout" && (
              <button onClick={() => setStep("cart")} className="text-muted-foreground hover:text-foreground mr-1">
                <ArrowLeft className="size-4" />
              </button>
            )}
            <h2 className="font-display text-xl">
              {step === "cart" ? "Seu pedido" : step === "checkout" ? "Seus dados" : "Pedido enviado!"}
            </h2>
          </div>
          <button onClick={handleClose} className="grid size-8 place-items-center rounded-full bg-surface-2" aria-label="Fechar">
            <X className="size-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* STEP: Cart */}
          {step === "cart" && (
            <>
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
                            <button
                              onClick={() => cart.updateQuantity(i.key, i.quantity - 1)}
                              className="grid size-7 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                            >
                              {i.quantity === 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}
                            </button>
                            <span className="w-5 text-center text-sm">{i.quantity}</span>
                            <button
                              onClick={() => cart.updateQuantity(i.key, i.quantity + 1)}
                              className="grid size-7 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                            >
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

              {showSodaUpsell && cart.items.length > 0 && (
                <section className="mt-5">
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Que tal adicionar?</p>
                  <UpsellRow
                    title="Coca-Cola 2L (Combo)"
                    sub="Por R$ 12,90 (de R$ 15,90)"
                    image={findProduct("coca-2l")!.image}
                    onAdd={() => addUpsell("coca-2l", 12.9)}
                  />
                </section>
              )}
            </>
          )}

          {/* STEP: Checkout */}
          {step === "checkout" && (
            <div className="flex flex-col gap-4">
              {/* Tipo */}
              <div>
                <Label>Como quer receber?</Label>
                <div className="mt-1.5 flex gap-2">
                  {(["entrega", "retirada"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTipo(t)}
                      className={`flex-1 rounded-xl py-2.5 text-sm font-medium ring-1 transition-all ${
                        tipo === t
                          ? "bg-ember text-ember-foreground ring-ember"
                          : "bg-surface-2 text-muted-foreground ring-border hover:ring-border"
                      }`}
                    >
                      {t === "entrega" ? "🛵 Entrega" : "🏪 Retirada"}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Seu nome">
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full rounded-xl bg-surface-2 px-4 py-3 text-sm ring-1 ring-border focus:outline-none focus:ring-ember/40"
                />
              </Field>

              <Field label="WhatsApp (com DDD)">
                <input
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="(66) 9 9999-9999"
                  inputMode="tel"
                  className="w-full rounded-xl bg-surface-2 px-4 py-3 text-sm ring-1 ring-border focus:outline-none focus:ring-ember/40"
                />
              </Field>

              {tipo === "entrega" && (
                <Field label="Endereço de entrega">
                  <input
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, número, bairro"
                    className="w-full rounded-xl bg-surface-2 px-4 py-3 text-sm ring-1 ring-border focus:outline-none focus:ring-ember/40"
                  />
                </Field>
              )}

              <div>
                <Label>Pagamento</Label>
                <div className="mt-1.5 flex gap-2 flex-wrap">
                  {(["pix", "cartao", "dinheiro"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPag(p)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium ring-1 transition-all ${
                        pag === p
                          ? "bg-ember text-ember-foreground ring-ember"
                          : "bg-surface-2 text-muted-foreground ring-border"
                      }`}
                    >
                      {p === "pix" ? "Pix" : p === "cartao" ? "Cartão" : "Dinheiro"}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Observações (opcional)">
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Sem cebola, ponto da carne, etc."
                  rows={2}
                  className="w-full resize-none rounded-xl bg-surface-2 px-4 py-3 text-sm ring-1 ring-border focus:outline-none focus:ring-ember/40"
                />
              </Field>
            </div>
          )}

          {/* STEP: Success */}
          {step === "success" && (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-4 grid size-16 place-items-center rounded-full bg-ember/15 text-3xl">
                🎉
              </div>
              <h3 className="font-display text-2xl mb-2">Pedido enviado!</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Seu pedido foi enviado pelo WhatsApp. Em breve entraremos em contato para confirmar.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 flex-shrink-0">
          {step === "cart" && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl">R$ {cart.total.toFixed(2).replace(".", ",")}</span>
              </div>
              <button
                onClick={() => { if (cart.items.length > 0 && cart.total >= RESTAURANT.minOrder) setStep("checkout") }}
                disabled={cart.items.length === 0 || cart.total < RESTAURANT.minOrder}
                className="w-full rounded-full bg-ember px-5 py-3.5 font-medium text-ember-foreground transition-all hover:bg-ember-glow disabled:opacity-40"
              >
                {cart.total < RESTAURANT.minOrder
                  ? `Pedido mínimo R$ ${RESTAURANT.minOrder}`
                  : "Continuar →"}
              </button>
            </>
          )}
          {step === "checkout" && (
            <button
              onClick={sendWhatsApp}
              className="w-full rounded-full bg-ember px-5 py-3.5 font-medium text-ember-foreground transition-all hover:bg-ember-glow"
            >
              Enviar pedido pelo WhatsApp →
            </button>
          )}
          {step === "success" && (
            <button
              onClick={handleClose}
              className="w-full rounded-full bg-ember px-5 py-3.5 font-medium text-ember-foreground"
            >
              Fazer novo pedido
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{children}</p>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      {children}
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
      <button
        onClick={onAdd}
        className="rounded-full bg-ember px-3.5 py-1.5 text-xs font-medium text-ember-foreground hover:bg-ember-glow"
      >
        Adicionar
      </button>
    </div>
  );
}
