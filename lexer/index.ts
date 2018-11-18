export enum TokenTypes {
  PAR,
  BLOCK,
  NUM,
  OPERATOR,
  IDENTIFIER,
  KEYWORD,
  SEMICOLON
};

export class Token {
  constructor(public token: TokenTypes, public lexeme: string|number, public col: number, public row: number) {}
}

export class Lexer {
  private col = 0;
  private row = 0;
  private current = 0;
  private strMap: number[] = [];
  constructor(private str: string) {
    let col = 0;
    let row = 0;
    for (let i = 0; i < str.length; i += 1) {
      if (str[i] === '\n') {
        this.strMap[row] = col - 1;
        col = 0;
        row += 1;
      } else {
        col += 1;
      }
    }
  }
  advance() {
    this.col += 1;
    this.current += 1;
  }
  back() {
    this.col -= 1;
    if (this.col < 0) {
      this.row -= 1;
      this.col = this.strMap[this.row];
    }
    this.current -= 1;
  }
  done() {
    return this.current >= this.str.length;
  }
  currentChar() {
    return this.str[this.current];
  }
  isDigit() {
    return /^\d$/.test(this.currentChar());
  }
  isOperator() {
    return /^[*/+-=%]$/.test(this.currentChar());
  }
  isPar() {
    return /^\(|\)$/.test(this.currentChar());
  }
  isBlockPar() {
    return /^\{|\}$/.test(this.currentChar());
  }
  isKeyword(str: string) {
    return /^if|while|print$/.test(str);
  }
  isChar() {
    return /^[a-zA-Z_\-]$/.test(this.currentChar());
  }
  readCharSequence() {
    let str = '';
    while (this.isChar()) {
      str += this.currentChar();
      this.advance();
    }
    this.back();
    return str;
  }
  readNumber() {
    let num = '';
    while (this.isDigit()) {
      num += this.currentChar();
      this.advance();
    }
    this.back();
    return parseInt(num, 10);
  }
  skipWhitespace() {
    while (this.isWhitespace()) {
      this.advance();
    }
    this.back();
  }
  isWhitespace() {
    return /^\s$/.test(this.currentChar());
  }
  isNewline() {
    return /^\n$/.test(this.currentChar());
  }
  isSemicolon() {
    return this.currentChar() === ';';
  }
  lex() {
    let tokens: Token[] = [];
    while (!this.done()) {
      let current = this.current;
      let col = this.col;
      let lexeme;
      let token: Token | undefined = undefined;
      if (this.isDigit()) {
        lexeme = this.readNumber();
        token = new Token(TokenTypes.NUM, lexeme, col, this.row);
      } else if (this.isOperator()) {
        lexeme = this.currentChar();
        token = new Token(TokenTypes.OPERATOR, lexeme, col, this.row);
      } else if (this.isPar()) {
        lexeme = this.currentChar();
        token = new Token(TokenTypes.PAR, lexeme, col, this.row);
      } else if (this.isChar()) {
        lexeme = this.readCharSequence();
        let type = TokenTypes.IDENTIFIER;
        if (this.isKeyword(lexeme)) {
          type = TokenTypes.KEYWORD;
        }
        token = new Token(type, lexeme, col, this.row);
      } else if (this.isNewline()) {
        this.row += 1;
        this.col = 0;
      } else if (this.isSemicolon()) {
        token = new Token(TokenTypes.SEMICOLON, ';', col, this.row);
      } else if (this.isBlockPar()) {
        token = new Token(TokenTypes.BLOCK, this.currentChar(), col, this.row);
      } else if (this.isWhitespace()) {
         this.skipWhitespace();
      } else {
        throw new Error(`Unknown token type at (${this.row}, ${this.col}) row ${this.currentChar()}`);
      }
      if (token !== undefined) {
        tokens.push(token);
      }
      this.advance();
    }
    return tokens;
  }
}

