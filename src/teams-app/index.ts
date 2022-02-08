import { join, normalize, Path, strings } from '@angular-devkit/core';
import { apply, chain, MergeStrategy, mergeWith, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

export function teamsApp(options: any): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const projectRoot = await getProjectRoot(tree, options);
    options.path = join(projectRoot, 'src');

    return chain([applyTemplate(options)]);
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

async function getProjectRoot(host: Tree, options: any): Promise<Path> {
  const workspace = await getWorkspace(host);
  if (!options.project) {
    options.project = workspace.projects.keys().next().value;
  }

  const project = workspace.projects.get(options.project);
  if (!project) {
    throw new SchematicsException(`Invalid project name: ${options.project}`);
  }

  return normalize(project.root);
}
