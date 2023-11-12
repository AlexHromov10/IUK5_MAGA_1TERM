type postfixStackEntry = {
  value: string;
  type: "operator" | "left bracket" | "right bracket" | "operand";
};

// Приоритет операторов
const operatorPriority = {
  "-": 1,
  "+": 1,
  "*": 2,
  "/": 2,
  "~": 3, // Унарный минус
};

export class PostfixGenerator {
  private postfixStringsArray: string[] = [];
  private postfixString = "";
  private postfixStack: postfixStackEntry[] = [];

  // Вернуть все полученные строки постфиксной записи
  public getPostfixStringsArray() {
    return this.postfixStringsArray;
  }

  /*

    Алгоритм Дейкстры:

    1. Проанализировать очередной элемент на входе.
    2. Если это операнд, передать его на выход.
    3. Если это «(», поместить ее в стек.
    4. Если это операция, то:
            ■ если стек пуст, поместить операцию в стек;
            ■ если в вершине стека «(», поместить операцию в стек;
            ■ если у входной операции приоритет выше, чем у операции в вершине стека, поместить в стек новую операцию;
            ■ в противном случае — извлечь операцию из стека и отправить ее на выход, а затем повторить шаг 4.
    5. Если это «)», извлекать из стека операции на выход до тех пор, пока в вершине стека не окажется «(». Извлечь «(» из стека и уничтожить.
    6. Если на входе еще есть элементы, перейти к шагу 1.
    7. Если на входе нет элементов, выталкивать из стека все операции на выход.
  
  */

  // 1. Проанализировать очередной элемент на входе.
  // или
  // 6. Если на входе еще есть элементы, перейти к шагу 1.
  public toPostfixNext(value: string, type: postfixStackEntry["type"]) {
    switch (type) {
      // 2. Если это операнд, передать его на выход.
      case "operand":
        this.pushToPostfixString(value);
        break;

      // 3. Если это «(», поместить ее в стек.
      case "left bracket":
        this.postfixStack.push({ value, type });
        break;

      // 4. Если это операция, то:
      case "operator":
        let popFromStack = true;

        // Цикл, на случай, если ни одно условие не прошло
        while (popFromStack) {
          if (!Object.keys(operatorPriority).includes(value)) {
            throw Error("DEBUG: Wrong operator!");
          }

          // Элемент с вершины стыка
          const topStackEntry = this.postfixStack.at(-1);

          if (
            // если стек пуст, поместить операцию в стек;
            !topStackEntry ||
            // если в вершине стека «(», поместить операцию в стек;
            topStackEntry.type === "left bracket" ||
            // если у входной операции приоритет выше, чем у операции в вершине стека, поместить в стек новую операцию;
            operatorPriority[value as keyof typeof operatorPriority] >
              operatorPriority[topStackEntry.value as keyof typeof operatorPriority]
          ) {
            // Помещаем операцию в стек и выходим из цикла
            this.postfixStack.push({ type, value });
            popFromStack = false;
            continue;
          }

          // в противном случае — извлечь операцию из стека и отправить ее на выход, а затем повторить шаг 4.
          this.pushToPostfixString(this.postfixStack.pop()!.value);
        }
        break;

      // 5. Если это «)», извлекать из стека операции на выход до тех пор, пока в вершине стека не окажется «(». Извлечь «(» из стека и уничтожить.
      case "right bracket":
        let notLeftBracket = true;
        while (notLeftBracket) {
          const poppedElement = this.postfixStack.pop()!;

          if (poppedElement.type === "left bracket") {
            notLeftBracket = false;
            continue;
          }

          this.pushToPostfixString(poppedElement.value);
        }
        break;

      default:
        break;
    }
  }

  // 7. Если на входе нет элементов, выталкивать из стека все операции на выход.
  public endToPostfix() {
    while (this.postfixStack.length !== 0) {
      this.pushToPostfixString(this.postfixStack.pop()!.value);
    }

    this.postfixStringsArray.push(this.postfixString.trim().replace("~", "-")); // Меняем ~ который мы приняли за унарный минус - на обычный минус
    this.postfixString = ""; // Обнуляем строку
  }

  private pushToPostfixString(value: string) {
    this.postfixString = this.postfixString + " " + value;
  }
}
