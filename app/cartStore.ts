<<<<<<< HEAD
=======
export type CartItem = {
  id: string;
  name: string;
  price?: number; // ✅ allow price
  qty: number;

  // optional customizations
  spicy?: string;
  oil?: string;
  salt?: string;
  sugar?: string;
  note?: string;
};

let cart: CartItem[] = [];

export const getCart = (): CartItem[] => cart;

/* ADD ITEM */
export const addToCartGlobal = (item: Omit<CartItem, "qty">) => {
  const existing = cart.find(
    (p) =>
      p.id === item.id &&
      p.spicy === item.spicy &&
      p.oil === item.oil &&
      p.salt === item.salt &&
      p.sugar === item.sugar &&
      p.note === item.note,
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
};

/* REMOVE ITEM */
export const removeFromCartGlobal = (id: string) => {
  const item = cart.find((p) => p.id === id);
  if (!item) return;

  if (item.qty > 1) item.qty -= 1;
  else cart = cart.filter((p) => p !== item);
};

/* CLEAR CART */
export const clearCart = () => {
  cart = [];
};
>>>>>>> 58564608e3bf46287c25b31e881dcf18d507289e
