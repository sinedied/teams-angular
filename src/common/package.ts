import { JsonObject } from "@angular-devkit/core";
import { Rule, SchematicContext, SchematicsException, Tree } from "@angular-devkit/schematics";
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from "@schematics/angular/utility/dependencies";
import { deepMergeJson } from "./util";

export type NodePackages = {
  [key in NodeDependencyType]?: { [key: string]: string };
};

export function addPackages(options: any, packages: NodePackages): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonPath = `${options.name}/package.json`;
    const dependencies = createNodeDependencies(packages);
    for (const dependency of dependencies) {
      addPackageJsonDependency(tree, dependency, packageJsonPath);
    }
  }
}

function createNodeDependencies(packages: NodePackages): NodeDependency[] {
  const dependencies: NodeDependency[] = [];

  for (const [type, list] of Object.entries(packages)) {
    for (const [name, version] of Object.entries(list)) {
      dependencies.push({
        type: type as NodeDependencyType,
        name,
        version,
        overwrite: true
      });
    }
  }

  return dependencies;
}

export function mergeWithPackageJson(options: any, json: JsonObject): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonPath = `${options.name}/package.json`;
    const packageContents = tree.read(packageJsonPath);
    if (!packageContents) {
      throw new SchematicsException(`Could not find package.json for the ${options.name} project.`);
    }

    const packageJson = JSON.parse(packageContents.toString());
    const newPackageJson = deepMergeJson(packageJson, json);
    tree.overwrite(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
  }
}
