import { LexemAnalyzer, readInputFromFile, writeOutputToFile } from "lex";
import { SyntaxAnalyzer } from "./src/classes";

// Чтение данных с файла
const data = readInputFromFile("./input.txt");

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

// Экземпляр синтаксического анализатора
const syntaxAnalyzer = new SyntaxAnalyzer(resultJson.lexems, "./syntaxOutput.txt");

// Запуск анализатора
syntaxAnalyzer.run();
