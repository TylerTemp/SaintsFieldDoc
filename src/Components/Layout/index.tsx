import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import Req from "~/Utils/Req";
// import { Menu } from 'antd';
// import Companies, { CompanyIcon } from './Companies';

import { Fragment, useContext, useState, PropsWithChildren, useMemo, useRef, SyntheticEvent } from 'react';
import { Context, ThemeType } from "~/Components/Theme/ThemeProvider";
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
import { Resizable, type ResizeCallback, type NumberSize, type Enable } from 're-resizable';
import Paper from '@mui/material/Paper/Paper';
import Box from '@mui/material/Box/Box';
import ListSubheader from '@mui/material/ListSubheader/ListSubheader';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse/Collapse';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DarkLightToggle from './DarkLightToggle';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import RotateStyle from "~/Components/RotateClass/index.css";
import classNames from 'classnames';
import { PrefixUri } from '~/Utils/Util';


const RenderTitleAndContent = ({titleAndContent: {Title, TitleId, Content, SubContents}, prefix=null, pl=0}: {titleAndContent: TitleAndContent, prefix: string|null, pl?: number}) => {

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const uri = PrefixUri(prefix, TitleId);

    const curActive = useMemo(() => {
        if(TitleId === '') {
            return pathname === '/';
        }
        return pathname.startsWith(`/${uri}`);
    }, [TitleId, pathname]);
    const [open, setOpen] = useState(curActive);

    const handleClick = () => {
        setOpen(orl => !orl);
        if(Content !== "") {
            navigate(uri);
        }
    };

    return (<List key={TitleId} dense disablePadding={true}>
        <ListItemButton onClick={handleClick} sx={{pl}} selected={curActive}>
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

type EnableUseType = Pick<Enable, "right" | "topRight" | "bottomRight">;

const EnableOkType: EnableUseType = {
    right: true,
    topRight: true,
    bottomRight: true,
}

const EnableNotType: EnableUseType = {
    right: false,
    topRight: false,
    bottomRight: false,
}

const EnableOtherType: Partial<Enable> = {
    top: false,
    bottom: false,
    left: false,
    bottomLeft: false,
    topLeft: false,
}

const DefaultWidth = 200;


export default () => {
    // console.log(rotate180);

    const { theme, setTheme } = useContext(Context);

    // const curTheme = useTheme();

    const readMe: TitleAndContent[] = ReadMeData;

    const resizableRef = useRef<Resizable | null>(null);

    const [resizableSize, setResizableSize] = useState(200);

    const ResizeCallback: ResizeCallback = (event: MouseEvent | TouchEvent, direction: any, elementRef: HTMLElement, delta: NumberSize): void => {
        // console.log(delta.width);
        setResizableSize(delta.width);
    }

    const onResizeControlClick = () => {
        setEnableResize(enabled =>{
            if(enabled) {
                resizableRef.current?.updateSize({width: 70});
            }
            else {
                resizableRef.current?.updateSize({width: resizableSize});
            }
            return !enabled;
        });
    }

    const [enableResize, setEnableResize] = useState<boolean>(true);

    return <Box sx={{ display: 'flex'}}>
        <Box sx={{ position: 'sticky', left: 0, top: 0}}>
            <Resizable enable={{...EnableOtherType, ...(enableResize? EnableOkType: EnableNotType)}} defaultSize={{ width: DefaultWidth }} ref={ref => resizableRef.current = ref} onResize={ResizeCallback}>
                <Paper elevation={3} sx={{overflowX: 'hidden'}}>
                    <Button fullWidth onClick={onResizeControlClick}>
                        <span className={classNames({
                            [RotateStyle.rotateBase]: true,
                            [RotateStyle.rotate180]: !enableResize,
                        })}>
                            <MenuOpenIcon/>
                        </span>
                    </Button>
                    <Collapse in={enableResize}>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <DarkLightToggle isDark={theme === ThemeType.Dark} onChange={toDark => setTheme(toDark? ThemeType.Dark: ThemeType.Light)} />
                        </Box>
                        <Divider />
                        {readMe.map(eachReadMe => <RenderTitleAndContent key={eachReadMe.TitleId} titleAndContent={eachReadMe} prefix={null}  />)}
                    </Collapse>
                </Paper>
            </Resizable>
        </Box>
        <div>
            <Outlet />
        </div>
    </Box>;
};
