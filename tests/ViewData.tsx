import React, { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect } from 'chai';
import { describe } from 'mocha';
import { identity, pipe, flow } from 'fp-ts/lib/function';

import {
    map,
    of,
    chain,
    combine,
    concat,
    ViewData
} from '../src/ViewData';
import { View } from '../src/View';

const equals = (a: ReactElement, b: ReactElement) =>
    renderToString(a) === renderToString(b);

describe('View Data', function () {

    const D = of({ x: 2 })

    type AProps = { x: number };
    const A: View<AProps> = ({ x }) => (<span>{x}</span>);

    describe('map', function () {

        it('satisfies identity', function () {

            const Left = map(identity)(D)(A);
            const Right = identity(D)(A);

            expect(equals(Left, Right));
            // -> <span data-reactroot="">2</span>

        });

        it('satisfies composition', function () {

            const double = ({ x }) => ({ x: x * 2 });
            const add10 = ({ x }) => ({ x: x + 10 });

            const Left = pipe(D, map(double), map(add10))(A);

            const Right = pipe(D, map(flow(double, add10)))(A);

            expect(equals(Left, Right));
            // -> <span data-reactroot="">14</span>

        })

    });

});
