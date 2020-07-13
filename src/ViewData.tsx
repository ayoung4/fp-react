import { ViewData } from './constants';

export type { ViewData } from './constants';

export const URI = 'ViewData';

export type URI = typeof URI;

declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        readonly [URI]: ViewData<A>;
    }
}

export const map: <A, B>(f: (a: A) => B) => (fa: ViewData<A>) => ViewData<B>
    = (f) => (fa) => (r) => fa((p) => r(f(p)));

export const chain: <A, B>(f: (a: A) => ViewData<B>) => (fa: ViewData<A>) => ViewData<B>
    = (f) => (fa) => (r) => fa((p) => f(p)(r));

export const of: <A>(a: A) => ViewData<A>
    = (a) => (r) => r(a);

export const concat: <A, B>(fa: ViewData<A>, fb: ViewData<B>) => ViewData<A & B>
    = (fa, fb) => (r) => fa((a) => fb((b) => r({ ...a, ...b })));

export const combine = <
    VD extends { [key: string]: ViewData<T> },
    T
>(srcs: VD) =>
    Object.keys(srcs)
        .reduce<ViewData<{
            [key in keyof VD]:
            VD[key] extends ViewData<infer U>
            ? U
            : never;
        }>>(
            (acc, key) => concat(
                acc,
                map((props) => ({
                    [key]: props,
                }))(srcs[key]),
            ),
            of({} as any),
        );
