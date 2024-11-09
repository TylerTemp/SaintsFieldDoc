import { Outlet, useLocation } from 'react-router-dom';
// import Req from "~/Utils/Req";
// import { Menu } from 'antd';
// import Companies, { CompanyIcon } from './Companies';

import { useContext } from 'react';
import { Context } from "~/Components/Theme/ThemeProvider";
// import Style from "./index.css";
// import { useTheme } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
// import Style from "./index.css";
import ReadMeData from "~/Data/ReadMe.json";
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Divider from '@mui/material/Divider/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Resizable } from 're-resizable';
import Paper from '@mui/material/Paper/Paper';
import Box from '@mui/material/Box/Box';


export default () => {

    const { theme, setTheme } = useContext(Context);

    const curTheme = useTheme();

    const { pathname } = useLocation();

    return <>
        <Box sx={{ height: '100vh', overflowY: 'hidden' }}>
            <Resizable defaultSize={{ width: 200, height: '100%' }}>
                <Paper elevation={3} sx={{height: 1}}>
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Resizable>
        </Box>
        <div>
            <Outlet />
        </div>
    </>;
};
