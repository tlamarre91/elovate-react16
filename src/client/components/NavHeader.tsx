import * as React from 'react';
import { BrowserRouter as Router, NavLink, withRouter } from 'react-router-dom';

import { log } from '~shared/log';

export interface NavHeaderProps {
    links: { url: string; text: string }[];
    others?: Router[];
}

export const NavHeader: React.FC<NavHeaderProps> = (props) => (
    <Router>
        <nav className="navHeader">
            {props.links.map(({ url, text }) => (
                <NavLink key={url} to={url}>
                    {text}
                </NavLink>
            ))}
        </nav>
    </Router>
);
