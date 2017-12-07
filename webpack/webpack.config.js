'use strict';

process.env.BABEL_ENV = 'development';

module.exports = require('./make-webpack-config')({
    dev: true,
    debug: true,
    hotReloading: true,
    lint: true
});
