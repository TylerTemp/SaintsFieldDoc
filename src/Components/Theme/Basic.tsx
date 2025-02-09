import React from "react";

export { createTheme } from "@mui/material/styles";
// export { ThemeProvider } from "@mui/material/styles";
// export { CssBaseline } from "@mui/material";

// import { PaletteOptions } from "@mui/material/styles";

// Extend the PaletteOptions type to include importantQuote
declare module '@mui/material/styles' {
    interface Palette {
      importantQuote: Palette["primary"];
    }

    interface PaletteOptions {
      importantQuote: {
        main: React.CSSProperties['color'];
      };
    }
    interface Theme {
      dim: string;
      // status: {
      //   themeBubble: React.CSSProperties['color'];
      // },
      nav: {
        active: React.CSSProperties['color'];
      },
      sortButton: {
        active: React.CSSProperties['color'];
        fade: React.CSSProperties['color'];
      },
      sepDevider: React.CSSProperties['color'],
      buttonMockHoverBackgroundColor: React.CSSProperties['color'];
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
      dim: React.CSSProperties['color'];
      // status: {
      //   themeBubble: React.CSSProperties['color'];
      // },
      nav: {
        active: React.CSSProperties['color'];
      },
      sortButton: {
        active: React.CSSProperties['color'];
        fade: React.CSSProperties['color'];
      },
      sepDevider: React.CSSProperties['color'],
      buttonMockHoverBackgroundColor: React.CSSProperties['color'];
    }
  }

// const theme = createTheme({
//     palette: {
//         mode: 'dark'
//     },
//     status: {
//         dim: 'red'
//     }
// });

// export createTheme;

// export default {
//     createTheme,
//     ThemeProvider,
//     CssBaseline,
// };

declare module "@mui/material/Icon" {
    // interface SvgIconOwnProps {
    interface SvgIconOwnProps {
        // color?: "importantQuote";
        color: {
          importantQuote: true;
        }
    }
}