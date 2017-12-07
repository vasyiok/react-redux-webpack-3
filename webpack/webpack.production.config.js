process.env.PUBLIC_URL = '/';

module.exports = require('./make-webpack-config')({
    minimize: true,
    lint: false
});
