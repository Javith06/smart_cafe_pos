// ===== GLOBAL CART STORAGE =====

// Structure of cart item
export type CartItem = {
  id: string;
  name: string;
  qty: number;
};

// Global cart (shared across app)
let cart: CartItem[] = [];

/* =========================
   GET CART
========================= */
export const getCart = (): CartItem[] => {
  return cart;
};

/* =========================
   ADD ITEM TO CART
========================= */
export const addToCartGlobal = (item: { id: string; name: string }) => {
  const found = cart.find((p) => p.id === item.id);

  if (found) {
    // increase quantity if already exists
    cart = cart.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
  } else {
    // add new item
    cart.push({ ...item, qty: 1 });
  }
};

/* =========================
   REMOVE ITEM FROM CART
========================= */
export const removeFromCartGlobal = (id: string) => {
  const found = cart.find((p) => p.id === id);
  if (!found) return;

  if (found.qty > 1) {
    cart = cart.map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p));
  } else {
    cart = cart.filter((p) => p.id !== id);
  }
};

/* =========================
   CLEAR CART (optional)
========================= */
export const clearCart = () => {
  cart = [];
};
