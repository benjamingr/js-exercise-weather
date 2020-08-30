'use strict';

const port = 1337;
require('http-server').createServer({ 
    cache: -1,
    proxy: 'https://api.darksky.net/forecast/557ecd4b8c8bbba02f4a50afe884934b'
 }).listen(port);

console.log('Dev server running at port', port)