export type OrderContext = {
  orderType: "DINE_IN" | "TAKEAWAY";
  section?: string;
  tableNo?: string;
  takeawayNo?: string;
};

let currentOrder: OrderContext | null = null;

export const setOrderContext = (data: OrderContext) => {
  currentOrder = data;
};

export const getOrderContext = () => currentOrder;

export const clearOrderContext = () => {
  currentOrder = null;
};
