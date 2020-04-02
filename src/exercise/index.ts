import { Rule, SchematicContext, Tree, url, apply, move, mergeWith, MergeStrategy, template, SchematicsException, chain } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/experimental/workspace';
import * as ts from 'typescript';
import { SourceFile } from 'typescript';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function exercise(_options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const exercisePath = normalize('exercises' + '/' + _options.name);
    let exerciseFiles = url('./files/exercises/template');

    const exerciseTree = apply(exerciseFiles, [
      move(exercisePath),
      template({
        ...strings,
        ..._options
      })
    ]);

    const templateRule = mergeWith(exerciseTree, MergeStrategy.Default);
    const updateAppRoutingModuleRule = updateAppRoutingModule(_options);
    const chainedRule = chain([templateRule, updateAppRoutingModuleRule]);

    return chainedRule(tree, _context);
  };
}

// function createCypressIntegrationTest(_options: Options): Rule {

// }

function getWorkspace(_options: Options, tree: Tree): WorkspaceSchema {
  const workspace = tree.read('/angular.json');

  if (!workspace) {
    throw new SchematicsException('angular.json file not found!');
  }

  return JSON.parse(workspace.toString());
}

function updateAppRoutingModule(_options: Options): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const moduleName = strings.dasherize(_options.name);
    const exportedModuleName = strings.classify(_options.name);
    const pathName = strings.dasherize(_options.name);
    const appRoutingModulePath = 'src/app/app-routing.module.ts';

    const routeContent = `  { path: '${pathName}', loadChildren: () => import('./exercises/${pathName}/${moduleName}.module').then(m => m.${exportedModuleName}) }`;

    const appRoutingModuleSourceFile = getAsSourceFile(tree, appRoutingModulePath);
    


      // const recorder = tree.beginUpdate(appRoutingModulePath);
      // recorder.insertLeft(0, routeContent);
      // tree.commitUpdate(recorder);

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

  interface Options {
    name: string;
  }