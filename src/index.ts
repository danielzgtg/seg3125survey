import './style.scss';
import { fib } from './helpers'

const y: any = "abcde";

for (const x of y) {
    console.log(x);
}

const seq = fib();
console.log(seq.next(), seq.next(), seq.next());
