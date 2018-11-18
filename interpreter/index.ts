/**
 * Mini-programming language.
 * Turing complete so it'll rule the world!
 */
import {AST, BinOp, Num, If, While, Assignment, UnaryOp, Print, Identifier} from 'lang/parser';

export class Interpreter {
  private symbolTable: {[key: string]: Identifier} = {};
  constructor(private ast: AST[]) {}
  interpret() {
    return this.visit(this.ast);
  }
  visit(ast) {
    if (ast instanceof Array) {
      ast.forEach(this._visit.bind(this));
    } else {
      return this._visit(ast);
    }
  }
  _visit(ast) {
    if (ast instanceof BinOp) {
      return this.visitBinOp(ast);
    } else if (ast instanceof Num) {
      return this.visitNum(ast);
    } else if (ast instanceof If) {
      return this.visitIf(ast);
    } else if (ast instanceof While) {
      return this.visitWhile(ast);
    } else if (ast instanceof Assignment) {
      return this.visitAssignment(ast);
    } else if (ast instanceof UnaryOp) {
      return this.visitUnaryOp(ast);
    } else if (ast instanceof Identifier) {
      return this.visitIdentifier(ast);
    } else if (ast instanceof Print) {
      return this.visitPrint(ast);
    } else {
      throw new Error('Unsupported AST node');
    }
  }
  visitPrint(ast) {
    console.log(this.visit(ast.expression));
  }
  visitIf(ast) {
    let result = this.visit(ast.condition);
    if (result) {
      ast.expressions
        .forEach(this.visit.bind(this));
    }
  }
  visitWhile(ast) {
    while (this.visit(ast.condition)) {
      ast.expressions
        .forEach(this.visit.bind(this));
    }
  }
  visitAssignment(ast) {
    let id = ast.id;
    if (!id) {
      console.log(ast);
    }
    this.symbolTable[id.id] = this.visit(ast.expression);
  }
  visitUnaryOp(ast) {
    let operator = ast.operator;
    if (operator === '-') {
      return - this.visit(ast.right);
    }
  }
  visitIdentifier(ast) {
    return this.symbolTable[ast.id];
  }
  visitNum(ast) {
    return ast.num;
  }
  visitBinOp(ast) {
    switch (ast.operator) {
      case '+':
        return this.visit(ast.left) + this.visit(ast.right);
        break;
      case '-':
        return this.visit(ast.left) - this.visit(ast.right);
        break;
      case '/':
        return this.visit(ast.left) / this.visit(ast.right);
        break;
      case '*':
        return this.visit(ast.left) * this.visit(ast.right);
        break;
      case '%':
        return this.visit(ast.left) % this.visit(ast.right);
        break;
    }
  }
}

