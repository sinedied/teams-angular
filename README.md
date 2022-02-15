# @teams/angular

> An Angular schematics collection to create Microsoft Teams applications.

⚠️ WIP ⚠️
 
## Usage

## Schematics

## Builder

This schematics contains a builder that simplifies building and deploying the Teams app built using Angular to Microsoft Teams. To use the builder, in the `angular.json` file in your project add a new target named `deploy-to-teams`:

```json
{
  "my-app": {
    "architect": {
      "deploy-to-teams": {
        "builder": "@teams/angular:deploy-to-teams",
        "options": {
          "appId": "933b8170-ad4c-421f-b2ca-a80f2685ef08",
          "packageFileName": "angular-teams.zip"
        }
      }
    }
  }
}
```

The `deploy-to-teams` target expects two options:

- `appId` - the value of the `id` property from the Teams app manifest
- `packageFileName` - the name of the .zip file that should be used to create the Teams app package

To run the builder execute:

```sh
ng run my-app:deploy-to-teams
```

After executing, the builder will create a Teams app package, publish it to Microsoft Teams and install it for the current user. The last two steps are done using CLI for Microsoft 365 and the builder assumes that you're already signed in with your Microsoft 365 account. If you haven't signed in previously, you can do it by running in command line `m365 login` and following the instructions on the screen.

## Contributing

To test locally, run `npm test:schematics`. This will act the same as the `generate` command of the Angular CLI, but using a debug mode.

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.
