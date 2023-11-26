import { Lexem, binaryOperators, unaryOperators } from "lex";
import { identifierSyntax } from "src/types";
import { PostfixGenerator } from "./PostfixGenerator";

// Класс синтаксического анализатора
export class SyntaxAnalyzer {
  // Хранение полученных лексем
  private lexems: Lexem[] = [];

  // Индекс на данный момент при чтении массива лексем
  private currentIndex: number = -1;

  // POSTFIX: Инициализация
  private postfixGenerator = new PostfixGenerator();

  // Список всех идентификаторов
  private identifiers: identifierSyntax[] = [];

  // В конструкторе получаем список лексем программы
  constructor(lexems: Lexem[]) {
    this.lexems = lexems;
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
    console.log("\x1b[32m", "Finished without errors!");

    // Возвращаем все идентификаторы и записи постфикс
    return {
      result: "Finished without errors!",
      identifiers: this.identifiers.map((i) => i.title),
      postfixExpressions: this.postfixGenerator.getPostfixExpressions(),
    };
  }

  // Проверка списка идентификаторов
  private identList(): any {
    // Получение идентификатора
    const ident = this.getNext();

    // Ошибка если не идентификатор
    if (!ident || ident.type !== "identifier") {
      throw this.error(`Missed identifier in identifier list`, ident);
    }

    // Добавляем в список идентификаторов
    this.identifiers.push({ title: ident.value, isAssigned: false });

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
    // Ошибка если не идентификатор
    if (!ident || ident.type !== "identifier") {
      throw this.error(`Missed identifier in assignation`, ident);
    }

    // Ищем идентификатор в списке идентификаторов
    const identInIdentifierList = this.identifiers.find((i) => i.title === ident.value);

    // Если его нет в списке - ошибка
    if (!identInIdentifierList) {
      throw this.error(`Identifier is not identified`, ident);
    }

    // Меняем что он присвоен
    this.identifiers = this.identifiers.map((i) =>
      i.title === identInIdentifierList.title ? { ...identInIdentifierList, isAssigned: true } : i
    );

    // Начало постфиксной записи
    this.postfixGenerator.startToPostfix(ident.value);

    // Получение символа присвоения
    let assignSymbol = this.getNext();

    // Ошибка если не символ присвоения
    if (!assignSymbol || assignSymbol.type !== "assignSymbol") {
      throw this.error(`Missed assign symbol`, assignSymbol);
    }

    // За символом присвоения идет проверка подвыражения (+ проверка на унарный оператор)
    const testSubExp = this.subExpression(this.checkForUnary(this.getNext()));

    // POSTFIX - Окончание строки - окончание постфиксной записи
    this.postfixGenerator.endToPostfix();

    return testSubExp;
  }

  // Проверка подвыражения
  private subExpression(start: Lexem): any {
    // Switch по типу лексемы
    switch (start.type) {
      // Если тип константы или идентификатора, то ничего не делаем
      case "constantNumbers":
        // POSTFIX: Добавление в postfix константы или идентификатора
        this.postfixGenerator.toPostfixNext(start.value, "operand");
        break;
      case "identifier":
        // POSTFIX: Добавление в postfix константы или идентификатора
        this.postfixGenerator.toPostfixNext(start.value, "operand");

        // Если это идентификатор - то ищем его в списке идентификаторов
        const identInIdentifierList = this.identifiers.find((i) => i.title === start.value);

        // Если его нет в списке - ошибка
        if (!identInIdentifierList) {
          throw this.error(`Identifier is not identified`, start);
        }

        // Если он есть, но без значения - ошибка
        if (identInIdentifierList.isAssigned == false) {
          throw this.error(`Identifier is not assigned`, start);
        }

        break;

      // Если тип ключевого символа, то проверяем скобки
      case "keySymbols":
        // Ошибка если не '('
        if (start.value !== "(") {
          throw this.error(`Expected '(' in expression`, start);
        }

        // POSTFIX: Добавление в postfix "("
        this.postfixGenerator.toPostfixNext(start.value, "left bracket");

        // Получем след. лексему, проверяя на унарный оператор
        const next = this.checkForUnary(this.getNext());

        // Получаем след. подвыражение
        const afterSubExp = this.subExpression(next);

        // Ошибка если не ')'
        if (!afterSubExp || (afterSubExp.type !== "keySymbols" && afterSubExp.value !== ")")) {
          throw this.error(`Expected ')' in expression`, afterSubExp);
        }

        // POSTFIX: Добавление в postfix ")"
        this.postfixGenerator.toPostfixNext(afterSubExp.value, "right bracket");

        break;

      // Если ничего не подошло
      default:
        throw this.error(`Unexpected lexem`, start);
    }

    // Проверяем на бинарный оператор и выходим из подвыражения
    const testNext = this.getNext();
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

      // POSTFIX: Добавление в postfix унарное отрицание (тильда)
      this.postfixGenerator.toPostfixNext("~", "operator");

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

      // POSTFIX: Добавление в postfix бинарное оператора
      this.postfixGenerator.toPostfixNext(next.value, "operator");

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

    throw Error(fullError);
  }
}
