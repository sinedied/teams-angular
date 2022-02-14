# @teams/angular

> An Angular schematics collection to create Microsoft Teams applications.

⚠️ WIP ⚠️
 
## Usage

## Schematics

### `ng add @teams/angular`

A schematic that adds Microsoft Teams support to an existing Angular project.

Once installed, this schematic will add the following files to `src/assets/microsoft-teams/`:
- color.png
- outline.png
- manifest.json

It will also install the necessary npm dependencies in the host project.

## Contributing

To test locally, run `npm test:schematics`. This will act the same as the `generate` command of the Angular CLI, but using a debug mode.

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.
