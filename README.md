# 👥 teams-angular

[![NPM version](https://img.shields.io/npm/v/teams-angular.svg)](https://www.npmjs.com/package/teams-angular)
[![Build Status](https://github.com/sinedied/teams-angular/workflows/build/badge.svg)](https://github.com/sinedied/teams-angular/actions)
![Node version](https://img.shields.io/node/v/teams-angular.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Angular schematics to create Microsoft Teams applications.

## Usage

### `ng new teams-angular`

This package provides a schematic that creates a new Angular app configured to be deployed as a Microsoft Teams app. The generated app includes:

- authentication configuration using Microsoft Identity Platform,
- Single-Sign On (SSO) configuration with Microsoft Teams,
- additional npm scripts to create Azure AD application and manage the Teams app package

To use this schematic, run:

```sh
ng new teams-app --collection teams-angular
```

## Contributing

To test locally, run `npm test:schematics`. This will act the same as the `generate` command of the Angular CLI, but using a debug mode.

`npm run test` will run the unit tests, using Jest as a runner and test framework.
