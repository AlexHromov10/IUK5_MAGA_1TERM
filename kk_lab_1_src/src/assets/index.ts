import { readFileSync, writeFileSync } from "fs";

// Функция чтения файла
export function readInputFromFile(path: string) {
  return readFileSync(path, { encoding: "utf8", flag: "r" });
}

// Функция записи в файл
export function writeOutputToFile(path: string, data: string) {
  writeFileSync(path, data);
}

// Символы пропуска
export const skipSymbols = [" ", "\t", "\0", "\r", "\n"];

// Символы цифр
export const integers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

// Символы алфавита
export const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
