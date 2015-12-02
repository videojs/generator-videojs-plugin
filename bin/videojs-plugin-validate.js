#!/usr/bin/env node

var test = require('tape');
var faucet = require('faucet');

test.createStream().pipe(faucet()).pipe(process.stdout);
require('../es5/validate.js');
