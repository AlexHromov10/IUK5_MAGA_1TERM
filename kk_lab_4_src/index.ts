import { LexemAnalyzer, readInputFromFile, writeOutputToFile } from "lex";
import { SyntaxAnalyzer } from "./src/classes";
import { CodeGenerator } from "./src/classes/CodeGenerator";
import { postfixExpression } from "./src/types";

// Чтение данных с файла
const data = readInputFromFile("./input.txt");

////////////////////////////////////////

// Экземпляр класса лексического анализатора
const analyzer = new LexemAnalyzer(data);
// Получение результата
const { resultJson, resultString } = analyzer.run();

// Запись результата в файл
writeOutputToFile("./lexemOutput.txt", resultString);

// Если в лексическом анализе были ошибки, то выводим их и не начинаем синтаксический анализ
if (resultJson.errors.length > 0) {
  console.log("\x1b[31m", "Can not start syntax analyze. There are lexem error (errors)", "\x1b[0m", "\n");

  resultJson.errors.map((e) => console.log("\x1b[31m", e.getErrorAsString(), "\x1b[0m"));
  console.log("\n");

  throw new Error("Can not start syntax analyze. There are lexem error (errors)");
}

////////////////////////////////////////

// Экземпляр синтаксического анализатора
const syntaxAnalyzer = new SyntaxAnalyzer(resultJson.lexems);

let syntaxResult = "";

let identifiersForCodeGeneration: string[] = [];
let postfixExpressionsForCodeGeneration: postfixExpression[] = [];

// Запуск анализатора
try {
  const { result, identifiers, postfixExpressions } = syntaxAnalyzer.run();

  syntaxResult = result;
  identifiersForCodeGeneration = identifiers;
  postfixExpressionsForCodeGeneration = postfixExpressions;
} catch (error) {
  syntaxResult = (error as Error).message;
  throw error;
} finally {
  writeOutputToFile("./syntaxOutput.txt", syntaxResult);
}

////////////////////////////////////////

// Экземпляр генератора кода
const codeGenerator = new CodeGenerator(identifiersForCodeGeneration, postfixExpressionsForCodeGeneration);

// Запуск генератора кода
const resultCode = codeGenerator.run();

console.log(resultCode);

// Запись результата в файл
writeOutputToFile("./output.txt", resultCode);
