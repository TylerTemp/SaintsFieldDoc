import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import Req from "~/Utils/Req";
// import { Menu } from 'antd';
// import Companies, { CompanyIcon } from './Companies';

import React, { Fragment, useContext, useState, PropsWithChildren } from 'react';
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
import Typography from '@mui/material/Typography';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Container from '@mui/material/Container/Container';
// import { dark } from 'react-syntax-highlighter/dist/cjs/al'

export default () => {

    const CodeBlock = ({className, children}: PropsWithChildren<{className?: string}>) => {
        let lang = 'text'; // default monospaced text
        if (className && className.startsWith('lang-')) {
          lang = className.replace('lang-', '');
        }
        return (
          <SyntaxHighlighter language={lang} style={materialOceanic}>
            {String(children)}
          </SyntaxHighlighter>
        );
      }

    // markdown-to-jsx uses <pre><code/></pre> for code blocks.
    const PreBlock = ({children, ...rest}: PropsWithChildren<{}>) => {
    if (children && typeof children === 'object' && 'type' in children && children['type'] === 'code') {
        return CodeBlock(children['props']);
    }
    return <pre {...rest}>{children}</pre>;
    };

    const options = {
        overrides: {
          h1: {
            component: Typography,
            props: {
              gutterBottom: true,
              variant: 'h4',
            },
          },
          h2: {
            component: Typography,
            props: { gutterBottom: true, variant: 'h6' },
          },
          h3: {
            component: Typography,
            props: { gutterBottom: true, variant: 'subtitle1' },
          },
          h4: {
            component: Typography,
            props: {
              gutterBottom: true,
              variant: 'caption',
              paragraph: true,
            },
          },
          p: {
            component: Typography,
            props: { paragraph: true },
          },
          a: { component: Link },
          li: {
            component: (props: any) => (
              <Box component="li" sx={{ mt: 1 }}>
                <Typography component="span" {...props} />
              </Box>
            ),
          },
          pre: PreBlock,
        },
      };


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


    return (<Container maxWidth="xl">
    <Box>
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
                // a({node, children, href, ...props}: any) {
                //     if (children && typeof children === 'object' && 'type' in children && children['type'] === 'img') {
                //         const src = children['props']['src'];
                //         return <video muted autoPlay poster={src} controls>
                //             <source src={href}></source>
                //         </video>
                //     }
                //     return <a href={href} {...props}>{children}</a>
                // },
                h1({node, children, ...props}) {
                    return <Typography variant="h1" gutterBottom>{children}</Typography>;
                },
                h2({node, children, ...props}) {
                    return <Typography variant="h2" gutterBottom>{children}</Typography>;
                },
                h3({node, children, ...props}) {
                    return <Typography variant="h3" gutterBottom>{children}</Typography>;
                },
                h4({node, children, ...props}) {
                    return <Typography variant="h4" gutterBottom>{children}</Typography>;
                },
                h5({node, children, ...props}) {
                    return <Typography variant="h5" gutterBottom>{children}</Typography>;
                },
                h6({node, children, ...props}) {
                    return <Typography variant="h6" gutterBottom>{children}</Typography>;
                },
                p({node, children, ...props}) {
                    return <Typography variant="body1" gutterBottom>{children}</Typography>;
                },
            }}>{searchTarget.Content}</Markdown>
        </>}
    </Box>
    </Container>);

};
