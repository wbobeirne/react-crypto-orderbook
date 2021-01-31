import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OrderBook, OrderBookUpdate } from "../types/orders";
import { addOrderUpdateToBook, groupOrderBookPrices } from "../util/orders";

interface OrderBookState {
  isConnecting: boolean;
  isConnected: boolean;
  orderBook: OrderBook;
  product: string;
  groupSize: number;
  reconnect(): void;
  setProduct(product: string): void;
  setGroupSize(groupSize: number): void;
}

const OrderBookContext = createContext<OrderBookState | undefined>(undefined);

/**
 * Convenience hook that ensures the context has been set.
 */
export const useOrderBookContext = () => {
  const val = useContext(OrderBookContext);
  if (!val) {
    throw new Error(
      `Context provider not found, make sure you include <OrderBookContext> above this component!`
    );
  }
  return val;
};

export const OrderBookProvider: React.FC = ({ children }) => {
  const ws = useRef<WebSocket | undefined>();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [product, setProduct] = useState("PI_XBTUSD");
  const [orderBook, setOrderBook] = useState<OrderBookState["orderBook"]>({ asks: [], bids: [] });
  const [groupedOrderBook, setGroupedOrderBook] = useState<OrderBookState["orderBook"]>(orderBook);
  const [groupSize, setGroupSize] = useState(2.5);
  const [connectionTries, setConnectionTries] = useState(0);

  const send = useCallback(
    (data: Record<string, string | number | string[]>) => {
      if (!ws.current) return;
      if (ws.current.readyState !== ws.current.OPEN) return;
      ws.current.send(JSON.stringify(data));
    },
    []
  );

  // Connect to the websocket, and clean up when we're done
  useEffect(() => {
    ws.current = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    setIsConnecting(true);

    ws.current.addEventListener("open", () => {
      setIsConnected(true);
      setIsConnecting(false);
    });

    ws.current.addEventListener("close", () => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    return () => {
      ws.current?.close();
    };
  }, [connectionTries]);

  // Incrementing connectionTries triggers websocket reconnect
  const reconnect = useCallback(() => {
    setConnectionTries(t => t + 1);
  }, [])

  // Send subscribe whenever we connect or change our subscribed products
  useEffect(() => {
    if (!isConnected || !ws.current) {
      return;
    }

    // Dump the old order book
    setOrderBook({ asks: [], bids: [] });

    // Start subscribing to new orders
    send({
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: [product],
    });

    // Listen for incoming orders
    const onMessage = (ev: MessageEvent) => {
      try {
        const data: OrderBookUpdate = JSON.parse(ev.data);
        if (!data.bids && !data.asks) {
          return;
        }

        setOrderBook((prevOrders) => addOrderUpdateToBook(prevOrders, data));
      } catch (err) {
        console.error("Received unparseable message", ev.data, err);
      }
    };
    ws.current.addEventListener("message", onMessage);
    return () => ws.current?.removeEventListener("message", onMessage);
  }, [isConnected, product]);

  // Clump the order book into specified price groupings and send that out instead
  useEffect(() => {
    setGroupedOrderBook(groupOrderBookPrices(orderBook, groupSize))
  }, [orderBook, groupSize])

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo<OrderBookState>(
    () => ({
      isConnecting,
      isConnected,
      orderBook: groupedOrderBook,
      product,
      groupSize,
      reconnect,
      setProduct,
      setGroupSize,
    }),
    [isConnecting, isConnected, groupedOrderBook, product, groupSize],
  );

  return (
    <OrderBookContext.Provider value={value}>
      {children}
    </OrderBookContext.Provider>
  );
};
