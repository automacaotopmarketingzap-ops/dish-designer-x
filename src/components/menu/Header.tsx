import { Clock, MapPin, Bike } from "lucide-react";
import { RESTAURANT } from "@/lib/menu-data";

function isOpen(): boolean {
  const now = new Date();
  const h = now.getHours();
  return h >= 11 && h < 23;
}

function isRodizioDay(): boolean {
  const d = new Date().getDay();
  return RESTAURANT.rodizioDays.includes(d);
}

export function MenuHeader() {
  const open = isOpen();
  const rodizio = isRodizioDay();

  return (
    <header className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface to-background">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, oklch(0.7 0.17 45 / 0.35), transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-5 px-5 pt-8 pb-6 md:pt-12">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-full bg-ember text-ember-foreground font-display text-xl font-semibold shadow-[0_8px_30px_-10px_oklch(0.7_0.17_45/0.6)]">
              BV
            </div>
            <div>
              <h1 className="font-display text-xl leading-tight md:text-2xl">
                {RESTAURANT.name}
              </h1>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {RESTAURANT.city} · Delivery & Retirada
              </p>
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              open
                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                : "bg-destructive/15 text-destructive ring-1 ring-destructive/30"
            }`}
          >
            <span className={`size-1.5 rounded-full ${open ? "bg-emerald-400" : "bg-destructive"}`} />
            {open ? "Aberto agora" : "Fechado"}
          </span>
        </div>

        <div className="space-y-1">
          <p className="font-display text-3xl leading-[1.05] md:text-5xl">
            Comida boa, <span className="italic text-ember-glow">do jeito daqui.</span>
          </p>
          <p className="text-sm text-muted-foreground md:text-base">
            Pizzas na pedra, carnes na brasa e japonesa fresca — entregue rápido em Juara.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Chip icon={<Clock className="size-3.5" />} label={`11h–23h`} />
          <Chip icon={<Bike className="size-3.5" />} label={RESTAURANT.deliveryEta} />
          <Chip label={`Pedido mín. R$ ${RESTAURANT.minOrder}`} />
          {rodizio && (
            <span className="flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 font-medium text-gold ring-1 ring-gold/40">
              🔥 Hoje tem Rodízio — 11h30 e 18h
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

function Chip({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-muted-foreground ring-1 ring-border">
      {icon}
      {label}
    </span>
  );
}