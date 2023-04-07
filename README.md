# 👥 teams-angular

[![NPM version](https://img.shields.io/npm/v/teams-angular.svg)](https://www.npmjs.com/package/teams-angular)
[![Build Status](https://github.com/sinedied/teams-angular/workflows/build/badge.svg)](https://github.com/sinedied/teams-angular/actions)
![Node version](https://img.shields.io/node/v/teams-angular.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Angular schematics to create Microsoft Teams applications.

## Usage

### `ng new`

This package provides a schematic that creates a new Angular app configured to be deployed as a Microsoft Teams app. The generated app includes:

- authentication configuration using Microsoft Identity Platform,
- Single-Sign On (SSO) configuration with Microsoft Teams,
- additional npm scripts to create Azure AD application and manage the Teams app package

To use this schematic, make sure you have `@angular/cli` installed and run:

```sh
npm install -g teams-angular
ng new teams-app --collection teams-angular
```

> Note: if you get an error like `An unhandled exception occurred: Collection "teams-angular" cannot be resolved.`, it may be related to your NPM installation. Here are a few commands that you can try to fix the issue:
> ```sh
> npm uninstall -g @angular/cli teams-angular
> npm cache clean --force
> npm install -g npm@latest
> npm install -g @angular/cli teams-angular
> ```

## Deploying to production

When you are ready to deploy your app to production, there are two main steps needed to make your app available to the public: first you need to deploy your web app on a server, and then you need to publish the app to your production tenant.

#### Step 1: Deploying your web app

1. Build app for production in `dist/` folder using `npm run build`.
2. Deploy the built app to your favorite cloud provider. See [instructions below](#Deploying-Angular-app-to-to-Azure-Static-Web-Apps) for deploying to [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/?WT.mc_id=javascript-0000-cxa) for example.

#### Step 2: Deploying your Teams app

1. Set your production URL with `node scripts/update-manifest.js <production_url>`
1. Login to CLI for Microsoft 365 onto the production tenant: `npm run m365:login`
1. Create the Azure Active Directory (AAD) app: `npm run m365:create-aad-app`
1. Publish app to Teams: `npm run m365:publish`

## Deploying web app to to Azure Static Web Apps

> What's Azure Static Web Apps? It's an all-inclusive hosting service for web apps providing features like continuous deployment, serverless APIs, authentication and more. And it has a free tier!

Prerequisites:
- A [GitHub account](https://github.com/join)
- An [Azure account](https://azure.microsoft.com/free/?WT.mc_id=javascript-0000-cxa) (you can reuse your GitHub account to login)

1. Click on this button to open the Azure portal:<br> [![Deploy to Azure button](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/?feature.customportal=false&WT.mc_id=javascript-0000-cxa#create/Microsoft.StaticApp)
2. Fill in the details (you don't need to change what's not mentioned):
  - **Resource Group:** Select **Create new** and type in `angular-teams-app`
  - **Name:** Type in `angular-teams-app`
  - Select **Sign in with GitHub**, and pick the **Organization**, **Repository** and **Branch** for the repo with the app you want to deploy.
3. Select **Review + Create**, then **Create**.

Wait a few seconds for everything to be set up, and click on **Go to resource**. From there, you'll be able to see the new public URL that was created for your app in the **URL** field.

This is what you'll use for your production URL. After a few minutes, your Teams app will be available at this URL.

You can find more tutorials on using Static Web Apps [here](https://docs.microsoft.com/learn/paths/azure-static-web-apps/?WT.mc_id=javascript-0000-cxa).

## Contributing

To test locally, run `npm test:schematics`. This will act the same as the `generate` command of the Angular CLI, but using a debug mode.

`npm run test` will run the unit tests, using Jest as a runner and test framework.
