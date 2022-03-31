# teams-schematics

An Angular schematic to create Microsoft Teams applications.

## Usage

## Schematics

### `ng new teams-angular`

This package provides a schematic that creates a new Angular app configured to be deployed as a Microsoft Teams app. The generated app includes:

- authentication configuration using Microsoft Identity Platform,
- Single-Sign On (SSO) configuration with Microsoft Teams,
- additional npm scripts to create Azure AD application and manage the Teams app package

To use this schematic, run:

```sh
ng new teams-angular --collection teams-schematics
```

## Contributing

To test locally, run `npm test:schematics`. This will act the same as the `generate` command of the Angular CLI, but using a debug mode.

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.
