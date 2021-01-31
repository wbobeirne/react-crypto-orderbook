import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import React from "react";
import { useOrderBookContext } from "../contexts/OrderBook";
import { OrderRows } from "./OrderRows";
import { OrderBookTableControls } from "./OrderBookTableControls";

export const OrderBookTable: React.FC = () => {
  const {
    orderBook,
    product,
    isConnecting,
    isConnected,
    reconnect,
  } = useOrderBookContext();
  const { asks, bids } = orderBook;

  let content: React.ReactNode;
  if (isConnecting) {
    content = (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={600}
      >
        <CircularProgress />
      </Box>
    );
  } else if (!isConnected) {
    content = (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height={600}
      >
        <Typography variant="h6">Connection failed</Typography>
        <Box m={1}>
          <Button variant="outlined" onClick={reconnect}>
            Try again
          </Button>
        </Box>
      </Box>
    );
  } else {
    content = (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <OrderRows orderType="ask" orders={asks} />
          <OrderBookTableControls />
          <OrderRows orderType="bid" orders={bids} />
        </TableBody>
      </Table>
    );
  }

  return (
    <>
      <Typography variant="h3">{product}</Typography>
      <Box mb={2} />
      <TableContainer component={Paper}>{content}</TableContainer>
    </>
  );
};
