import { chain, externalSchematic, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addPackages, copyTemplate, mergeWithPackageJson } from '../common';
import { SchemaOptions } from './schema';

export function teamsApp(options: SchemaOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    // const projectRoot = await getProjectRoot(tree, options);
    // options.path = join(projectRoot, 'src');

    return chain([
      generateNewApp(options),
      copyTemplate(options),
      addPackages(options, {
        'dependencies': {
          // '@azure/msal-angular': '^2.1.0',
        },
        'devDependencies': {
          '@pnp/cli-microsoft365': '^4.4.0',
          'localtunnel': '^2.0.2',
        }
      }),
      mergeWithPackageJson(options, {
        'scripts': {
          'm365:login': 'm365 login',
          'm365:create-aa-app': 'm365 aad app add --manifest @aad-app-manifest.json --save',
          'm365:package': 'cd package && npx bestzip ../angular-teams.zip *',
          'm365:publish': 'npm run m365:package -s && m365 teams app publish -p angular-teams.zip',
        }
      })
    ]);
  };
}

function generateNewApp(options: SchemaOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return externalSchematic('@schematics/angular', 'ng-new', {
      name: options.name,
      version: '13.2.2',
      directory: options.name,
      routing: false,
      style: 'scss',
      inlineStyle: true,
      inlineTemplate: true
    });
  }
}
