import {Lexer} from 'lang/lexer';
import {Parser} from 'lang/parser';
import {Interpreter} from 'lang/interpreter';

const program = `
foo = 43;
print foo;
`;
const lexer = new Lexer(program);
const parser = new Parser(lexer.lex());
const interpreter = new Interpreter(parser.parseProgram());
interpreter.interpret();

