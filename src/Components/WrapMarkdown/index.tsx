import Markdown, {type Options} from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Typography from '@mui/material/Typography';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { PropsWithChildren } from 'react';
import Style from './index.scss';
import classNames from 'classnames';

type MarkdownProps = Pick<Options, "disallowedElements" | "unwrapDisallowed">;

export default ({disallowedElements, unwrapDisallowed, children}: PropsWithChildren<MarkdownProps>) => {
    return (<Markdown disallowedElements={disallowedElements} unwrapDisallowed={unwrapDisallowed} remarkPlugins={[remarkGfm]} components={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');

            return !inline && match ? (
                <SyntaxHighlighter style={materialOceanic} PreTag="div" language={match[1]} {...props}>
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={classNames(className, Style.code)} {...props}>
                    {children}
                </code>
            );
        },
        a({ node, children, href, ...props }) {
            if (children && typeof children === 'object' && 'type' in children && children['type'] === 'img') {
                if (children['props']['alt'] === 'video') {
                    const src = children['props']['src'];
                    return <video muted autoPlay poster={src} controls loop className={Style.video}>
                        <source src={href}></source>
                    </video>;
                }
            }
            return <a href={href} {...props}>{children}</a>
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
    }}>{String(children)}</Markdown>);

};
