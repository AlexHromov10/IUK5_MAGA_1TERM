import { alphabet, integers, skipSymbols } from "./assets";

const lexemType = {
  keyWords: ["Begin", "Var", "End", "(", ")", ";"],
  assignSymbol: ":=",
  unaryOperators: ["-"],
  binaryOperators: ["-", "+", "*", "/"],
  constantNumbers: integers,
  identifier: alphabet,
};

type lexemType = keyof typeof lexemType;

export interface ILexem {
  value: string;
  type: lexemType;
  line: number;
  position: number;
}

export class Lexem {
  private value: string;
  private type: lexemType;
  private line: number;
  private position: number;

  constructor(lexem: ILexem) {
    this.value = lexem.value;
    this.type = lexem.type;
    this.line = lexem.line;
    this.position = lexem.position;
  }

  getLexemAsString(): string {
    return `${this.type}: "${this.value}" (line: ${this.line} at ${this.position})`;
  }
}

export interface ILexemError {
  value: string;
  error: string;
  line: number;
  position: number;
}

export class LexemError {
  private value: string;
  private error: string;
  private line: number;
  private position: number;

  constructor(error: ILexemError) {
    this.value = error.value;
    this.error = error.error;
    this.line = error.line;
    this.position = error.position;
  }

  getErrorAsString(): string {
    return `${this.error}: "${this.value}" (line: ${this.line} at ${this.position})`;
  }
}

enum AnalyzerState {
  READ,
  SKIP,
  NUM,
  WORD,
  OPERATOR,
  ASSIGNSYMBOL,
  ERROR,
  FIN,
}

export class Analyzer {
  private lexems: Lexem[] = [];
  private lexemErrors: LexemError[] = [];

  private currentLine: number = 1;
  private currentPosition: number = 0;

  private state: AnalyzerState = AnalyzerState.READ;

  private text: string;
  private char: string = "";
  private buff: string = "";

  constructor(text: string) {
    this.text = text;
    this.char = this.text[this.currentPosition];
  }

  private getNext() {
    this.currentPosition = this.currentPosition + 1;
    this.char = this.text[this.currentPosition];
  }

  private addToBuff() {
    this.buff = this.buff + this.char;
  }

  private clearBuff() {
    this.buff = "";
  }

  private addToLexems(type: lexemType, value: string) {
    this.lexems.push(
      new Lexem({
        type: type,
        value: value,
        line: this.currentLine,
        position: this.currentPosition,
      })
    );
  }

  private addToLexemErrors(error: string, value: string) {
    this.lexemErrors.push(
      new LexemError({
        error: error,
        value: value,
        line: this.currentLine,
        position: this.currentPosition,
      })
    );
  }

  analyze() {
    while (this.state !== AnalyzerState.FIN) {
      console.log(`STATE: ${this.state}`);

      switch (this.state) {
        case AnalyzerState.READ:
          // Окончание
          if (this.char === undefined) {
            this.state = AnalyzerState.FIN;
            break;
          }

          // Если пробела/пропуска строки
          if (skipSymbols.includes(this.char)) {
            this.state = AnalyzerState.SKIP;
            break;
          }

          // Если цифра
          if (isNumber(this.char)) {
            this.state = AnalyzerState.NUM;
            break;
          }

          // Если буква
          if (isLetter(this.char)) {
            this.state = AnalyzerState.WORD;
            break;
          }

          // Если оператор (любой)
          if ([...lexemType.binaryOperators, lexemType.unaryOperators].includes(this.char)) {
            this.state = AnalyzerState.OPERATOR;
            break;
          }

          // Если символ присваивания
          if (lexemType.assignSymbol[0].includes(this.char)) {
            this.state = AnalyzerState.ASSIGNSYMBOL;
            break;
          }

          this.state = AnalyzerState.ERROR;
          break;

        // Состояние пропуска из-за пробела/пропуска строки
        case AnalyzerState.SKIP:
          // Если переход на след. строку
          if (this.char === "\n") {
            this.currentLine = this.currentLine + 1;
          }

          this.clearBuff();
          this.state = AnalyzerState.READ;
          this.getNext();
          break;

        // Состояние считывания цифры
        case AnalyzerState.NUM:
          if (isNumber(this.char)) {
            this.addToBuff();
            this.getNext();
            break;
          }

          if (isLetter(this.char)) {
            this.addToLexemErrors("Constant can not contain letters", this.buff);
            this.clearBuff();
            this.state = AnalyzerState.READ;
            this.getNext();
            break;
          }

          this.addToLexems("constantNumbers", this.buff);
          this.clearBuff();
          this.state = AnalyzerState.READ;
          this.getNext();
          break;

        case AnalyzerState.WORD:
          if (isLetter(this.char)) {
            this.addToBuff();
            this.getNext();
            break;
          }

          if (isNumber(this.char)) {
            this.addToLexemErrors("Identifier or key word can not contain numbers", this.buff);
            this.clearBuff();
            this.state = AnalyzerState.READ;
            this.getNext();
            break;
          }

          if (lexemType.keyWords.includes(this.buff)) {
            this.addToLexems("keyWords", this.buff);
          } else {
            this.addToLexems("identifier", this.buff);
          }

          this.clearBuff();
          this.state = AnalyzerState.READ;
          this.getNext();
          break;

        case AnalyzerState.OPERATOR:
          if (lexemType.binaryOperators.includes(this.char)) {
            this.addToLexems("binaryOperators", this.char);
          }

          if (lexemType.unaryOperators.includes(this.char)) {
            this.addToLexems("unaryOperators", this.char);
          }

          this.clearBuff();
          this.state = AnalyzerState.READ;
          this.getNext();
          break;

        case AnalyzerState.ASSIGNSYMBOL:
          if (lexemType.assignSymbol.includes(this.char)) {
            this.addToBuff();
            this.getNext();
            break;
          }

          if (lexemType.assignSymbol === this.buff) {
            this.addToLexems("assignSymbol", this.buff);
            this.clearBuff();
            this.state = AnalyzerState.READ;
            this.getNext();
            break;
          }

          this.addToLexemErrors(`Assign symbol must be looking like :${lexemType.assignSymbol}`, this.buff);
          this.clearBuff();
          this.state = AnalyzerState.READ;
          this.getNext();

        case AnalyzerState.ERROR:
          this.addToLexemErrors(`Unexpected character`, this.char);
          this.clearBuff();
          this.state = AnalyzerState.READ;
          this.getNext();

        default:
          // Почему-то ошибка
          console.log(`Unexpected AnalyzerState: ${this.state}`);
        // throw new Error(`Unexpected AnalyzerState: ${this.state}`);
      }
    }

    // ОКОНЧАНИЕ:
    console.log(
      "LEXEMS:",
      this.lexems.map((l) => l.getLexemAsString())
    );
    console.log(
      "ERRORS:",
      this.lexemErrors.map((e) => e.getErrorAsString())
    );
  }
}

function isNumber(char: string) {
  return lexemType.constantNumbers.includes(char);
}

function isLetter(char: string) {
  return lexemType.identifier.includes(char);
}
