const { version } = require('../package.json');

const HELP_TEXT = `Usage: cli <command> [arguments]

Commands:
  echo <message>         Print the message to stdout
  greet [name]           Greet a name (default: World)
  calc <num> <op> <num>  Calculate: operators +, -, *, /

Options:
  -h, --help             Show this help message
  -v, --version          Show version number`;

function runCLI(args) {
  const [cmd, ...rest] = args;

  if (!cmd || cmd === '--help' || cmd === '-h') {
    return { output: HELP_TEXT, exitCode: 0 };
  }

  if (cmd === '--version' || cmd === '-v') {
    return { output: version, exitCode: 0 };
  }

  if (cmd === 'echo') {
    if (rest.length === 0) {
      return { output: 'Error: echo requires a message argument', exitCode: 1 };
    }
    return { output: rest.join(' '), exitCode: 0 };
  }

  if (cmd === 'greet') {
    const name = rest[0] || 'World';
    return { output: `Hello, ${name}!`, exitCode: 0 };
  }

  if (cmd === 'calc') {
    if (rest.length !== 3) {
      return { output: 'Error: calc requires exactly 3 arguments: <num> <op> <num>', exitCode: 1 };
    }
    const [aStr, op, bStr] = rest;
    const a = Number(aStr);
    const b = Number(bStr);
    if (isNaN(a) || isNaN(b)) {
      return { output: 'Error: calc arguments must be numbers', exitCode: 1 };
    }
    let result;
    if (op === '+') result = a + b;
    else if (op === '-') result = a - b;
    else if (op === '*') result = a * b;
    else if (op === '/') {
      if (b === 0) return { output: 'Error: division by zero', exitCode: 1 };
      result = a / b;
    } else {
      return { output: `Error: unknown operator "${op}". Use +, -, *, /`, exitCode: 1 };
    }
    return { output: String(result), exitCode: 0 };
  }

  return { output: `Error: unknown command "${cmd}". Run with --help for usage.`, exitCode: 1 };
}

module.exports = { runCLI };
