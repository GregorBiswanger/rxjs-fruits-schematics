import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import * as fs from 'fs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('rxjs-fruits-schematics - exercise command', () => {
  let testTree: Tree;

  beforeEach(() => {
    testTree = Tree.empty();
    testTree.create('./src/app/app-routing.module.ts', fs.readFileSync('./src/spec/stubs/app/app-routing.module.ts', 'utf8'));
  });

  it('creates a new exercise files.', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('exercise', { name: 'test' }, testTree);

    expect(tree.files.length).toEqual(8);
  });
});
