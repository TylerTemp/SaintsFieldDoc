import { createTheme } from "./Basic";
import { blue, deepPurple } from "@mui/material/colors";

const { palette } = createTheme();

export default createTheme({
    typography: {
        button: {
            textTransform: 'none',
        },
    },

    palette: {
        mode: 'dark',
        // importantQuote: {
        //     main: purple[500],
        // }
        // importantQuote: palette.augmentColor({
        //     color: purple,
        // })
        importantQuote: palette.augmentColor({
            color: {
                main: deepPurple[500],
            },
            name: 'importantQuote',
        })
    },
    dim: 'rgba(255, 255, 255, 0.2)',
    // status: {
    //     themeBubble: grey[300],
    // },
    nav: {
        active: blue[300]
    },
    sortButton: {
        active: blue[200],
        fade: 'black',
    },
    sepDevider: 'rgba(255, 255, 255, 0.12)',
    buttonMockHoverBackgroundColor: 'rgba(144, 202, 249, 0.08)',
});
