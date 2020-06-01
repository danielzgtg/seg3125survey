
// noinspection JSUnusedGlobalSymbols
export function unused(): unknown {
    return 'Hi';
}

export function *fib(): Generator<number, void, void> {
    let a = 0;
    let b = 1;
    yield a;
    yield b;
    while (true) {
        const c = a + b;
        a = b;
        b = c;
        yield c;
    }
}
