
// noinspection JSUnusedGlobalSymbols
export function unused() {
    return "Hi";
}

export function *fib() {
    let a = 0;
    let b = 1;
    while (true) {
        const c = a + b;
        a = b;
        b = c;
        yield c;
    }
}
