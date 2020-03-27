import React from 'react';

import { Helmet } from "react-helmet";

interface PageTitleProps {
    children: string | string[];
}

export const PageTitle: React.FC<PageTitleProps> = ({ children }) => (
    <>
        <Helmet>
            <title>{children}</title>
        </Helmet>
        <div className="pageTitle">
            <h3>{children}</h3>
        </div>
    </>
);
