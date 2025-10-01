import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useMemo, useRef, useEffect } from 'react';
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
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import MenuOpenTwoToneIcon from '@mui/icons-material/MenuOpenTwoTone';

const RenderTitleAndContent = ({titleAndContent: {Title, TitleId, Content, SubContents}, prefix=null, pl=0, itemAction}: {titleAndContent: TitleAndContent, prefix: string|null, pl?: number, itemAction: () => void}) => {

    const navigate = useNavigate();

    const { pathname } = useLocation();
    console.log(`pathname`, pathname);

    const uri = PrefixUri(prefix, TitleId);

    // console.log(`prefix=${prefix}, TitleId=${TitleId}, pathname=${pathname}, uri=${uri}`);

    const curActive = useMemo(() => {
        if(TitleId === '') {
            return pathname === '/';
        }

        let preUri = '/' + uri;

        if(!pathname.startsWith(preUri)) {
            return false;
        }

        let prePath = pathname;
        if(!prePath.endsWith('/')) {
            prePath += '/';
        }

        if(!preUri.endsWith('/')) {
            preUri += '/';
        }

        console.log(prePath, preUri);

        const activeResult = prePath.startsWith(preUri);

        return activeResult;

        // if(pathname.startsWith(`/${uri}`)) {
        //     console.log(`pathname=${pathname}, uri=${uri}, ${pathname.replace(`/${uri}`, '')}`);
        //     console.log(pathname.replace(`/${uri}`, '').replace('/', ''))
        // }

        // return pathname.startsWith(`/${uri}`) && (pathname.replace(`/${uri}`, '').replace('/', '') === '');
    }, [TitleId, pathname]);


    const [open, setOpen] = useState(curActive);

    const handleClick = () => {
        setOpen(orl => !orl);
        if(Content !== "") {
            navigate(uri);
            itemAction();
        }
    };

    useEffect(() => {
        if(curActive && !open)
        {
            setOpen(curActive);
        }
    }, [curActive]);

    return (<List key={TitleId} dense disablePadding={true}>
        <ListItemButton onClick={handleClick} sx={{pl}} selected={curActive}>
            <ListItem>
                {TitleId === "" && <ListItemIcon>
                    <HomeTwoToneIcon />
                </ListItemIcon>}
                {/* {SubContents.length > 0 && Content !== null && Content.length > 0 && <ListItemIcon>
                    <ArticleTwoToneIcon  />
                </ListItemIcon>} */}
                <ListItemText
                    primary={TitleId === ""
                        ? "SaintsField"
                        : <Markdown remarkPlugins={[remarkGfm]} disallowedElements={['p']} unwrapDisallowed>{Title}</Markdown>}
                    // primary="SaintsField"
                />
            </ListItem>
            {SubContents.length > 0 && Content !== null && Content.length > 0 && <ArticleTwoToneIcon sx={{fontSize: '0.9rem'}} />}
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
                itemAction={itemAction}
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

    const [mobileSideOpen, setMobileSideOpen] = useState(false);

    return <>
        <Box sx={{position: 'fixed', top: 0, right: 4}}>
            <DarkLightToggle isDark={theme === ThemeType.Dark} onChange={toDark => setTheme(toDark? ThemeType.Dark: ThemeType.Light)} />
            <Fab color="default" size='small' sx={{m: 1, display: { xs: 'inline-flex', sm: 'none' }}} onClick={() => setMobileSideOpen(true)}>
                <MenuOpenTwoToneIcon />
            </Fab> 
        </Box>

        <Box sx={{ display: 'flex'}}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }}}>
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
                            {readMe.map(eachReadMe => <RenderTitleAndContent key={eachReadMe.TitleId} titleAndContent={eachReadMe} prefix={null} itemAction={() => {}} />)}
                        </Collapse>
                    </Paper>
                </Resizable>
            </Box>

            {/* <Fab color="primary" aria-label="add">
                <AddIcon />
            </Fab> */}

            <Drawer anchor='right' open={mobileSideOpen} onClose={() => setMobileSideOpen(false)} sx={{ display: { xs: 'block', sm: 'none' }}}>
                
                <Box sx={{ width: 250 }} role="presentation">
                    {readMe.map(eachReadMe => <RenderTitleAndContent key={eachReadMe.TitleId} titleAndContent={eachReadMe} prefix={null} itemAction={() => setMobileSideOpen(false)}  />)}
                </Box>

            </Drawer>

            <Box sx={{width: 1, minWidth: 0}}>
                <Outlet />
            </Box>
        </Box>
    </>;
};
