import {
  OrderBookOrderTuple,
  OrderBookOrder,
  OrderBookUpdate,
  OrderBook,
} from "../types/orders";

export function orderTupleToObject(o: OrderBookOrderTuple): OrderBookOrder {
  return {
    price: o[0],
    quantity: o[1],
  };
}

/**
 * Non-mutative operation to add orders from an incoming update to an order book.
 */
export function addOrderUpdateToBook(
  book: OrderBook,
  update: OrderBookUpdate
): OrderBook {
  const newBook = { ...book };

  // Identical operations on asks and bids
  (["asks", "bids"] as const).forEach((orderType) => {
    newBook[orderType] = [
      ...update[orderType].map(orderTupleToObject),
      ...newBook[orderType],
    ].filter((order, index, arr) => {
      // Remove entries with no quanity
      if (!order.quantity) {
        return false;
      }

      // De-duplicate order entries with identical prices. The earlier in the
      // array, the more recent.
      return index === arr.findIndex((o) => o.price === order.price);
    });
  });

  return newBook;
}

/**
 * Non-mutative operation to lump order book prices into groups
 */
export function groupOrderBookPrices(book: OrderBook, groupSize: number): OrderBook {
  const groupedBook: OrderBook = { asks: [], bids: [] };

  (["asks", "bids"] as const).forEach((orderType) => {
    // Group into a dict of price -> quantity
    const priceGroups = book[orderType].reduce((prev, o) => {
      // Round up for asks, down for bids
      const groupedPrice = o.price - (o.price % groupSize) + (orderType === "asks" ? groupSize : 0);
      if (prev[groupedPrice] === undefined) {
        prev[groupedPrice] = 0;
      }
      prev[groupedPrice] += o.quantity;
      return prev;
    }, {} as Record<string, number>)

    // Convert back into an array
    groupedBook[orderType] = Object.entries(priceGroups).map(([price, quantity]) => ({
      price: parseFloat(price),
      quantity,
    }));
  });

  return groupedBook;
}
