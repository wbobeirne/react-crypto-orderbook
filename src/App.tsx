import { makeStyles } from "@material-ui/core";
import React from "react";

export const App: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.app}>
      <div className={styles.inner}>
 
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  app: {
    minHeight: "100vh",
    padding: theme.spacing(4),
  },
  inner: {
    maxWidth: 980,
  },
}));
