import { alphabet, assignSymbol, binaryOperators, integers, keySymbols, keyWords, unaryOperators } from "../assets";

// ТИПЫ (КЛАССЫ) ЛЕКСЕМ и их возможные значения (составные значения)
export const lexemType = {
  keyWords: keyWords,
  keySymbols: keySymbols,
  assignSymbol: assignSymbol,
  operators: [...unaryOperators, ...binaryOperators],
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
  public value: string;
  // Тип лексемы
  public type: lexemType;
  // Номер строки
  public line: number;
  // Абсолютная позиция в файле
  public position: number;

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

  // Красивый вывод в строку (укороченный)
  getValueAndPositionAsString(): string {
    return `'${this.value}' (line: ${this.line} at ${this.position})`;
  }
}
