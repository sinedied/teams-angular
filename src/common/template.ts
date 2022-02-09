import { strings } from "@angular-devkit/core";
import { apply, MergeStrategy, mergeWith, move, Rule, SchematicContext, template, Tree, url } from "@angular-devkit/schematics";

export function copyTemplate(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(
      url('files'),
      [template({ ...options, ...strings }), move(options.name)]
    );
    const generateTemplateRule = mergeWith(
      templateSource,
      MergeStrategy.Overwrite
    );

    return generateTemplateRule;
  }
}
