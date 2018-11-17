import {Lexer} from './lexer';
import {Parser} from './parser';
import {Interpreter} from './interpreter';

let program = `
foo = 42;
print foo;
`;
let lexer = new Lexer(program);
let parser = new Parser(lexer.lex());
let interpreter = new Interpreter(parser.parseProgram());
interpreter.interpret();

