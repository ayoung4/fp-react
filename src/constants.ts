import { ReactElement, PropsWithChildren } from 'react';

export type Element = ReactElement;

export interface View<A> {
    (p: PropsWithChildren<A>): Element;
}

export interface ViewData<A> {
    (r: (a: A) => ReactElement): Element;
}
