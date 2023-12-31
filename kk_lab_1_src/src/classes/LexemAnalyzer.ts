import { skipSymbols } from "../assets";
import { Lexem, lexemType } from "./Lexem";
import { LexemError } from "./LexemError";

// Состояния конечного автомата
enum LexemAnalyzerState {
  READ = "READ",
  SKIP = "SKIP",
  NUM = "NUM",
  WORD = "WORD",
  KEYSYMBOL = "KEYSYMBOL",
  OPERATOR = "OPERATOR",
  ASSIGNSYMBOL = "ASSIGNSYMBOL",
  ERROR = "ERROR",
  FIN = "FIN",
}

// Класс лексического анализатора
export class LexemAnalyzer {
  // Хранение сформированных лексем
  private lexems: Lexem[] = [];
  // Хранение полученных ошибок
  private lexemErrors: LexemError[] = [];

  // Позиция линии
  private currentLine: number = 1;
  // Абсолютная позиция чтения в файле
  private currentPosition: number = 0;

  // Состояние конечного автомата
  private state: LexemAnalyzerState = LexemAnalyzerState.READ;

  // Переменная для хранения полученного input текста
  private text: string;
  // Текущий символ
  private char: string = "";
  // Временный буффер
  private buff: string = "";

  // В конструкторе получаем исходный текст программы и выбираем первый символ
  constructor(text: string) {
    this.text = text;
    this.char = this.text[this.currentPosition];
  }

  // Метод получения следующего символа
  private getNext() {
    // Двигаем каретку
    this.currentPosition = this.currentPosition + 1;
    // По индексу берем символ
    this.char = this.text[this.currentPosition];
  }

  // Добавление символа к буферу
  private addToBuff() {
    this.buff = this.buff + this.char;
  }

  // Очищение буферу
  private clearBuff() {
    this.buff = "";
  }

  // Добавление к лексемам
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

  // Добавление к ошибкам
  private addToLexemErrors(error: string, value: string | null) {
    this.lexemErrors.push(
      new LexemError({
        error: error,
        value: value,
        line: this.currentLine,
        position: this.currentPosition,
      })
    );
  }

  // Основная функция
  run() {
    // Цикл работает, пока состояние конечного автомата не перейдет в FIN
    while (this.state !== LexemAnalyzerState.FIN) {
      // Ветвление в зависимости от состояния
      switch (this.state) {
        // Состояние распознавания символа
        case LexemAnalyzerState.READ:
          // Если символ undefined - т.е. input закончился, то переходим в состояние FIN
          if (this.char === undefined) {
            this.state = LexemAnalyzerState.FIN;
            break;
          }

          // Если пробела/пропуска строки
          if (skipSymbols.includes(this.char)) {
            this.state = LexemAnalyzerState.SKIP;
            break;
          }

          // Если цифра
          if (isNumber(this.char)) {
            this.state = LexemAnalyzerState.NUM;
            break;
          }

          // Если буква
          if (isLetter(this.char)) {
            this.state = LexemAnalyzerState.WORD;
            break;
          }

          // Если ключевой символ
          if (isKeySymbol(this.char)) {
            this.state = LexemAnalyzerState.KEYSYMBOL;
            break;
          }

          // Если оператор (любой)
          if (lexemType.operators.includes(this.char)) {
            this.state = LexemAnalyzerState.OPERATOR;
            break;
          }

          // Если символ присваивания (точнее его начало, в моем случае ":")
          if (lexemType.assignSymbol[0].includes(this.char)) {
            this.state = LexemAnalyzerState.ASSIGNSYMBOL;
            break;
          }

          // Если никакое состояние не подошло - ошибка - неизвестный символ
          this.state = LexemAnalyzerState.ERROR;
          break;

        // Состояние пропуска из-за пробела/пропуска строки
        case LexemAnalyzerState.SKIP:
          // Если переход на след. строку, то увеличиваем счетчик строк
          if (this.char === "\n") {
            this.currentLine = this.currentLine + 1;
          }

          // На всякий случай чистим буфер и берем след символ и => READ
          this.clearBuff();
          this.getNext();
          this.state = LexemAnalyzerState.READ;
          break;

        // Состояние считывания цифры
        case LexemAnalyzerState.NUM:
          // Если очередной символ цифра - то добавляем к буфферу и считываем дальше
          if (isNumber(this.char)) {
            this.addToBuff();
            this.getNext();
            break;
          }

          // Если очередной символ - буква, то ошибка! цифры не могут содержать буквы (по БНФ)
          if (isLetter(this.char)) {
            this.addToLexemErrors("Constant can not contain letters", this.buff);
            this.clearBuff();
            this.state = LexemAnalyzerState.READ;
            break;
          }

          // Если очередной символ не буква и не цифра, то значит считываемое число закончилось
          // Добавляем лексему, чистим буфер и => READ
          this.addToLexems("constantNumbers", this.buff);
          this.clearBuff();
          this.state = LexemAnalyzerState.READ;
          break;

        // Состояние считывания ключевого слова/идентификатора
        case LexemAnalyzerState.WORD:
          // Если очередной символ буква алфавита - то добавляем к буфферу и считываем дальше
          if (isLetter(this.char)) {
            this.addToBuff();
            this.getNext();
            break;
          }

          // Если очередной символ - цифра, то ошибка! слова/идентификаторы не могут содержать цифры (по БНФ)
          if (isNumber(this.char)) {
            this.addToLexemErrors("Identifier or key word can not contain numbers", this.buff);
            this.clearBuff();
            this.state = LexemAnalyzerState.READ;
            break;
          }

          // Если ключевые слова включают считанный буфер, то добавляем в лексемы как ключ. слово, чистим буфер и => READ
          if (lexemType.keyWords.includes(this.buff)) {
            this.addToLexems("keyWords", this.buff);
            this.clearBuff();
            this.state = LexemAnalyzerState.READ;
            break;
          }

          // Если ключевые слова не включают считанный буфер, то добавляем в лексемы как идентификатор, чистим буфер и => READ
          this.addToLexems("identifier", this.buff);
          this.clearBuff();
          this.state = LexemAnalyzerState.READ;
          break;

        // Состояние считывания ключевого СИМВОЛА
        case LexemAnalyzerState.KEYSYMBOL:
          // Сразу записываем без добавления в буфер и берем след. символ, => READ
          this.clearBuff();
          this.addToBuff();
          this.getNext();
          this.addToLexems("keySymbols", this.buff);
          this.clearBuff();
          this.state = LexemAnalyzerState.READ;
          break;

        // Состояние считывания ключевого оператора
        case LexemAnalyzerState.OPERATOR:
          // Здесь тоже берем символ сразу без буфера, т.к. оператор - длиной 1

          // Если есть в операторах данный символ, то пишем
          if (lexemType.operators.includes(this.char)) {
            this.addToLexems("operators", this.char);
          }

          // Чистим буффер на всякий случай и берем след. символ, => READ
          this.clearBuff();
          this.getNext();
          this.state = LexemAnalyzerState.READ;
          break;

        // Состояние считывания оператора присваивания
        case LexemAnalyzerState.ASSIGNSYMBOL:
          // Если оператор присваивания (:=) включает данный символ и буфер не равен этому оператору,
          // то добавляем в буфер (т.к. он не из одного символа)
          if (lexemType.assignSymbol.includes(this.char) && lexemType.assignSymbol !== this.buff) {
            this.addToBuff();
            this.getNext();
            break;
          }

          // Если же он полностью равен, то добавляем в лексему, чистим буфер и => READ
          if (lexemType.assignSymbol === this.buff) {
            this.addToLexems("assignSymbol", this.buff);
            this.clearBuff();
            this.state = LexemAnalyzerState.READ;
            break;
          }

          // Если ни одно условие не прошло - ошибка
          this.addToLexemErrors(`Assign symbol must look like ${lexemType.assignSymbol}`, null);
          this.clearBuff();
          this.state = LexemAnalyzerState.READ;

        // Состояние записи ошибки (неизвестный символ)
        case LexemAnalyzerState.ERROR:
          this.addToLexemErrors(`Unexpected character`, this.char);
          this.clearBuff();
          this.state = LexemAnalyzerState.READ;
          this.getNext();

        default:
          // Если ошибка в состоянии
          console.log(`Unexpected AnalyzerState: ${this.state}`);
      }
    }

    // Объект результата
    const resultJson = {
      lexems: this.lexems,
      errors: this.lexemErrors,
    };

    // Объект результата
    const resultString = JSON.stringify(
      {
        lexems: this.lexems.map((l) => l.getLexemAsString()),
        errors: this.lexemErrors.map((e) => e.getErrorAsString()),
      },
      null,
      2
    );

    // Возвращаем результат
    return { resultJson, resultString };
  }
}

// Является ли цифрой
function isNumber(char: string) {
  return lexemType.constantNumbers.includes(char);
}

// Является ли буквой алфавита
function isLetter(char: string) {
  return lexemType.identifier.includes(char);
}

// Является ли ключевым символом
function isKeySymbol(char: string) {
  return lexemType.keySymbols.includes(char);
}
