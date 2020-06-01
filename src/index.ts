import './style.scss';
import { fib } from './helpers';

// noinspection SpellCheckingInspection
const y: any = 'abcde';

for (const x of y) {
    // eslint-disable-next-line no-console
    console.log(x);
}

const seq = fib();
// eslint-disable-next-line no-console
console.log(seq.next(), seq.next(), seq.next());
