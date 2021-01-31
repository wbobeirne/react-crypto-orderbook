/** Tuple of [price, quantity] */
export type OrderBookOrderTuple = [number, number];

/** Cleaned up order object */
export interface OrderBookOrder {
  price: number;
  quantity: number;
}

// interface OrderBookSnapshot {
//   feed: string;
//   product_id: string;
//   seq: number;
//   bids: OBOrderTuple[];
//   asks: OBOrderTuple[];
// }

// interface OrderBookDelta {
//   feed: string;
//   product_id: string;
//   side: "buy" | "sell";
//   seq: number;
//   price: number;
//   qty: number;
// }

export interface OrderBookUpdate {
  feed: string;
  product_id: string;
  bids: OrderBookOrderTuple[];
  asks: OrderBookOrderTuple[];
}

export interface OrderBook {
  bids: OrderBookOrder[];
  asks: OrderBookOrder[];
}

