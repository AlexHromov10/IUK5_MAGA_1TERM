export interface ILexemError {
  value: string | null;
  error: string;
  line: number;
  position: number;
}

// Класс ошибки лексемы
export class LexemError {
  // Значение
  private value: string | null;
  // Описание ошибки
  private error: string;
  // Номер строки
  private line: number;
  // Абсолютная позиция в файле
  private position: number;

  constructor(error: ILexemError) {
    this.value = error.value;
    this.error = error.error;
    this.line = error.line;
    this.position = error.position;
  }

  // Красивый вывод в строку
  getErrorAsString(): string {
    return `${this.error}${this.value ? `: '${this.value}'` : ""} (line: ${this.line} at ${this.position})`;
  }
}
