import { makeStyles, TableCell, TableRow } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import React, { useMemo } from "react";
import { OrderBookOrder } from "../types/orders";
import { commafy } from "../util/format";

const NUM_ROWS = 6;

interface OrderRowsProps {
  orderType: "bid" | "ask";
  orders: OrderBookOrder[];
}

export const OrderRows: React.FC<OrderRowsProps> = ({ orderType, orders }) => {
  const styles = useStyles();

  const sortedOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      return orderType === "bid" ? b.price - a.price : a.price - b.price;
    });
    const sliced = sorted.slice(0, NUM_ROWS);
    if (orderType === "ask") {
      sliced.reverse();
    }
    return sliced;
  }, [orders, orderType]);

  // Bids count "down", asks count "up"
  let quantityCounter = orderType === "bid" ? 0 : sortedOrders.reduce((prev, o) => prev += o.quantity, 0) ;

  return (
    <>
      {sortedOrders.map((o) => {
        quantityCounter = orderType === "bid" ? quantityCounter + o.quantity : quantityCounter - o.quantity;
        return (
          <TableRow key={`${orderType}-${o.price}-${o.quantity}`} className={`${styles.row} ${orderType}`}>
            <TableCell>{commafy(o.price)}</TableCell>
            <TableCell>{commafy(o.quantity)}</TableCell>
            <TableCell>{commafy(quantityCounter + (orderType === "bid" ? 0 : o.quantity))}</TableCell>
          </TableRow>
        );
      })}
      {!sortedOrders.length && (
        <TableRow>
          <TableCell colSpan={3}>
            No {orderType} orders
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const useStyles = makeStyles({
  row: {
    "&.bid .MuiTableCell-root": {
      color: green[500],
    },

    "&.ask .MuiTableCell-root": {
      color: red[500],
    },

    "&:hover": {
      background: "rgba(255, 255, 255, 0.05)",
      "& .MuiTableCell-root:first-child": {
        fontWeight: 600,
      },
    },
  },
})
