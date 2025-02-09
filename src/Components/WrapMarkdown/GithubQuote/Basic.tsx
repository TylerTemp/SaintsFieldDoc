import React, { PropsWithChildren } from "react";
import Style from './Style.css';

export type Props = PropsWithChildren<{
    color: React.CSSProperties['color'];
    icon: React.ReactNode;
    title: string;
}>;

export default({color, icon, title, children}: Props) => {
    return <blockquote style={{borderLeftColor: color}} className={Style.blockquote}>
        <div className={Style.title}>
            {icon} <span className={Style.titleContent} style={{color}}>{title}</span>
        </div>
        <div>
            {children}
        </div>
    </blockquote>
}