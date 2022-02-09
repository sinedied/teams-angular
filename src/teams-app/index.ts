import { join, strings } from '@angular-devkit/core';
import { apply, chain, externalSchematic, MergeStrategy, mergeWith, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';

export function teamsApp(options: any): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    // const projectRoot = await getProjectRoot(tree, options);
    // options.path = join(projectRoot, 'src');

    return chain([generateNewApp(options), applyTemplate(options)]);
  };
}

function applyTemplate(options: any): Rule {
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

function generateNewApp(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return externalSchematic('@schematics/angular', 'ng-new', {
      name: options.name,
      directory: options.name,
      routing: false,
      style: 'scss',
      inlineStyle: true,
      inlineTemplate: true
    });
  }
}
