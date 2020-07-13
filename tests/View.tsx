import React, { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect } from 'chai';
import { describe } from 'mocha';
import { identity, pipe, flow } from 'fp-ts/lib/function';

import { 
    View,
    map, 
    concat, 
    contramap, 
    sequence, 
    empty,
    monoidReact,
} from '../src/View';

const equals = (a: ReactElement, b: ReactElement) =>
    renderToString(a) === renderToString(b);

describe('View', function () {

    type AProps = { x: number };
    const A: View<AProps> = ({ x }) => (<span>{x}</span>);

    describe('map', function () {

        it('satisfies identity', function () {

            const Left = map(identity)(A);

            const Right = identity(A);

            expect(equals(<Left x={2} />, <Right x={2} />));
            // -> <span data-reactroot="">2</span>

        });

        it('satisfies composition', function () {

            const inP = (el: ReactElement) => (<p>{el}</p>);
            const inDiv = (el: ReactElement) => (<div>{el}</div>);

            const Left = pipe(A, map(inP), map(inDiv));

            const Right = map(flow(inP, inDiv))(A);

            expect(equals(<Left x={2} />, <Right x={2} />));
            // -> <div data-reactroot=""><p><span>2</span></p></div>

        })

    });

    describe('contramap', function () {

        it('satisfies identity', function () {

            const Left = contramap(identity)(A);

            const Right = identity(A);

            expect(equals(<Left x={2} />, <Right x={2} />));
            // -> <span data-reactroot="">2</span>

        });

        it('satisfies composition', function () {

            const f = ({ x }: AProps) => ({ x: x + 4 });
            const g = ({ str }: { str: string }) => ({ x: str.length });

            const Left = pipe(A, contramap(f), contramap(g));

            const Right = contramap(flow(g, f))(A);

            expect(equals(<Left str='123' />, <Right str='123' />));
            // -> <span data-reactroot="">7</span>

        });

    });

    describe('concat', function () {

        it('is associative', function () {

            type BProps = { y: number };
            const B: View<BProps> = ({ y }) => (<span>{y}</span>);

            type CProps = { z: number };
            const C: View<CProps> = ({ z }) => (<span>{z}</span>);

            const Left = concat(A, concat(B, C));
            const Right = concat(concat(A, B), C);

            expect(equals(<Left x={2} y={3} z={4} />, <Right x={2} y={3} z={4} />));
            // -> <span>2</span><span>3</span><span>4</span>

        });

    });

    describe('empty', function () {

        it('adds nothing', function () {

            const Left = concat(A, empty());
            const Right = concat(empty(), A);

            expect(equals(<Left x={2} />, <Right x={2} />));
            // -> <span>2</span>

        });

    });

    describe('sequence', function () {

        it('is equivelent to nested concat', function () {

            type BProps = { y: number };
            const B: View<BProps> = ({ y }) => (<span>{y}</span>);

            type CProps = { z: number };
            const C: View<CProps> = ({ z }) => (<span>{z}</span>);

            const Left = sequence(A, B, C);
            const Right = concat(concat(A, B), C);

            expect(equals(<Left x={2} y={3} z={4} />, <Right x={2} y={3} z={4} />));
            // -> <span>2</span><span>3</span><span>4</span>

        });

    });

});

describe('Monoid React', function () {

    const A = <div>A</div>;

    it('combines two react elements', function () {

        const B = <div>D</div>;
        const C = <div>C</div>;

        const Left = monoidReact.concat(A, monoidReact.concat(B, C));
        const Right = monoidReact.concat(monoidReact.concat(A, B), C);

        expect(equals(Left, Right));
        // -> <div data-reactroot="">A</div><div>B</div><div>C</div>

    });

    it('has an empty element', function () {

        const E = monoidReact.empty;

        const Left = monoidReact.concat(E, A);
        const Right = monoidReact.concat(A, E);

        expect(equals(Left, Right));
        // -> <div data-reactroot="">A</div>

    });

});
