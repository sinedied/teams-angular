import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { executeCommand } from '@pnp/cli-microsoft365';
import * as path from 'path';

const zip = require('bestzip');

interface Options extends JsonObject {
  appId: string;
  packageFileName: string;
}

export default createBuilder(deployToTeamsBuilder);

async function deployToTeamsBuilder(
  options: Options,
  context: BuilderContext,
): Promise<BuilderOutput> {
  try {
    context.reportStatus(`Creating Teams app package...`);
    // build zip
    // we need to set cwd to the package directory to just include the files
    // inside the folder without the folder itself
    await zip({ source: '*', destination: path.join('..', options.packageFileName), cwd: 'package' });
    context.reportStatus(`Deploying to Teams...`);
    // publish to Microsoft Teams
    await executeCommand('teams app publish', { filePath: options.packageFileName });
    // install for the current user in Teams

    // get the current user name
    const statusRes = await executeCommand('status', { output: 'json' });
    const status = JSON.parse(statusRes.stdout);
    // find the ID of the Teams app deployed to Teams
    const teamsAppsRes = await executeCommand('teams app list', { output: 'json' });
    const teamsApps = JSON.parse(teamsAppsRes.stdout);
    const appId = teamsApps.find((a: any) => a.externalId === options.appId)?.id;
    if (!appId) {
      throw new Error(`Could not find Teams app with ID ${options.appId}`);
    }

    // install the app for the current user
    await executeCommand('teams app install', { appId: appId, userName: status.connectedAs });
    context.reportStatus('Done');
  }
  catch (err) {
    context.logger.error(`Failed to deploy the package to Microsoft Teams`);
    return {
      success: false,
      error: err.message ?? err.error.message,
    };
  }

  context.reportStatus('Done.');
  return { success: true };
}