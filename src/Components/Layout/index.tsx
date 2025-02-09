import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useMemo, useRef } from 'react';
import { Context, ThemeType } from "~/Components/Theme/ThemeProvider";
import { useTheme } from '@mui/material/styles';
import ReadMeData from "~/Data/ReadMe.json";
import type { TitleAndContent } from "~/Data/Types";
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Divider from '@mui/material/Divider/Divider';
import { Resizable, type ResizeCallback, type NumberSize, type Enable } from 're-resizable';
import Paper from '@mui/material/Paper/Paper';
import Box from '@mui/material/Box/Box';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse/Collapse';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DarkLightToggle from './DarkLightToggle';
import Button from '@mui/material/Button';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import RotateStyle from "~/Components/RotateClass/index.css";
import classNames from 'classnames';
import { PrefixUri } from '~/Utils/Util';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import useMediaQuery from '@mui/material/useMediaQuery';

const RenderTitleAndContent = ({titleAndContent: {Title, TitleId, Content, SubContents}, prefix=null, pl=0}: {titleAndContent: TitleAndContent, prefix: string|null, pl?: number}) => {

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const uri = PrefixUri(prefix, TitleId);

    const curActive = useMemo(() => {
        if(TitleId === '') {
            return pathname === '/';
        }
        return pathname.startsWith(`/${uri}`) && pathname.replace(`/${uri}`, '').replace('/', '') === '';
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
                {TitleId === "" && <ListItemIcon>
                    <HomeTwoToneIcon />
                </ListItemIcon>}
                <ListItemText
                    primary={<Markdown remarkPlugins={[remarkGfm]} disallowedElements={['p']} unwrapDisallowed>{Title}</Markdown>}
                />
            </ListItem>
            {SubContents.length > 0 && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {TitleId === "" && <>
            <ListItemButton component={Link} to="/search" sx={{pl: 4}} selected={pathname === "/search"}>
                <ListItemIcon>
                    <SearchTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary="Search" />
            </ListItemButton>
            <Divider />
            <Box sx={{height: 5}} />
        </>}
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

const DefaultWidth = 180;
const MinWidth = 50;


export default () => {
    // console.log(rotate180);

    const { theme, setTheme } = useContext(Context);

    const curTheme = useTheme();
    const matches = useMediaQuery(curTheme.breakpoints.down('sm'));

    const initIsMobile: boolean = useMemo(() => {
        return matches;
    }, []);

    const readMe: TitleAndContent[] = ReadMeData;

    const resizableRef = useRef<Resizable | null>(null);

    const [resizableSize, setResizableSize] = useState(DefaultWidth);
    const [enableResize, setEnableResize] = useState<boolean>(!initIsMobile);

    const ResizeCallback: ResizeCallback = (event: MouseEvent | TouchEvent, direction: unknown, elementRef: HTMLElement, delta: NumberSize): void => {
        // console.log(delta.width);
        if(enableResize) {
            setResizableSize(delta.width);
        }
    }

    const onResizeControlClick = () => {
        setEnableResize(enabled => !enabled);
        if(enableResize) {
            resizableRef.current?.updateSize({width: MinWidth});
        }
        else {
            resizableRef.current?.updateSize({width: Math.max(resizableSize, DefaultWidth)});
        }
    }

    // const onHidePanel = () => {
    //     setEnableResize(false);
    //     resizableRef.current?.updateSize({width: MinWidth});
    // }

    return <>
        <Box sx={{position: 'fixed', top: 0, right: 0}}>
            <DarkLightToggle isDark={theme === ThemeType.Dark} onChange={toDark => setTheme(toDark? ThemeType.Dark: ThemeType.Light)} />
        </Box>

        <Box sx={{ display: 'flex'}}>
            {/* <Box sx={{minWidth: 0}}> */}
            <Resizable
                enable={{...EnableOtherType, ...(enableResize? EnableOkType: EnableNotType)}}
                defaultSize={{ width: initIsMobile? MinWidth: DefaultWidth }}
                ref={ref => { resizableRef.current = ref; }}
                onResize={ResizeCallback}
                // style={{position: 'sticky', top: 0}}
                style={{minWidth: 0, maxHeight: 'calc(100vh - 10px)'}}
            >
                <Paper elevation={3} sx={{overflowX: 'hidden', maxHeight: 'calc(100vh - 10px)', position: 'sticky', top: 0}}>
                    <Button fullWidth onClick={onResizeControlClick} endIcon={<MenuOpenIcon classes={{root: classNames(RotateStyle.rotateBase, {
                        [RotateStyle.rotate180]: !enableResize,
                    })}}/>}>
                        {enableResize && "Hide"}
                    </Button>
                    <Collapse in={enableResize}>
                        <Divider />
                        {readMe.map(eachReadMe => <RenderTitleAndContent key={eachReadMe.TitleId} titleAndContent={eachReadMe} prefix={null}  />)}
                    </Collapse>
                </Paper>
            </Resizable>
            {/* </Box> */}
            <Box sx={{width: 1, minWidth: 0}}>
                <Outlet />
            </Box>
        </Box>
    </>;
};
