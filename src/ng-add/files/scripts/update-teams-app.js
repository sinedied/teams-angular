// ---------------------------------------------------------------------------
// Update Teams app files with new appId.
// ---------------------------------------------------------------------------

const path = require('path');
const fs = require('fs');
const process = require('process');
const { execSync } = require('child_process');

const manifestPath = path.join(__dirname, '../package/manifest.json');

run();

// ---------------------------------------------------------------------------

function run() {
  const teamsAppName = getTeamsAppName();

  try {
    if (!teamsAppName) {
      throw new Error(`Unable to retrieve Teams app's name.`);
    }

    console.log(`Updating Teams app ${teamsAppName}...`);
    execSync(`m365 teams app update --name "${teamsAppName}" --filePath angular-teams.zip`);
    console.log('Done!');
  } catch {
    console.error('Error updating Teams app!');
    process.exit(-1);
  }
}

function getTeamsAppName() {
  console.log(`Retrieving Teams app's name...`);
  const manifestContents = fs.readFileSync(manifestPath, 'utf8');
  if (!manifestContents) {
    throw new Error(`Unable to read file: ${manifestPath}`);
  }

  const manifest = JSON.parse(manifestContents);
  return manifest.name?.short;
}