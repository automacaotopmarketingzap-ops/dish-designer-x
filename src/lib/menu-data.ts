export type ProductTag = "mais_pedido" | "novo" | "promo";

export type ModifierGroup = {
  id: string;
  title: string;
  required: boolean;
  options: { id: string; label: string; priceDelta?: number }[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: ProductTag[];
  pairsWith?: string[];
  modifiers?: ModifierGroup[];
};

export const CATEGORIES = [
  { id: "rodizio", label: "Rodízio" },
  { id: "a-la-carte", label: "À la carte" },
  { id: "pizza", label: "Pizzas" },
  { id: "lanche", label: "Lanches" },
  { id: "japonesa", label: "Japonesa" },
  { id: "porcao", label: "Porções" },
  { id: "bebida", label: "Bebidas" },
  { id: "sobremesa", label: "Sobremesas" },
] as const;

const PONTO: ModifierGroup = {
  id: "ponto",
  title: "Ponto da carne",
  required: true,
  options: [
    { id: "mal", label: "Mal passada" },
    { id: "ao-ponto", label: "Ao ponto" },
    { id: "bem", label: "Bem passada" },
  ],
};

const BORDA: ModifierGroup = {
  id: "borda",
  title: "Borda recheada (opcional)",
  required: false,
  options: [
    { id: "sem", label: "Sem borda" },
    { id: "catupiry", label: "Catupiry", priceDelta: 8 },
    { id: "cheddar", label: "Cheddar", priceDelta: 8 },
    { id: "chocolate", label: "Chocolate", priceDelta: 10 },
  ],
};

const TAMANHO_PIZZA: ModifierGroup = {
  id: "tamanho",
  title: "Tamanho",
  required: true,
  options: [
    { id: "media", label: "Média (6 fatias)" },
    { id: "grande", label: "Grande (8 fatias)", priceDelta: 12 },
    { id: "familia", label: "Família (12 fatias)", priceDelta: 22 },
  ],
};

export const PRODUCTS: Product[] = [
  {
    id: "rodizio-adulto",
    name: "Rodízio de Carnes — Adulto",
    description: "Buffet de saladas + cortes nobres na brasa à vontade (picanha, fraldinha, maminha, linguiça e mais). Toda quinta e domingo às 11h30 e 18h.",
    price: 48.9,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&h=700&fit=crop&q=80",
    category: "rodizio",
    tags: ["mais_pedido"],
    pairsWith: ["coca-2l", "heineken"],
  },
  {
    id: "rodizio-infantil",
    name: "Rodízio de Carnes — Infantil",
    description: "Para crianças até 10 anos. Buffet de saladas + carnes na brasa. Toda quinta e domingo.",
    price: 29.9,
    image: "https://images.unsplash.com/photo-1544025162-d76538b0fee8?w=900&h=700&fit=crop&q=80",
    category: "rodizio",
    tags: ["novo"],
    pairsWith: ["guarana-2l"],
  },
  {
    id: "bife-ancho",
    name: "Bife Ancho Grelhado",
    description: "Bife ancho na brasa com purê de mandioca e cebola caramelizada.",
    price: 54.9,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=900&h=700&fit=crop&q=80",
    category: "a-la-carte",
    tags: ["mais_pedido"],
    modifiers: [PONTO],
    pairsWith: ["coca-2l", "vinho-tinto"],
  },
  {
    id: "picanha-mineira",
    name: "Picanha Mineira",
    description: "Arroz com alho, feijão tropeiro, salada e palmito.",
    price: 55.9,
    image: "https://images.unsplash.com/photo-1594221708779-94842823def1?w=900&h=700&fit=crop&q=80",
    category: "a-la-carte",
    tags: ["mais_pedido"],
    modifiers: [PONTO],
    pairsWith: ["coca-2l", "heineken"],
  },
  {
    id: "file-parmegiana",
    name: "Filé à Parmegiana",
    description: "Arroz branco, batata palito e salada de alface e tomate.",
    price: 55.9,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=900&h=700&fit=crop&q=80",
    category: "a-la-carte",
    pairsWith: ["coca-2l"],
  },
  {
    id: "file-salmao",
    name: "Filé de Salmão Grelhado",
    description: "Arroz com brócolis, molho de alcaparras e champignon.",
    price: 70.9,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&h=700&fit=crop&q=80",
    category: "a-la-carte",
    pairsWith: ["vinho-branco"],
  },
  {
    id: "matrincha",
    name: "Matrinchã Assada",
    description: "Arroz com alho, farofa, pirão e vinagrete.",
    price: 59.9,
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&h=700&fit=crop&q=80",
    category: "a-la-carte",
    pairsWith: ["guarana-2l"],
  },
  {
    id: "pizza-calabresa",
    name: "Pizza Calabresa Artesanal",
    description: "Calabresa defumada, cebola roxa, mussarela e azeitona preta.",
    price: 49.9,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=900&h=700&fit=crop&q=80",
    category: "pizza",
    tags: ["mais_pedido"],
    modifiers: [TAMANHO_PIZZA, BORDA],
    pairsWith: ["coca-2l", "guarana-2l"],
  },
  {
    id: "pizza-margherita",
    name: "Pizza Margherita",
    description: "Molho de tomate San Marzano, mussarela de búfala e manjericão fresco.",
    price: 52.9,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=900&h=700&fit=crop&q=80",
    category: "pizza",
    modifiers: [TAMANHO_PIZZA, BORDA],
    pairsWith: ["coca-2l"],
  },
  {
    id: "pizza-portuguesa",
    name: "Pizza Portuguesa",
    description: "Presunto, ovos, cebola, ervilha, azeitona e mussarela.",
    price: 54.9,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900&h=700&fit=crop&q=80",
    category: "pizza",
    modifiers: [TAMANHO_PIZZA, BORDA],
    pairsWith: ["guarana-2l"],
  },
  {
    id: "burger-bela",
    name: "Burger Bela Vista",
    description: "180g de blend bovino, cheddar, bacon, cebola caramelizada e pão brioche.",
    price: 39.9,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&h=700&fit=crop&q=80",
    category: "lanche",
    tags: ["mais_pedido"],
    pairsWith: ["coca-2l"],
  },
  {
    id: "temaki-salmao",
    name: "Temaki de Salmão",
    description: "Salmão fresco, cream cheese e cebolinha em alga nori crocante.",
    price: 32.9,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&h=700&fit=crop&q=80",
    category: "japonesa",
    pairsWith: ["sake"],
  },
  {
    id: "uramaki-philadelphia",
    name: "Uramaki Philadelphia (10pc)",
    description: "Salmão, cream cheese, cebolinha — finalizado com gergelim.",
    price: 42.9,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=900&h=700&fit=crop&q=80",
    category: "japonesa",
    tags: ["promo"],
    pairsWith: ["sake"],
  },
  {
    id: "porcao-fritas",
    name: "Porção de Fritas Crocantes",
    description: "Batata rústica frita na hora com flor de sal e alecrim.",
    price: 28.9,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&h=700&fit=crop&q=80",
    category: "porcao",
    pairsWith: ["heineken"],
  },
  {
    id: "coca-2l",
    name: "Coca-Cola 2L",
    description: "Refrigerante gelado, ideal para a família.",
    price: 15.9,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=900&h=700&fit=crop&q=80",
    category: "bebida",
  },
  {
    id: "guarana-2l",
    name: "Guaraná Antarctica 2L",
    description: "Refrigerante guaraná 2 litros gelado.",
    price: 13.9,
    image: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=900&h=700&fit=crop&q=80",
    category: "bebida",
  },
  {
    id: "heineken",
    name: "Heineken Long Neck",
    description: "Cerveja Heineken 330ml gelada.",
    price: 12.0,
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=900&h=700&fit=crop&q=80",
    category: "bebida",
  },
  {
    id: "vinho-tinto",
    name: "Vinho Tinto Reservado",
    description: "Vinho tinto seco, harmoniza com carnes vermelhas.",
    price: 89.0,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&h=700&fit=crop&q=80",
    category: "bebida",
  },
  {
    id: "vinho-branco",
    name: "Vinho Branco Sauvignon",
    description: "Vinho branco seco, harmoniza com peixes.",
    price: 79.0,
    image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=900&h=700&fit=crop&q=80",
    category: "bebida",
  },
  {
    id: "sake",
    name: "Saquê Quentinho",
    description: "Saquê tradicional servido quente.",
    price: 14.0,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&h=700&fit=crop&q=80",
    category: "bebida",
  },
  {
    id: "petit-gateau",
    name: "Petit Gateau",
    description: "Bolo quente de chocolate com sorvete de creme.",
    price: 19.9,
    image: "https://images.unsplash.com/photo-1623246123320-0d6636755796?w=900&h=700&fit=crop&q=80",
    category: "sobremesa",
    tags: ["mais_pedido"],
  },
  {
    id: "pudim",
    name: "Pudim da Casa",
    description: "Pudim de leite condensado com calda de caramelo.",
    price: 14.9,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&h=700&fit=crop&q=80",
    category: "sobremesa",
  },
];

export const RESTAURANT = {
  name: "Restaurante Bela Vista",
  city: "Juara — MT",
  minOrder: 25,
  deliveryEta: "~40 min",
  whatsapp: "5566XXXXXXXX", // ← coloque o número real aqui (formato: 5566999999999)
  hours: "11h–14h e 18h–22h",
  rodizioDays: [4, 0], // Qui=4, Dom=0
};