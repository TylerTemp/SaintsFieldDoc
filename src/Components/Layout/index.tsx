import {  Outlet, useLocation } from 'react-router-dom';
// import Req from "~/Utils/Req";
// import { Menu } from 'antd';
// import Companies, { CompanyIcon } from './Companies';

import { useContext } from 'react';
import { Context } from "~/Components/Theme/ThemeProvider";
// import Style from "./index.css";
// import { useTheme } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import Style from "./index.css";


export default () => {

    const {theme, setTheme} = useContext(Context);

    const curTheme = useTheme();

    const {pathname} = useLocation();

    return <>
        <div>
            <div>
                <Outlet />
            </div>
        </div>
    </>;
};
