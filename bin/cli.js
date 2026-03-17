#!/usr/bin/env node
const { runCLI } = require('../src/cli');

const args = process.argv.slice(2);
const { output, exitCode } = runCLI(args);
console.log(output);
process.exit(exitCode);
