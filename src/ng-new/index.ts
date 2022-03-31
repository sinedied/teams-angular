import { chain, externalSchematic, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addPackages, copyTemplate, mergeWithPackageJson } from '../common';
import { SchemaOptions } from './schema';

export default function teamsApp(options: SchemaOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    // const projectRoot = await getProjectRoot(tree, options);
    // options.path = join(projectRoot, 'src');

    return chain([
      generateNewApp(options),
      copyTemplate(options),
      addPackages(options, {
        'dependencies': {
          '@microsoft/teams-js': '^1.11.0',
          // '@azure/msal-angular': '^2.1.0',
        },
        'devDependencies': {
          '@pnp/cli-microsoft365': '^4.4.0',
          'bestzip': '^2.2.0',
          'concurrently': '^7.0.0',
          'localtunnel': '^2.0.2',
        }
      }),
      mergeWithPackageJson(options, {
        'scripts': {
          'start:tunnel': 'concurrently --kill-others \"npm:tunnel\" \"npm:start\"',
          'tunnel': 'lt --local-host localhost --port 4200 --subdomain myuniquedomain',
          'update:manifest': 'node scripts/update-manifest.js myuniquedomain.loca.lt',
          'update:teams-app': 'node scripts/update-teams-app.js',
          'm365:login': 'm365 login',
          'm365:create-aad-app': 'm365 aad app add --manifest @aad-app-manifest.json --save',
          'm365:package': 'npm run update:manifest -s && cd package && npx bestzip \"./angular-teams.zip\" \"*\"',
          'm365:publish': 'npm run m365:package -s && m365 teams app publish - angular-teams.zip',
          'm365:update': 'npm run m365:package -s && npm run update:teams-app -s'
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
      routing: true,
      style: 'scss',
      inlineStyle: true,
      inlineTemplate: true
    });
  }
}
