// ---------------------------------------------------------------------------
// Update Teams app files with new appId.
// ---------------------------------------------------------------------------

const path = require('path');
const fs = require('fs');
const process = require('process');
const { execSync } = require('child_process');

const defaultExternalAppId = '933b8170-ad4c-421f-b2ca-a80f2685ef08';
const m365rcPath = path.join(__dirname, '../.m365rc.json');
const usage = `Usage: node ${path.basename(process.argv[1])} [externalAppId]`;

run();

// ---------------------------------------------------------------------------

function run() {
  const args = process.argv.slice(2);

  if (args.length > 1) {
    console.error(usage);
    process.exit(-1);
  }

  const externalAppId = args[0] || process.env.EXTERNAL_APP_ID || defaultExternalAppId;
  const appId = getAppId(externalAppId);

  try {
    if (!appId) {
      throw new Error('Unable to retrieve internal appId.');
    }

    console.log(`Updating Teams app with appId: ${appId}...`);
    execSync(`m365 teams app update -i ${appId} -p angular-teams.zip`);
    console.log('Done!');
  } catch {
    console.error('Error updating teams app!');
    process.exit(-1);
  }
}

function getAppId(externalAppId) {
  try {
    console.log('Retrieving internal appId...');
    const appId = execSync(`m365 teams app list --query "[?externalId == '${externalAppId}'] | [0].id"`).toString();
    return JSON.parse(appId);
  } catch {
    return null;
  }
}
