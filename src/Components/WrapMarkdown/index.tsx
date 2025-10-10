import React, { Fragment, useContext } from 'react';
import Markdown, {type Options} from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Typography from '@mui/material/Typography';
import { Context, ThemeType } from "~/Components/Theme/ThemeProvider";
import {Prism, SyntaxHighlighterProps} from 'react-syntax-highlighter';
import { materialOceanic as darkTheme, solarizedlight as lightTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { PropsWithChildren } from 'react';
import Tip from './GithubQuote/Tip';
import Important from './GithubQuote/Important';
import Note from './GithubQuote/Note';
import Warning from './GithubQuote/Warning';
import Style from './index.scss';
import classNames from 'classnames';
import Link from '@mui/material/Link/Link';
import Caution from './GithubQuote/Caution';
import CopyButton from './CopyButton';
import Box from '@mui/material/Box';
import { type SxProps } from '@mui/material';

type MarkdownProps = Pick<Options, "disallowedElements" | "unwrapDisallowed">;

const SyntaxHighlighter = Prism as typeof React.Component<SyntaxHighlighterProps>;

const CopyButtonContent = ({text, sx}: {text: string, sx?: SxProps}) => {
    return <CopyButton content={text} sx={sx} />;
}

export default ({disallowedElements, unwrapDisallowed, children}: PropsWithChildren<MarkdownProps>) => {

    const { theme } = useContext(Context);

    const codeStyle = theme === ThemeType.Light? lightTheme: darkTheme;

    return (<Markdown disallowedElements={disallowedElements} unwrapDisallowed={unwrapDisallowed} remarkPlugins={[remarkGfm]} components={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');

            if(!inline && match) {
                const stringChildren = String(children);
                return <Box sx={{position: 'relative'}}>
                    <CopyButtonContent text={stringChildren} sx={{position: 'absolute', top: 8, right: 8, zIndex: 1}} />
                    <SyntaxHighlighter style={codeStyle} PreTag="div" language={match[1]} {...props}>
                        {stringChildren.replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </Box>;
            }

            return <code className={classNames(className, Style.code)} {...props}>
                {children}
            </code>;
        },
        a({ children, href }) {
            // console.log(children)
            if(children
                && typeof children === 'object'
                && 'type' in children
                && 'props' in children) {
                const {props, type: childrenType} = children;
                const {alt, src} = props as {alt: string, src: string};

                // && 'alt' in children['props']
                // && children['props']['alt'] === 'video'
                // const src = children['props']['src'];

                if(alt === 'video') {
                    return <video muted autoPlay poster={src} controls loop className={Style.video}>
                        <source src={href}></source>
                    </video>;
                }

                if(childrenType === 'img' && alt === 'video') {
                    return <video muted autoPlay poster={src} controls loop className={Style.video}>
                        <source src={href}></source>
                    </video>;
                }

            }
            // if (children && typeof children === 'object' && 'type' in children && children['type'] === 'img' && children['props']['alt'] === 'video') {
            //     const src = children['props']['src'];
            //     return <video muted autoPlay poster={src} controls loop className={Style.video}>
            //         <source src={href}></source>
            //     </video>;
            // }
            return <Link href={href}>{children}</Link>
            // return <a href={href}>{children}</a>
        },
        img({ node, children, ...props }) {
            // console.log(node, props);
            return <img {...props} className={Style.img} style={{maxWidth: '100%', height: 'auto'}}/>;
        },
        h1({ children }) {
            return <Typography variant="h1" gutterBottom sx={{wordBreak: 'break-all'}}>{children}</Typography>;
        },
        h2({ children }) {
            return <Typography variant="h2" gutterBottom sx={{wordBreak: 'break-all'}}>{children}</Typography>;
        },
        h3({ children }) {
            return <Typography variant="h3" gutterBottom sx={{wordBreak: 'break-all'}}>{children}</Typography>;
        },
        h4({ children }) {
            return <Typography variant="h4" gutterBottom sx={{wordBreak: 'break-all'}}>{children}</Typography>;
        },
        h5({ children }) {
            return <Typography variant="h5" gutterBottom sx={{wordBreak: 'break-all'}}>{children}</Typography>;
        },
        h6({ children }) {
            return <Typography variant="h6" gutterBottom sx={{wordBreak: 'break-all'}}>{children}</Typography>;
        },
        p({ children }) {
            return <Typography variant="body1" gutterBottom>{children}</Typography>;
        },
        blockquote({ children, node }) {
            console.log(`node`, node);
            console.log(`node children`, typeof node!.children);
            // console.log(children)
            // console.log(typeof children);
            // console.log(children);
            if(children && typeof children === 'object') {
                console.log('children', children);

                const childArray = children as Array<unknown>;
                if(childArray
                        // && childArray.length == 3
                        && childArray[0] === '\n'
                        && childArray[childArray.length - 1] === '\n'
                ) {
                    const [_, firstChildInGroup, ...leftChildrenInGroup] = childArray;

                    const leftChildrenInGroupAsObj = leftChildrenInGroup as Array<string>;

                    const {props} = firstChildInGroup as {
                        props: {
                            children: string[] | string
                        }
                    };

                    if(props && props.children && (typeof props.children === 'string' || props.children.length >= 1)) {
                        // const [firstChild, ...leftChildren] = props.children;
                        let firstChild: string;
                        let leftChildren: string[];
                        if(typeof props.children === 'string') {
                            firstChild = props.children;
                            leftChildren = [];
                        }
                        else {
                            [firstChild, ...leftChildren] = props.children;
                        }
                        console.log(`firstChild=${firstChild}`);
                        const regex = /\[!(\w+)\]\n?(.*?)$/s;
                        const matches = firstChild.match(regex);

                        if (matches) {
                            const type = matches[1]; // "NOTE"
                            const noteContent = matches[2]; // "Some Note Content Goes Here\nWith multiple lines"
                            // console.log(type, noteContent);

                            const contentBody = <Fragment>
                                <Typography variant="body1" gutterBottom component={"span"}>{noteContent}{leftChildren}</Typography>
                                {leftChildrenInGroupAsObj.length > 0 && <Typography variant="body1" gutterBottom component={"span"}>{leftChildrenInGroupAsObj}</Typography>}
                            </Fragment>;

                            switch(type.toLowerCase()) {
                                case "note":
                                    return <Note>{contentBody}</Note>;
                                case "tip":
                                    return <Tip>{contentBody}</Tip>;
                                case "important":
                                    return <Important>{contentBody}</Important>;
                                case "warning":
                                    return <Warning>{contentBody}</Warning>;
                                case "caution":
                                    return <Caution>{contentBody}</Caution>;
                                default:
                                    break;
                            }
                            // return <Tip>{noteContent}{leftChildren}</Tip>;
                        }
                    }
                }
            }
            // if(children
            //     && typeof children === 'object'
            //     && 'type' in children
            //     && 'props' in children) {
            //     const {props, type: childrenType} = children;
            //     const {alt, src} = props as {alt: string, src: string};
            // }
            return <blockquote>{children}</blockquote>;
        }
    }}>{String(children)}</Markdown>);

};
