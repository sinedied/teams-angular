import { join, strings } from '@angular-devkit/core';
import { apply, chain, externalSchematic, MergeStrategy, mergeWith, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';
import { addPackages, mergeWithPackageJson } from '../common';
import { SchemaOptions } from './schema';

export function teamsApp(options: SchemaOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    // const projectRoot = await getProjectRoot(tree, options);
    // options.path = join(projectRoot, 'src');

    return chain([
      generateNewApp(options),
      applyTemplate(options),
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

function applyTemplate(options: SchemaOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(
      url('files'),
      [template({ ...options, ...strings })]
    );
    const generateTemplateRule = mergeWith(
      templateSource,
      MergeStrategy.Overwrite
    );

    return generateTemplateRule;
  }
}

function generateNewApp(options: SchemaOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return externalSchematic('@schematics/angular', 'ng-new', {
      name: options.name,
      version: '13.0.0',
      directory: options.name,
      routing: false,
      style: 'scss',
      inlineStyle: true,
      inlineTemplate: true
    });
  }
}


