import React from 'react';
import { Monoid } from 'fp-ts/lib/Monoid';
import { Element, View, ViewData } from './constants';

export type { View } from './constants';

export const URI = 'View';

export type URI = typeof URI;

declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        readonly [URI]: View<A>;
    }
}

const map_: <A>(fa: View<A>, f: (a: Element) => Element) => View<A>
    = (fa, f) => (p) => f(fa(p));

const empty_: Element = <></>;

export const monoidReact: Monoid<Element> = {
    concat: (x, y) => <>{x}{y}</>,
    empty: empty_,
};

export const map: (f: (a: Element) => Element) => <A>(fa: View<A>) => View<A>
    = (f) => (fa) => (p) => f(fa(p));

export const of: (a: Element) => View<{}>
    = (a) => () => a;

export const contramap: <A, B>(f: (b: B) => A) => (fa: View<A>) => View<B>
    = (f) => (fa) => (p) => fa(f(p));

export const concat: <A, B>(a: View<A>, b: View<B>) => View<A & B>
    = (a, b) => (p) => monoidReact.concat(a(p), b(p));

export const empty: () => View<{}>
    = () => () => empty_;

export const use: <A extends object, B extends object>(vda: ViewData<A>) => (fb: View<B>) => View<Omit<B, keyof A>>
    = (vda) => (fb) => (b) => vda((a) => fb({ ...a, ...b } as any));

export function getMonoid<A>(M: Monoid<Element>): Monoid<View<A>> {
    return {
        concat: (x, y) => (p) => M.concat(x(p), y(p)),
        empty: () => M.empty,
    };
};

type ExtractT<T extends View<any>> = T extends View<infer A> ? A : never;

type ExtractTArr<T extends Array<View<any>>> = {
    [K in keyof T]: T[K] extends View<any> ? ExtractT<T[K]> : never
};

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V } ? V : never;

type ExtractUnion<T extends Array<View<any>>> = UnionToIntersection<TupleTypes<ExtractTArr<T>>>; 

export const sequence: <T extends Array<View<any>>>(...vs: T) =>
    View<ExtractUnion<T>> = (...vs) => vs.reverse().reduce(
        (acc, v) => concat(v, acc),
        () => empty_,
    );

export const view = {
    URI,
    map: map_,
}
