import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Typography from '@mui/material/Typography';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { PropsWithChildren } from 'react';
import Style from './index.scss';
import classNames from 'classnames';


export default ({children}: PropsWithChildren) => {
    return (<Markdown remarkPlugins={[remarkGfm]} components={{
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
                    return <video muted autoPlay poster={src} controls>
                        <source src={href}></source>
                    </video>;
                }
            }
            return <a href={href} {...props}>{children}</a>
        },
        h1({ children }) {
            return <Typography variant="h1" gutterBottom>{children}</Typography>;
        },
        h2({ children }) {
            return <Typography variant="h2" gutterBottom>{children}</Typography>;
        },
        h3({ children }) {
            return <Typography variant="h3" gutterBottom>{children}</Typography>;
        },
        h4({ children }) {
            return <Typography variant="h4" gutterBottom>{children}</Typography>;
        },
        h5({ children }) {
            return <Typography variant="h5" gutterBottom>{children}</Typography>;
        },
        h6({ children }) {
            return <Typography variant="h6" gutterBottom>{children}</Typography>;
        },
        p({ children }) {
            return <Typography variant="body1" gutterBottom>{children}</Typography>;
        },
    }}>{String(children)}</Markdown>);

};
