'use strict';

module.exports = require('cors-anywhere').createServer({
    originWhitelist: ['localhost'], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
});