import React from "react";
import { TableRow, TableCell, makeStyles, ButtonBase } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useOrderBookContext } from "../contexts/OrderBook";

const GROUP_SIZES = [0.5, 1.0, 2.5, 5.0, 10.0, 25.0, 50.0, 100.0, 1000.0];

export const OrderBookTableControls = () => {
  const styles = useStyles();
  const { orderBook, groupSize, setGroupSize } = useOrderBookContext();

  const groupSizeIndex = GROUP_SIZES.indexOf(groupSize);
  const spread =
    orderBook.asks.reduce((lo, o) => Math.min(lo, o.price), Infinity) -
    orderBook.bids.reduce((hi, o) => Math.max(hi, o.price), 0);


  return (
    <TableRow>
      <TableCell colSpan={3}>
        <div className={styles.cell}>
          <div className={`${styles.section} ${styles.spread}`}>
            Spread: {spread === Infinity ? "N/A" : spread}
          </div>
          <div className={styles.section}>
            <span>Group: {groupSize}</span>
            <ButtonBase
              disabled={groupSize === GROUP_SIZES[0]}
              className={styles.groupButton}
              onClick={() => setGroupSize(GROUP_SIZES[groupSizeIndex - 1])}
            >
              <RemoveIcon />
            </ButtonBase>
            <ButtonBase
              disabled={groupSize === GROUP_SIZES[GROUP_SIZES.length - 1]}
              className={styles.groupButton}
              onClick={() => setGroupSize(GROUP_SIZES[groupSizeIndex + 1])}
            >
              <AddIcon />
            </ButtonBase>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

const useStyles = makeStyles((theme) => ({
  cell: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.text.secondary,
  },
  section: {
    display: "flex",
    alignItems: "center",
    paddingRight: theme.spacing(4),
    "&:last-child": {
      paddingRight: 0,
    },
    "& > span": {
      marginRight: theme.spacing(2),
    },
  },
  spread: {
    minWidth: 140,
  },
  groupButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: "100%",

    "& .MuiSvgIcon-root": {
      fontSize: 16,
    },
  },
}));
