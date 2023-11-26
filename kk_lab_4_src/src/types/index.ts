export type postfixExpression = {
  ident: string;
  postfixArray: postfix[];
};

export type postfix = {
  value: string;
  type: "operator" | "operandIdentifier" | "operandConstant";
};

export type postfixStack = {
  value: string;
  type: "operator" | "left bracket" | "right bracket" | "operand";
};

export type identifierSyntax = {
  title: string;
  isAssigned: boolean;
};

export type identifierCode = {
  title: string;
  pointer: number;
};
