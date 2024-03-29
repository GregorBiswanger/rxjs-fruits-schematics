import { Rule, SchematicContext, Tree, url, apply, move, mergeWith, MergeStrategy, template, chain, SchematicsException } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';
import * as ts from 'typescript';
import { SourceFile, Node } from 'typescript';

export function exercise(_options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _options.level = detectNewLevelVersion(tree);
    _options.levelFileName = String(_options.level).padStart(2, '0') + '_' + _options.name;

    const chainedRule = chain([
      createNewLevelEntry(_options),
      createNewTranslationEntries(_options),
      createExerciseFiles(_options),
      createCypressIntegrationTest(_options),
      updateAppRoutingModule(_options)
    ]);

    return chainedRule(tree, _context);
  };
}

function detectNewLevelVersion(tree: Tree): number {
  const levelsPath = 'src/app/exercises/levels.json';
  const levels: Level[] = JSON.parse(tree.read(levelsPath)?.toString() || '');

  const lastLevel: Level = [...levels].pop() || { title: '', number: 0, solved: false, urlPath: '' };
  return lastLevel.number + 1 || 1;
}

function createNewLevelEntry(_options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const levelsPath = 'src/app/exercises/levels.json';
    const levels: Level[] = JSON.parse(tree.read(levelsPath)?.toString() || '');

    const newLevel: Level = {
      title: strings.dasherize(_options.name),
      number: _options.level,
      urlPath: '/' + strings.dasherize(_options.name),
      solved: false
    }

    levels.push(newLevel);
    tree.overwrite(levelsPath, JSON.stringify(levels));

    return tree;
  }
}

function createNewTranslationEntries(_options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const i18nPath = 'src/assets/i18n';
    const subfiles = tree.getDir(i18nPath).subfiles;

    subfiles.forEach(fileName => {
      if(fileName.includes('.json')) {
        const filePath = normalize(i18nPath + '/' + fileName);
        const translationFile = JSON.parse(tree.read(filePath)?.toString() || '');
        translationFile.EXERCISES[strings.dasherize(_options.name).toUpperCase()] =  {
          "RECIPEDESCRIPTION": "lorem ipsum."
        }
  
        tree.overwrite(filePath, JSON.stringify(translationFile));
      }
    });

    return tree;
  }
}

function createExerciseFiles(_options: Options): Rule {
  const exercisePath = normalize('src' + '/' + 'app' + '/' + 'exercises' + '/' + strings.dasherize(_options.name));
  let exerciseFiles = url('./files/exercises/template');

  const exerciseTree = apply(exerciseFiles, [
    move(exercisePath),
    template({
      ...strings,
      ..._options
    })
  ]);

  return mergeWith(exerciseTree, MergeStrategy.Default);
}

function createCypressIntegrationTest(_options: Options): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const cypressIntegrationTestsPath = normalize('cypress' + '/' + 'integration');
    let testFile = url('./files/cypress/integration');

    const cypressIntegrationTree = apply(testFile, [
      move(cypressIntegrationTestsPath),
      template({
        ...strings,
        ..._options
      })
    ]);

    return mergeWith(cypressIntegrationTree, MergeStrategy.Default);
  };
}

function updateAppRoutingModule(_options: Options): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const moduleName = strings.dasherize(_options.name);
    const exportedModuleName = strings.classify(_options.name);
    const pathName = strings.dasherize(_options.name);
    const appRoutingModulePath = 'src/app/app-routing.module.ts';

    const routeContent = `,\n      { path: '${pathName}', loadChildren: () => import('./exercises/${pathName}/${moduleName}.module').then(m => m.${exportedModuleName}Module) }`;
    const appRoutingModuleSourceFile = getAsSourceFile(tree, appRoutingModulePath);

    const insertPosition = findLineNumberOfPreviousRoute(appRoutingModuleSourceFile);
    const recorder = tree.beginUpdate(appRoutingModulePath);
    recorder.insertLeft(insertPosition, routeContent);
    tree.commitUpdate(recorder);

    return tree;
  }
}

function getAsSourceFile(tree: Tree, path: string): SourceFile {
  const file = tree.read(path);

  if (!file) {
    throw new SchematicsException(`${path} not found.`);
  }

  return ts.createSourceFile(path, file.toString(), ts.ScriptTarget.Latest, true);
}

function findLineNumberOfPreviousRoute(file: SourceFile): number {
  let insertPosition = 0;

  file.forEachChild((node: Node) => {

    if (node.kind === ts.SyntaxKind.VariableStatement) {
      node.forEachChild((variableDeclarationListNode: Node) => {
        if (variableDeclarationListNode.kind === ts.SyntaxKind.VariableDeclarationList) {

          variableDeclarationListNode.forEachChild((variableDeclarationNode: Node) => {
            if (variableDeclarationNode.kind === ts.SyntaxKind.VariableDeclaration) {
              variableDeclarationNode.forEachChild((arrayLiteralExpressionNode: Node) => {
                if (arrayLiteralExpressionNode.kind === ts.SyntaxKind.ArrayLiteralExpression) {

                  arrayLiteralExpressionNode.forEachChild((objectLiteralExpressionNode: Node) => {


                    if (objectLiteralExpressionNode.kind === ts.SyntaxKind.ObjectLiteralExpression &&
                      objectLiteralExpressionNode.getFullText().includes('path: \'\'')) {

                      objectLiteralExpressionNode.forEachChild((propertyAssignmentExpressionNode: Node) => {
                        if(propertyAssignmentExpressionNode.kind === ts.SyntaxKind.PropertyAssignment &&
                          propertyAssignmentExpressionNode.getFullText().includes('path: \'\'')) {

                            propertyAssignmentExpressionNode.forEachChild((arrayLiteralExpressionNode: Node) => {
                              if(arrayLiteralExpressionNode.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                                // insertPosition = arrayLiteralExpressionNode.getLastToken()?.getStart() || 0;
                                const routes = arrayLiteralExpressionNode.getChildren();
                                insertPosition = routes[1].getEnd();
                              }
                            });
                          }
                      })
                    }
                  });
                }
              })
            }
          })
        }
      });
    }
  });

  return insertPosition;
}

interface Options {
  name: string;
  level: number;
  levelFileName: string;
}

interface Level {
  title: string;
  number: number;
  urlPath: string;
  solved: boolean;
}
