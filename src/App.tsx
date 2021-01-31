import { makeStyles } from "@material-ui/core";
import React from "react";
import { OrderBookTable } from "./components/OrderBookTable";
import { OrderBookProvider } from "./contexts/OrderBook";

export const App: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.app}>
      <div className={styles.inner}>
        <OrderBookProvider>
          <OrderBookTable />
        </OrderBookProvider>
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  app: {
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    padding: theme.spacing(4),
  },
  inner: {
    width: "100%",
    maxWidth: 980,
  },
}));
