import { identifierCode, postfixExpression } from "src/types";

export class CodeGenerator {
  private identifiers: identifierCode[];
  private postfixExpressions: postfixExpression[];

  private result: string = "";

  constructor(identifiersSyntax: string[], postfixExpressions: postfixExpression[]) {
    this.identifiers = identifiersSyntax.map((i, index) => ({ title: i, pointer: index + 1 }));
    this.postfixExpressions = postfixExpressions;
  }

  run() {
    console.log("CodeGenerator.identifiers:", this.identifiers);
    console.log("CodeGenerator.postfixExpressions:", JSON.stringify(this.postfixExpressions, null, 2));

    this.postfixExpressions.forEach((e) => {
      this.calculateExpression(e);
    });

    return this.result;
  }

  private calculateExpression(expression: postfixExpression) {
    expression.postfixArray.forEach((postfix) => {
      if (postfix.type === "operandConstant") {
        this.LIT(postfix.value);
      }

      if (postfix.type === "operandIdentifier") {
        const ident = this.identifiers.find((i) => i.title === postfix.value);

        if (!ident) {
          throw new Error("No ident found");
        }

        this.LOAD(ident.pointer);
      }

      if (postfix.type === "operator") {
        this.formOperator(postfix.value as "+" | "-" | "/" | "*");
      }
    });

    const identToAssign = this.identifiers.find((i) => i.title === expression.ident);

    if (!identToAssign) {
      throw new Error("No ident to assign found");
    }

    this.STO(identToAssign.pointer);
  }

  private formOperator(operator: "+" | "-" | "/" | "*") {
    switch (operator) {
      case "+":
        this.ADD();
        break;
      case "-":
        this.SUB();
        break;
      case "*":
        this.MUL();
        break;
      case "/":
        this.DIV();
        break;

      default:
        throw new Error("Wrong operator");
    }
  }

  private LIT(constant: string) {
    this.formLine(`LIT ${constant}`);
  }
  private LOAD(pointer: number) {
    this.formLine(`LOAD ${pointer}`);
  }
  private STO(pointer: number) {
    this.formLine(`STO ${pointer}`);
  }

  private ADD() {
    this.formLine(`ADD`);
  }
  private SUB() {
    this.formLine(`SUB`);
  }
  private MUL() {
    this.formLine(`MUL`);
  }
  private DIV() {
    this.formLine(`DIV`);
  }

  private formLine(line: string) {
    this.result = this.result + line + "\n";
  }
}
