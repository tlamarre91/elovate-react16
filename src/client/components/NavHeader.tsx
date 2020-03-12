import * as React from "react";
import {
    Link
} from "react-router-dom";

export interface NavHeaderProps {
    links: { url: string, text: string }[];
}

export const NavHeader = (props: NavHeaderProps) => {
    return props.links.map(({ url, text }, idx) => <a key={ idx } href={ url }>{ text }</a>);
}
