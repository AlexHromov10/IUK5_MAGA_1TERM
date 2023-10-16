import { Lexem, binaryOperators, unaryOperators, writeOutputToFile } from "lex";

// Класс синтаксического анализатора
export class SyntaxAnalyzer {
  private outputPath: string;
  // Хранение полученных лексем
  private lexems: Lexem[] = [];

  // Индекс на данный момент при чтении массива лексем
  private currentIndex: number = -1;

  // DEBUG
  private assignationCount: number = 0;

  // В конструкторе получаем список лексем программы
  constructor(lexems: Lexem[], outputPath: string) {
    this.lexems = lexems;
    this.outputPath = outputPath;
  }

  // Метод получения следующей лексемы
  private getNext() {
    // Двигаем индекс
    this.currentIndex = this.currentIndex + 1;
    // По индексу берем лексему
    return this.lexems[this.currentIndex];
    // this.currentLexem = this.lexems[this.currentIndex];
  }

  // Основная функция
  run() {
    // Первая лексема "Var"
    const varWord = this.getNext();

    // Если ее нет
    if (!varWord || (varWord.type !== "keyWords" && varWord.value !== "Var")) {
      throw this.error(`Program must start with 'Var' keyword`, varWord);
    }

    // Проверка списка идентификаторов, который должен вернуть лексему "Begin"
    const beginWord = this.identList();

    // Если ее нет
    if (!beginWord || (beginWord.type !== "keyWords" && beginWord.value !== "Begin")) {
      throw this.error(`Calculation description must start with 'Begin' keyword`, beginWord);
    }

    // Проверка присвоения, который должен вернуть лексему "End"
    let endWord = this.assignation(this.getNext());

    // Если это не лексема "End", то список присвоения не закончился
    while (endWord.type !== "keyWords" || endWord.value !== "End") {
      endWord = this.assignation(endWord);
    }

    // Если вышли из цикла - все успешно
    writeOutputToFile(this.outputPath, "Finished without errors!");
    console.log("\x1b[32m", "Finished without errors!");
  }

  // Проверка списка идентификаторов
  private identList(): any {
    // Получение идентификатора
    const ident = this.getNext();

    // Ошибка если не идентификатор
    if (!ident || ident.type !== "identifier") {
      throw this.error(`Missed identifier in identifier list`, ident);
    }

    // Получение след. лексемы
    const next = this.getNext();

    // Если она = "," или ";", то продолжаем список идентификаторов
    if (next.type === "keySymbols" && [",", ";"].includes(next.value)) {
      return this.identList();
    }

    // Если нет, то возвращаем лексему
    return next;
  }

  // Проверка присвоения
  private assignation(ident: Lexem): any {
    // DEBUG
    this.assignationCount = this.assignationCount + 1;
    // console.log(`assignation`, ident);

    // Ошибка если не идентификатор
    if (!ident || ident.type !== "identifier") {
      throw this.error(`Missed identifier in assignation`, ident);
    }

    // Получение символа присвоения
    let assignSymbol = this.getNext();

    // Ошибка если не символ присвоения
    if (!assignSymbol || assignSymbol.type !== "assignSymbol") {
      throw this.error(`Missed assign symbol`, assignSymbol);
    }

    // За символом присвоения идет проверка подвыражения (+ проверка на унарный оператор)
    const testSubExp = this.subExpression(this.checkForUnary(this.getNext()));
    // console.log("testSubExp", testSubExp);
    return testSubExp;
  }

  // Проверка подвыражения
  private subExpression(start: Lexem): any {
    // DEBUG
    // console.log(`subExpression`, start);

    // Switch по типу лексемы
    switch (start.type) {
      // Если тип константы или идентификатора, то ничего не делаем
      case "constantNumbers":
      case "identifier":
        break;

      // Если тип ключевого символа, то проверяем скобки
      case "keySymbols":
        // Ошибка если не '('
        if (start.value !== "(") {
          throw this.error(`Expected '(' in expression`, start);
        }

        // Получем след. лексему, проверяя на унарный оператор
        const next = this.checkForUnary(this.getNext());

        // Получаем след. подвыражение
        const afterSubExp = this.subExpression(next);

        // Ошибка если не ')'
        if (!afterSubExp || (afterSubExp.type !== "keySymbols" && afterSubExp.value !== ")")) {
          throw this.error(`Expected ')' in expression`, afterSubExp);
        }
        break;

      // Если ничего не подошло
      default:
        throw this.error(`Unexpected lexem`, start);
    }

    // Проверяем на бинарный оператор и выходим из подвыражения
    const testNext = this.getNext();
    // console.log("testNext", testNext);
    return this.checkForBinary(testNext);
  }

  // Проверка унарного оператора
  private checkForUnary(next: Lexem) {
    // Если тип оператор
    if (next.type === "operators") {
      // Ошибка если он не унарный
      if (!unaryOperators.includes(next.value)) {
        throw this.error(`Wrong unary operator`, next);
      }

      // Возврат след. лексемы
      return this.getNext();
    }

    // Если не было унарного оператора, то возвращаем исходную лексему
    return next;
  }

  // Проверка бинарного оператора
  private checkForBinary(next: Lexem) {
    // Если тип оператор
    if (next.type === "operators") {
      // Ошибка если он не бинарный
      if (!binaryOperators.includes(next.value)) {
        throw this.error(`Wrong binary operator`, next);
      }

      // Возврат след. подвыражения
      return this.subExpression(this.getNext());
    }

    // Если не было бинарного оператора, то возвращаем исходную лексему
    return next;
  }

  // Выброс ошибки
  private error(message: string, lexemWithError: Lexem) {
    const fullError = `${message}. At ${lexemWithError.getValueAndPositionAsString()}`;

    console.log("\x1b[31m", fullError, "\x1b[0m", "\n");
    writeOutputToFile(this.outputPath, fullError);

    throw Error(fullError);
  }
}
