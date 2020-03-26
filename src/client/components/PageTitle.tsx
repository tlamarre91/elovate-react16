import React from 'react';

interface PageTitleProps {
    children: JSX.Element | JSX.Element[] | string | string[];
}

export const PageTitle: React.FC<PageTitleProps> = ({ children }) => (
    <div className="pageTitle">
        <h3>
            { children }
      </h3>
  </div>
);
