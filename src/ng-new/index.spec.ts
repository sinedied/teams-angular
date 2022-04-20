import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-new', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync('ng-new', { name: 'test' }, Tree.empty())
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
  "/test/aad-app-manifest.json",
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
  "/test/src/assets/images/signin_light.svg",
  "/test/src/environments/environment.prod.ts",
  "/test/src/environments/environment.ts",
  "/test/src/app/app-routing.module.ts",
  "/test/src/app/app.module.ts",
  "/test/src/app/app.component.spec.ts",
  "/test/src/app/app.component.ts",
  "/test/src/app/app.component.css",
  "/test/src/app/app.component.html",
  "/test/src/app/auth.service.spec.ts",
  "/test/src/app/auth.service.ts",
  "/test/src/app/teams.guard.spec.ts",
  "/test/src/app/teams.guard.ts",
  "/test/src/app/teams.service.spec.ts",
  "/test/src/app/teams.service.ts",
  "/test/src/app/home/home.component.css",
  "/test/src/app/home/home.component.html",
  "/test/src/app/home/home.component.spec.ts",
  "/test/src/app/home/home.component.ts",
  "/test/src/app/login/login.component.css",
  "/test/src/app/login/login.component.html",
  "/test/src/app/login/login.component.spec.ts",
  "/test/src/app/login/login.component.ts",
  "/test/.devcontainer/Dockerfile",
  "/test/.devcontainer/devcontainer.json",
  "/test/package/color.png",
  "/test/package/manifest.json",
  "/test/package/outline.png",
  "/test/scripts/default-environment.ts",
  "/test/scripts/update-environment.js",
  "/test/scripts/update-manifest.js",
  "/test/scripts/update-teams-app.js",
]
`);
  });
});
