import { fib } from './helpers';

function *fib10() {
    let i = 0;
    for (const value of fib()) {
        yield value;
        if (++i === 10) {
            return;
        }
    }
}

describe('fib', () => {
    test('first 10 fib', () => {
        const actual: number[] = [...fib10()];
        const expected: number[] = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
        expect(actual).toStrictEqual(expected);
    });
});
