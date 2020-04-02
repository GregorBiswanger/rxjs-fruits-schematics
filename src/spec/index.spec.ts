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
    testTree.create('./src/app/exercises/levels.json', fs.readFileSync('./src/spec/stubs/app/exercises/levels.json', 'utf8'));
  });

  describe('when creating files', () => {
    it('creates the right number of files.', () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = runner.runSchematic('exercise', { name: 'test' }, testTree);

      expect(tree.files.length).toEqual(9);
    });

    it('gives files the correct names.', () => {
      const name = 'test';
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = runner.runSchematic('exercise', { name: name }, testTree);

      expect(tree.files[0]).toBe(`/src/app/app-routing.module.ts`);
      expect(tree.files[1]).toBe(`/src/app/exercises/levels.json`);
      expect(tree.files[2]).toBe(`/src/app/exercises/${name}/${name}-exercise.ts`);
      expect(tree.files[3]).toBe(`/src/app/exercises/${name}/${name}-routing.module.ts`);
      expect(tree.files[4]).toBe(`/src/app/exercises/${name}/${name}.component.html`);
      expect(tree.files[5]).toBe(`/src/app/exercises/${name}/${name}.component.scss`);
      expect(tree.files[6]).toBe(`/src/app/exercises/${name}/${name}.component.ts`);
      expect(tree.files[7]).toBe(`/src/app/exercises/${name}/${name}.module.ts`);
      expect(tree.files[8]).toBe(`/cypress/integration/${name}.spec.ts`);
    });
  });

  describe('when inserting content', () => {
    it('updates template files correctly', () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = runner.runSchematic('exercise', { name: 'test' }, testTree);
      const exerciseFilePath = tree.files[2];
      const exerciseFileContent = tree.read(exerciseFilePath);

      expect(exerciseFileContent).toContain('export class TestExercise');
    });

    it('add a new route to the app-routing module', () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = runner.runSchematic('exercise', { name: 'test' }, testTree);
      const appRouterModuleContent = tree.read('./src/app/app-routing.module.ts');

      expect(appRouterModuleContent).toContain(`{ path: 'test', loadChildren: () => import('./exercises/test/test.module').then(m => m.TestModule) },`);
    });

    it('should create a new level entry in levels.json', () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = runner.runSchematic('exercise', { name: 'test' }, testTree);
      const levelsContent = JSON.parse(tree.read('./src/app/exercises/levels.json')?.toString() || '');

      expect(levelsContent).toContain({
        "title": "test",
        "number": 7,
        "urlPath": "/test",
        "solved": false
      });
    });
  });
});






