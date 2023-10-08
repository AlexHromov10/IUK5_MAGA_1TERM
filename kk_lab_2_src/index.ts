import { Lexem } from "lex";

const a = new Lexem({ value: "1", line: 1, position: 1, type: "assignSymbol" });
console.log(a.getLexemAsString());
