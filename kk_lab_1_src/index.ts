import { Analyzer } from "./src/Analyzer";
import { readInputFromFile, writeOutputToFile } from "./src/assets";

// Чтение данных с файла
const data = readInputFromFile("./input.txt");

// Экземпляр класса лексического анализатора
const analyzer = new Analyzer(data);
// Получение результата
const result = analyzer.run();

// Запись результата в файл
writeOutputToFile("./output.txt", result);
