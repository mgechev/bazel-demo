import {TokenTypes, Token} from 'lang/lexer';
/*

# Grammer

program := expression*
expression := conditional | loop | assignment | print
conditional := if (assignment) { assignment }
loop := while (assignment) { assignment }
assignment := (identifier '=')? additive ';'
additive := multiplicative ((+|-) multiplicative)*
multiplicative := term ((*|/) term)*
term := (additive) | num | identifier | -(additive)

*/

export class AST {
  constructor(public token: Token) {
    this.token = token;
  }
}

export class Print extends AST {
  constructor(token, public expression: AST) {
    super(token);
  }
}

export class If extends AST {
  constructor(token, public condition: AST, public expressions: AST) {
    super(token);
  }
}

export class While extends AST {
  constructor(token, public condition: AST, public expressions: AST) {
    super(token);
  }
}

export class Identifier extends AST {
  constructor(token, public id = token.lexeme) {
    super(token);
  }
}

export class Assignment extends AST {
  constructor(token, public id: Identifier, public expression: AST) {
    super(token);
  }
}

export class BinOp extends AST {
  public operator: string;
  constructor(token, public left: AST, public right: AST) {
    super(token);
    this.operator = token.lexeme;
  }
}

export class Num extends AST {
  constructor(token, public num = token.lexeme) {
    super(token);
  }
}

export class UnaryOp extends AST {
  public operator: string;
  constructor(token, public right: AST) {
    super(token);
    this.operator = token.lexeme;
  }
}

export class Parser {
  private pos = 0;
  constructor(public tokens: Token[]) {}
  current() {
    return this.tokens[this.pos];
  }
  end() {
    return this.pos >= this.tokens.length;
  }
  advance() {
    this.pos += 1;
  }
  back() {
    this.pos -= 1;
  }
  eat(lexeme) {
    let c = this.current();
    if (this.end()) {
      throw new Error(`Expecting "${lexeme}" but reached the end.`);
    }
    if (c.lexeme !== lexeme) {
      throw new Error(`Unexpected token "${c.lexeme}". Expected "${lexeme}" on (${c.row}, ${c.col}).`);
    }
    this.advance();
  }
  lookAhead(lexeme, type) {
    this.advance();
    let c = this.current();
    if (c.lexeme === lexeme && c.token === type) {
      this.back();
      return true;
    }
    this.back();
    return false;
  }
  parseProgram() {
    let expressions: AST[] = [];
    while (!this.end()) {
      expressions.push(this.parseExpression());
    }
    return expressions;
  }
  parseExpression() {
    let c = this.current();
    if (c.lexeme === 'if') {
      return this.parseIf();
    } else if (c.lexeme === 'while') {
      return this.parseWhile();
    } else if (c.lexeme === 'print') {
      return this.parsePrint();
    } else {
      return this.parseAssignment();
    }
  }
  parseIf() {
    return this.parseBlockStatement(If, 'if');
  }
  parseWhile() {
    return this.parseBlockStatement(While, 'while');
  }
  parseBlockStatement(ctr, op) {
    let token = this.current();
    this.eat(op);
    this.eat('(');
    let condition = this.parseAssignment();
    this.eat(')');
    this.eat('{');
    let c = this.current();
    let body: AST[] = [];
    while (c.lexeme !== '}' && !this.end()) {
      body.push(this.parseExpression());
      c = this.current();
    }
    this.eat('}');
    return new ctr(token, condition, body);
  }
  parsePrint() {
    let token = this.current();
    this.eat('print');
    let expr = this.parseAssignment();
    return new Print(token, expr);
  }
  parseAssignment() {
    let c = this.current();
    if (c.token === TokenTypes.IDENTIFIER && this.lookAhead('=', TokenTypes.OPERATOR)) {
      let id = c;
      this.advance();
      let token = this.current();
      this.eat('=');
      let result = this.parseAdditive();
      this.eat(';');
      return new Assignment(token, new Identifier(id), result);
    } else {
      let res = this.parseAdditive();
      this.eat(';');
      return res;
    }
  }
  parseAdditive() {
    let c = this.current();
    let left = this.parseMultiplicative();
    let result = left;
    let op = this.current();
    while (!this.end() && op.lexeme !== ';') {
      op = this.current();
      if (op && op.lexeme !== ';' && (op.lexeme === '+' || op.lexeme === '-')) {
        this.advance();
        result = new BinOp(op, left, this.parseAdditive());
      } else {
        break;
      }
    }
    return result;
  }
  parseMultiplicative() {
    let c = this.current();
    let left = this.parseTerm();
    let result = left;
    let op = this.current();
    while (!this.end() && op.lexeme !== ';') {
      op = this.current();
      if (op && op.lexeme !== ';' && (op.lexeme === '*' || op.lexeme === '-' || op.lexeme === '%')) {
        this.advance();
        result = new BinOp(op, left, this.parseMultiplicative());
      } else {
        break;
      }
    }
    return result;
  }
  parseTerm() {
    let c = this.current();
    this.advance();
    let result;
    if (c.lexeme === '(') {
      result = this.parseAdditive();
      this.eat(')');
    } else if (c.lexeme === '-') {
      result = new UnaryOp(c, this.parseAdditive());
    } else {
      if (c.token === TokenTypes.IDENTIFIER) {
        result = new Identifier(c);
      } else if (c.token === TokenTypes.NUM) {
        result = new Num(c);
      } else {
        throw new Error(`Unexpected token on (${c.row}, ${c.col}). Expecting term but got "${c.lexeme}".`);
      }
    }
    return result;
  }
}

