// See <https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API>
// See <https://dev.doctorevidence.com/how-to-write-a-typescript-transform-plugin-fc5308fdd943>

import ts, { DiagnosticWithLocation } from "typescript"
import { serializeTypeNode } from "./serialize"

function findImports (sourceFile: ts.SourceFile, filter: (node: ts.ImportDeclaration) => boolean) {
  const importDeclarations: ts.ImportDeclaration[] = []

  ts.forEachChild(sourceFile, childNode => {
    if (ts.isImportDeclaration(childNode) && filter(childNode)) {
      importDeclarations.push(childNode)
    }
  })

  return importDeclarations
}

function stripQuotes (str: string) {
  if (str.charAt(0) === `"` && str.charAt(str.length - 1) === `"`) {
    return str.substr(1, str.length - 2)
  } else if (str.charAt(0) === `'` && str.charAt(str.length - 1) === `'`) {
    return str.substr(1, str.length - 2)
  } else {
    return str
  }
}

function isReflectImport (importDeclaration: ts.ImportDeclaration) {
  return stripQuotes(importDeclaration.moduleSpecifier.getText()) === "ts-reflect"
}

function reportError (node: ts.Node, messageText: string): DiagnosticWithLocation {
  return {
    file: node.getSourceFile(),
    start: node.getStart(),
    length: node.getEnd() - node.getStart(),
    category: ts.DiagnosticCategory.Error,
    code: 0,
    messageText
  }
}

function createVisitor (context: ts.TransformationContext, typeChecker: ts.TypeChecker) {
  const visitor = (node: ts.Node): ts.VisitResult<any> => {
    if (ts.isImportDeclaration(node) && isReflectImport(node)) {
      // Remove import, since everything can be done at build time; no runtime code necessary
      return []
    }

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.getText() === "Reflect") {
      const callExpression = node

      if (callExpression.arguments.length > 0) {
        throw reportError(callExpression, "Unexpected arguments in Reflect<>() call.")
      }

      if (!callExpression.typeArguments) {
        return node
      }
      if (callExpression.typeArguments.length !== 1) {
        throw reportError(callExpression, "Expected exactly one type argument in Reflect<>() call.")
      }

      return serializeTypeNode(callExpression.typeArguments[0], typeChecker)
    }
    return ts.visitEachChild(node, visitor, context)
  }
  return visitor
}

function reflect (options: {} = {}, program?: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return function (context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
    return (sourceFile: ts.SourceFile) => {
      const reflectImports = findImports(sourceFile, isReflectImport)
      if (reflectImports.length === 0) return sourceFile

      // FIXME: Support other identifiers than "Reflect"

      // TODO: First run: Traverse and remember all type and interface declarations
      // TODO: Throw if imported type is referenced?

      if (program) {
        return ts.visitNode(sourceFile, createVisitor(context, program.getTypeChecker()))
      } else {
        throw new Error(
          "Program instance not passed to ts-reflect transformation. Run it using 'ts': ts --transform ts-reflect"
        )
      }
    }
  }
}

export default reflect

