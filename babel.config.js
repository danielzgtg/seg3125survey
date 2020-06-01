module.exports = api => {
    const test = api.env('test');
    api.cache.forever();
    console.log("testmode:", test);
    return {
        presets: [
            ['@babel/preset-env', {
                useBuiltIns: false,
                spec: true,
                modules: test && 'commonjs',
                ...(test ? {
                    targets: {
                        node: 'current',
                    },
                } : {}),
            }],
        ],
        plugins: [
            ['@babel/plugin-transform-runtime', {
                regenerator: false,
                version: '^7.10.2',
            }],
        ],
    };
};
