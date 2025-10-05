// import { useContext } from 'react';
import { Toaster } from "mui-sonner";

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Context, ThemeType } from "~/Components/Theme/ThemeProvider";

export default () => {
    // const {theme} = useContext(Context);

    // const toastTheme = theme === ThemeType.Light
    //     ? "light"
    //     : "dark";

    return <Toaster
        // position="bottom-right"
        // theme={toastTheme}
        // autoClose={3000}
        // hideProgressBar={false}
        // newestOnTop={false}
        // closeOnClick
        // rtl={false}
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover
    />;
}
