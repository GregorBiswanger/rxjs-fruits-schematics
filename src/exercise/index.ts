import { Rule, SchematicContext, Tree, url, apply, move, mergeWith, MergeStrategy, template } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

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
    return templateRule(tree, _context);
  };
}

interface Options {
  name: string;
}