import { normalize, Path } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

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
