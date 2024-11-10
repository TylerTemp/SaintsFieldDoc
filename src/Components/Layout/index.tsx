import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import Req from "~/Utils/Req";
// import { Menu } from 'antd';
// import Companies, { CompanyIcon } from './Companies';

import { Fragment, useContext, useState, PropsWithChildren } from 'react';
import { Context } from "~/Components/Theme/ThemeProvider";
// import Style from "./index.css";
// import { useTheme } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
// import Style from "./index.css";
import ReadMeData from "~/Data/ReadMe.json";
import type { TitleAndContent } from "~/Data/Types";
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
import ListSubheader from '@mui/material/ListSubheader/ListSubheader';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse/Collapse';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const PrefixUri = (...paths: (string | null)[]) => paths.filter(each => each !== null && each !== "" && each !== "/").join("/");


const RenderTitleAndContent = ({titleAndContent: {Title, TitleId, Content, SubContents}, prefix=null, pl=0}: {titleAndContent: TitleAndContent, prefix: string|null, pl?: number}) => {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setOpen(orl => !orl);
        console.log(Content);
        if(Content !== "") {
            navigate(PrefixUri(prefix, TitleId));
        }
    };

    return (<List key={TitleId} dense disablePadding={true}>
        <ListItemButton onClick={handleClick} sx={{pl}}>
            <ListItem>
                <ListItemText
                    primary={<Markdown remarkPlugins={[remarkGfm]} disallowedElements={['p']} unwrapDisallowed>{Title}</Markdown>}
                />
            </ListItem>
            {SubContents.length > 0 && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {SubContents.length > 0 && <Collapse in={open}>
            {SubContents.map(eachContent => <RenderTitleAndContent
                key={PrefixUri(prefix, TitleId, eachContent.TitleId)}
                titleAndContent={eachContent}
                prefix={PrefixUri(prefix, TitleId)}
                pl={pl + 4}
            />)}
        </Collapse>}
    </List>);
}


export default () => {

    const { theme, setTheme } = useContext(Context);

    const curTheme = useTheme();

    const { pathname } = useLocation();

    const readMe: TitleAndContent[] = ReadMeData;

    return <Box sx={{ display: 'flex'}}>
        <Box sx={{ position: 'sticky', left: 0, top: 0}}>
            <Resizable defaultSize={{ width: 200 }}>
                <Paper elevation={3} sx={{overflowX: 'hidden'}}>
                    {readMe.map(eachReadMe => <RenderTitleAndContent key={eachReadMe.TitleId} titleAndContent={eachReadMe} prefix={null}  />)}
                </Paper>
            </Resizable>
        </Box>
        <div>
            <Outlet />
        </div>
    </Box>;
};
