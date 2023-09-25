import { alphabet, integers } from "./assets";

// ТИПЫ (КЛАССЫ) ЛЕКСЕМ и их возможные значения (составные значения)
export const lexemType = {
  keyWords: ["Begin", "Var", "End"],
  keySymbols: ["(", ")", ";", ","],
  assignSymbol: ":=",
  unaryOperators: ["-"],
  binaryOperators: ["-", "+", "*", "/"],
  constantNumbers: integers,
  identifier: alphabet,
};

export type lexemType = keyof typeof lexemType;

export interface ILexem {
  value: string;
  type: lexemType;
  line: number;
  position: number;
}

// Класс лексемы
export class Lexem {
  // Значение
  private value: string;
  // Тип лексемы
  private type: lexemType;
  // Номер строки
  private line: number;
  // Абсолютная позиция в файле
  private position: number;

  constructor(lexem: ILexem) {
    this.value = lexem.value;
    this.type = lexem.type;
    this.line = lexem.line;
    this.position = lexem.position;
  }

  // Красивый вывод в строку
  getLexemAsString(): string {
    return `${this.type}: '${this.value}' (line: ${this.line} at ${this.position})`;
  }
}
