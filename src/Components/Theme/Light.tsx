import { createTheme } from "./Basic";
import { lime, blue, purple } from "@mui/material/colors";

const { palette } = createTheme();

export default createTheme({
    typography: {
        button: {
            textTransform: 'none',
        },
    },

    palette: {
        mode: 'light',
        // importantQuote: {
        //     main: purple[500],
        // }
        // importantQuote: palette.augmentColor({
        //     color: purple,
        // }),
        importantQuote: palette.augmentColor({
            color: {
                main: purple[500],
            },
            name: 'importantQuote',
        })
    },

    dim: '#24242482',
    // status: {
    //     themeBubble: yellow[400],
    // },
    nav: {
        active: lime[300],
    },
    sortButton: {
        active: blue[500],
        fade: 'white',
    },
    sepDevider: 'rgba(0, 0, 0, 0.12)',
    buttonMockHoverBackgroundColor: 'rgba(25, 118, 210, 0.04)',
});
