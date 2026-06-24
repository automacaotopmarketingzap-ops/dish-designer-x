import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/menu-data";

export function CategoryNav() {
  const [active, setActive] = useState<string>(CATEGORIES[0].id);


  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    CATEGORIES.forEach((c) => {
      const el = document.getElementById(`cat-${c.id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(c.id);
        },
        { rootMargin: "-30% 0px -60% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto w-full max-w-5xl">
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2">
          {CATEGORIES.map((c) => {
            const isActive = active === c.id;
            return (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                onClick={() => setActive(c.id)}
                className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-ember text-ember-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}