/* eslint no-console: off */
import github from './github';



// Register all hooks here
github.webhooks.on('check_suite.requested', require('./hooks/check-suite-request'));

module.exports = require('http').createServer(github.webhooks.middleware);
