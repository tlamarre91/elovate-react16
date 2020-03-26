// TODO: clean up this mess :\
import React from 'react';
import {
    NavLink,
} from 'react-router-dom';

import { log } from '~shared/log';

export class NavMapRecord {
    data: { [name: string]: { text: string, path: string }[] };

    constructor() {
        this.data = {};
    }

    set(name: string, items: { text: string, path: string }[]) {
        this.data[name] = items;
    }

    remove(name: string) {
        delete this.data[name];
    }

    get(name: string) {
        return this.data[name];
    }

    items(): { text: string, path: string }[] {
        const items: { text: string, path: string }[] = [];
        for (const k in this.data) {
            items.push(...this.data[k]);
        }

        return items;
    }
}

class NavMapState {
}

class NavMapProps {
    name: string;

    items: { text: string, path: string }[];

    record: NavMapRecord
}

export class NavMap extends React.Component<NavMapProps, NavMapState> {
    constructor(props: NavMapProps) {
        super(props);
    }

    componentDidMount() {
        const { name, items, record } = this.props;
        log.info(`mount: ${name}`);
        record.set(name, items);
    }

    componentWillUnmount() {
        const { name, record } = this.props;
        log.info(`unmount: ${name}`);
        record.remove(name);
    }

    render() {
        return <></>;
    }
}

interface NavMapDisplayProps {
    items: { text: string, path: string }[];
}

export const NavMapDisplay: React.FC<NavMapDisplayProps> = (props) => {
    const { items } = props;
    return (
        <>
            { items.map(({ text, path }) => <NavLink key={`${name}-${text}-${path}`} to={path}>{ text }</NavLink>) }
      </>
    );
};
