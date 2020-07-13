import React from 'react';
import { renderToString } from 'react-dom/server';
import { pipe } from 'fp-ts/lib/function';

import * as V from '../src/View';
import * as VD from '../src/ViewData';

type GreetingProps = {
    name: string;
};

const Greeting: V.View<GreetingProps> = ({ name }) => (
    <div className='greeting'>
        <h1>{name}</h1>
        <p>Here are your contacts:</p>
    </div>
);

type Contact = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

type ContactListProps = {
    contacts: Contact[];
};

const ContactList: V.View<ContactListProps> =
    ({ contacts }) => (
        <ul className='contact-list'>
            {contacts.map((c) => (
                <li key={c.id}>
                    <h3>{c.name}</h3>
                    <p>Email: {c.email}</p>
                    <p>Phone: {c.phone}</p>
                </li>
            ))}
        </ul>
    );

const AppData = pipe(
    VD.of({
        name: {
            first: 'crook',
            last: 'nyah',
        },
        contacts: [
            {
                id: 1,
                name: 'person 1',
                email: 'person1@gmail.com',
                phone: '8311234567',
            },
            {
                id: 2,
                name: 'person 2',
                email: 'person2@gmail.com',
                phone: '8311234567',
            },
            {
                id: 3,
                name: 'person 3',
                email: 'person3@gmail.com',
                phone: '8311234567',
            },
        ],
    }),
    VD.map(({ contacts, name }) => ({
        name: `${name.first} ${name.last}`,
        contacts,
    })),
);

const App = pipe(
    V.sequence(
        Greeting,
        ContactList,
    ),
    V.map((el) => (<div className='app'>{el}</div>)),
    V.use(AppData),
);

const res = renderToString(<App />);

console.log(res);

//  <div class="app" data-reactroot="">
//      <div class="greeting">
//          <h1>crook nyah</h1>
//          <p>Here are your contacts:</p>
//      </div>
//      <ul class="contact-list">
//          <li>
//              <h3>person 1</h3>
//              <p>Email: <!-- -->person1@gmail.com</p>
//              <p>Phone: <!-- -->8311234567</p>
//          </li>
//          ...