import { Link, useLocation } from 'react-router-dom';
// import Req from "~/Utils/Req";
// import { Menu } from 'antd';
// import Companies, { CompanyIcon } from './Companies';

// import Style from "./index.css";
// import { useTheme } from '@mui/material';
// import Style from "./index.css";
import ReadMeData from "~/Data/ReadMe.json";
import type { TitleAndContent } from "~/Data/Types";
import Box from '@mui/material/Box/Box';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Typography from '@mui/material/Typography';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Container from '@mui/material/Container/Container';
import HomeIcon from '@mui/icons-material/Home';
import { PrefixUri } from '~/Utils/Util';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {default as MuiLink} from '@mui/material/Link/Link';
// import { dark } from 'react-syntax-highlighter/dist/cjs/al'

interface BreadcrumbInfo {
    Title: string
    TitleId: string
    HasContent: boolean
    URI: string
}

export default () => {

    const { pathname } = useLocation();
    console.log(`pathname=${pathname}`);

    const readMe: TitleAndContent[] = ReadMeData;

    let searchTarget: TitleAndContent = {
        Title: "",
        TitleId: "",
        Content: "",
        SubContents: readMe,
    }

    // let titleAndContent: TitleAndContent | null = searchTarget;

    const breadcrumbInfos: BreadcrumbInfo[] = [];
    const pathSplit = pathname.substring(1).split('/');
    let noResult: boolean = false;

    for (let index = 0; index < pathSplit.length; index++) {
        const pathFragment = pathSplit[index];

        let found: boolean = false;
        for (let searchSubIndex = 0; searchSubIndex < searchTarget.SubContents.length; searchSubIndex++) {
            const subResult = searchTarget.SubContents[searchSubIndex];
            // console.log(`path=${pathFragment} -> ${subResult.TitleId}`);
            if (subResult.TitleId === pathFragment) {
                console.log(`yes: path=${pathFragment} -> ${subResult.TitleId}`);
                breadcrumbInfos.push({
                    Title: subResult.Title,
                    TitleId: subResult.TitleId,
                    HasContent: subResult.Content !== "",
                    URI: "/" + PrefixUri(...breadcrumbInfos.map(({TitleId}) => TitleId), subResult.TitleId)
                })
                found = true;
                searchTarget = subResult;
                break;
            }
            else {
                console.log(`no:  path=${pathFragment} -> ${subResult.TitleId}`);
            }
        }

        if (!found) {
            noResult = true;
            break;
        }
    }

    if (noResult) {
        return (<p>Not Found</p>);
    }

    if(breadcrumbInfos[0].TitleId !== "") {
        breadcrumbInfos.unshift({
            Title: "",
            TitleId: "",
            HasContent: true,
            URI: "",
        })
    }

    return (<Container maxWidth="xl">
        <Box>
            <Breadcrumbs>{breadcrumbInfos.map(({TitleId, Title, URI, HasContent}, index) => {
                if(TitleId === "") {
                    return <MuiLink key="" to="/" component={Link}><HomeIcon /></MuiLink>;
                }
                const isLast: boolean = index === breadcrumbInfos.length - 1;
                if(isLast || !HasContent) {
                    return <Typography key={TitleId} sx={{ color: 'text.primary' }}>
                        <Markdown remarkPlugins={[remarkGfm]} disallowedElements={['p']} unwrapDisallowed>{Title}</Markdown>
                    </Typography>;
                }
                return <MuiLink key={TitleId} underline="hover" color="inherit" to={URI} component={Link}>
                    <Markdown remarkPlugins={[remarkGfm]} disallowedElements={['p']} unwrapDisallowed>{Title}</Markdown>
                </MuiLink>;
            })}</Breadcrumbs>

            <Typography variant="h1" gutterBottom>
                <Markdown remarkPlugins={[remarkGfm]} disallowedElements={['p']} unwrapDisallowed>{searchTarget.Title}</Markdown>
            </Typography>
            {searchTarget.Content !== "" && <>
                <Markdown remarkPlugins={[remarkGfm]} components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');

                        return !inline && match ? (
                            <SyntaxHighlighter style={materialOceanic} PreTag="div" language={match[1]} {...props}>
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    a({ node, children, href, ...props }: any) {
                        if (children && typeof children === 'object' && 'type' in children && children['type'] === 'img') {
                            if (children['props']['alt'] === 'video') {
                                const src = children['props']['src'];
                                return <video muted autoPlay poster={src} controls>
                                    <source src={href}></source>
                                </video>;
                            }
                        }
                        return <a href={href} {...props}>{children}</a>
                    },
                    h1({ node, children, ...props }) {
                        return <Typography variant="h1" gutterBottom>{children}</Typography>;
                    },
                    h2({ node, children, ...props }) {
                        return <Typography variant="h2" gutterBottom>{children}</Typography>;
                    },
                    h3({ node, children, ...props }) {
                        return <Typography variant="h3" gutterBottom>{children}</Typography>;
                    },
                    h4({ node, children, ...props }) {
                        return <Typography variant="h4" gutterBottom>{children}</Typography>;
                    },
                    h5({ node, children, ...props }) {
                        return <Typography variant="h5" gutterBottom>{children}</Typography>;
                    },
                    h6({ node, children, ...props }) {
                        return <Typography variant="h6" gutterBottom>{children}</Typography>;
                    },
                    p({ node, children, ...props }) {
                        return <Typography variant="body1" gutterBottom>{children}</Typography>;
                    },
                }}>{searchTarget.Content}</Markdown>
            </>}
        </Box>
    </Container>);

};
