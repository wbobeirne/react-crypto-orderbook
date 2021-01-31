import { createMuiTheme } from "@material-ui/core";

const PTMono = {
  fontFamily: "PTMono",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('PTMono'),
    local('PTMono-Regular'),
    url('/fonts/PTMono-Regular.ttf') format('ttf')
  `,
} as const;

export const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
  typography: {
    fontFamily: "PTMono, monospace",
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [PTMono],
      },
    },
  },
});
