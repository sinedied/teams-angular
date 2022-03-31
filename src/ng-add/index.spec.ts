import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync('ng-add', { name: 'test' }, Tree.empty())
      .toPromise();

    expect(tree.files).toMatchInlineSnapshot(`
Array [
  "/test/README.md",
  "/test/.editorconfig",
  "/test/.gitignore",
  "/test/angular.json",
  "/test/package.json",
  "/test/tsconfig.json",
  "/test/.browserslistrc",
  "/test/karma.conf.js",
  "/test/tsconfig.app.json",
  "/test/tsconfig.spec.json",
  "/test/.vscode/extensions.json",
  "/test/.vscode/launch.json",
  "/test/.vscode/tasks.json",
  "/test/src/favicon.ico",
  "/test/src/index.html",
  "/test/src/main.ts",
  "/test/src/polyfills.ts",
  "/test/src/styles.scss",
  "/test/src/test.ts",
  "/test/src/assets/.gitkeep",
  "/test/src/environments/environment.prod.ts",
  "/test/src/environments/environment.ts",
  "/test/src/app/app.module.ts",
  "/test/src/app/app.component.spec.ts",
  "/test/src/app/app.component.ts",
  "/package/color.png",
  "/package/manifest.json",
  "/package/outline.png",
  "/scripts/update-id.js",
]
`);
  });
});
