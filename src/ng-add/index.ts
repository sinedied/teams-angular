import { ProjectDefinition } from "@angular-devkit/core/src/workspace";
import {
  apply,
  chain,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from "@schematics/angular/utility/dependencies";
import { getWorkspace } from "@schematics/angular/utility/workspace";
import { randomUUID } from "crypto";
import { readdirSync } from "fs";
import { EOL } from "os";
import path, { normalize, posix } from "path";

// TODO (@manekinekko): test this!
function moveDeep(from: string, to?: string): Rule {
  const traverseFolder = function* traverseFolder(
    folder: string
  ): Generator<string> {
    const folders = readdirSync(folder, { withFileTypes: true });
    for (const folderEntry of folders) {
      const entryPath = path.resolve(folder, folderEntry.name);
      if (folderEntry.isDirectory()) {
        yield* traverseFolder(entryPath);
      } else {
        yield entryPath;
      }
    }
  };

  if (to === undefined) {
    to = from;
    from = "/";
  }

  const fromPath = normalize("/" + from);
  const toPath = normalize("/" + to);

  if (fromPath === toPath) {
    return noop;
  }

  return (tree: Tree) => {
    for (const file of traverseFolder(from)) {
      const relativePath = file.replace(fromPath, toPath);
      tree.rename(file, relativePath);
    }
  };
}

function addDependency(
  name: string,
  version: string,
  type: NodeDependencyType = NodeDependencyType.Default
) {
  return {
    type,
    name,
    version,
    overwrite: false,
  };
}

function addNpmDependencies() {
  return (tree: Tree, context: SchematicContext) => {
    // TODO (@manekinekko): ask user if they need @microsoft/teams-j to be installed
    addPackageJsonDependency(
      tree,
      addDependency("@microsoft/teams-js", "^1.11.0")
    );
    addPackageJsonDependency(
      tree,
      addDependency("@pnp/cli-microsoft365", "^4.4.0", NodeDependencyType.Dev)
    );
    addPackageJsonDependency(
      tree,
      addDependency("bestzip", "^2.2.0", NodeDependencyType.Dev)
    );
    addPackageJsonDependency(
      tree,
      addDependency("concurrently", "^7.0.0", NodeDependencyType.Dev)
    );
    addPackageJsonDependency(
      tree,
      addDependency("localtunnel", "^2.0.2", NodeDependencyType.Dev)
    );

    context.addTask(new NodePackageInstallTask(), []);

    return tree;
  };
}

function updateGitIgnore() {
  return (tree: Tree) => {
    if (tree.exists(".gitignore")) {
      let gitIgnoreContent = tree.read(".gitignore")!.toString("utf-8");

      if (/^\.env$/gm.test(gitIgnoreContent)) {
        return tree;
      }

      tree.overwrite(
        ".gitignore",
        [gitIgnoreContent, "# Microsoft Teams App", ".env"].join(EOL) + EOL
      );
    }

    return tree;
  };
}

function copyFiles(projectPath: string) {
  return async (tree: Tree) => {
    const manifestFilepath = posix.join(
      "src",
      "assets",
      "microsoft-teams",
      "manifest.json"
    );
    if (tree.exists(manifestFilepath)) {
      // TODO (@manekinekko): ask user if they want to overwrite the manifest.json
      throw new SchematicsException(
        `Found an existing Microsoft Teams manifest in the project at "${manifestFilepath}".`
      );
    }

    return mergeWith(
      apply(url("./files"), [
        move(normalize(projectPath)),
        template({
          // TODO (@manekinekko): figure out port resolution logic
          port: 4200,
          id: randomUUID(),
          entityId: randomUUID(),
        }),
      ])
    );
  };
}

function addScriptToPackageJSON() {
  return (tree: Tree) => {
    if (tree.exists("package.json")) {
      const packageJSON = JSON.parse(
        tree.read("package.json")!.toString("utf-8")
      );
      packageJSON.scripts ??= {};

      packageJSON.scripts[
        "start:tunnel"
      ] = `concurrently --kill-others "npm:tunnel" "npm:start"`;

      // TODO (@manekinekko): figure out port resolution logic
      // TODO (@manekinekko): pass --subdomain as an argument or read it from the .env file
      (packageJSON.scripts["tunnel"] =
        "lt --local-host localhost --port 4200 --subdomain myuniquedomain"),
        tree.overwrite("package.json", JSON.stringify(packageJSON, null, 2));
    }

    return tree;
  };
}

async function getHostProjectDefinition(
  tree: Tree
): Promise<[string, ProjectDefinition]> {
  const workspace = await getWorkspace(tree);
  const projects = new Map(
    [...workspace.projects.entries()].filter(
      ([, def]) => def.extensions.projectType === "application"
    )
  );
  const projectName = workspace.extensions.defaultProject?.toString();
  if (projectName !== undefined) {
    if (projects.has(projectName)) {
      return [projectName, projects.get(projectName)!];
    } else {
      throw new SchematicsException(
        `Microsoft Teams schematic requires a project type of "application" but the specified project "${projectName}" doesn't exist or is not of the "application" type.`
      );
    }
  } else {
    throw new SchematicsException(
      `Microsoft Teams schematic requires a default project to be set in the workspace file.`
    );
  }
}

export default function (_options: any): Rule {
  return async (tree: Tree) => {
    const [_projectName, projectDefinition] = await getHostProjectDefinition(
      tree
    );

    let targetPath =
      projectDefinition.sourceRoot ?? posix.join(projectDefinition.root, "src");

    return chain([
      addNpmDependencies,
      addScriptToPackageJSON(),
      copyFiles(targetPath),
      updateGitIgnore,
    ]);
  };
}
