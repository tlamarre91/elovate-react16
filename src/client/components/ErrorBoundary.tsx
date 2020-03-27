import React from 'react';
import { log } from '~shared/log';

interface ErrorBoundaryProps {
    children: JSX.Element | JSX.Element[];
}

interface ErrorBoundaryState {
    hasError: boolean;
    caughtError: Error;
}

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, caughtError: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, caughtError: error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        log.error(JSON.stringify({ error, errorInfo }, null, 2));
    }

    render() {
        if (this.state.hasError) {
            return <div className="oops">OOPSIE WOOPSIE</div>;
        }

        return this.props.children;
    }
}
