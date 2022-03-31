// ---------------------------------------------------------------------------
// Updates the environment file with the ID of Azure AD app.
// ---------------------------------------------------------------------------

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const environmentPath = path.join(__dirname, '../src/environments/environment.ts');
const m365rcPath = path.join(__dirname, '../.m365rc.json');

run();

// ---------------------------------------------------------------------------

function run() {
  updateEnvironment();
}

function updateEnvironment() {
  const appId = getAppId();
  const tenantId = getTenantId();
  updateEnvironmentFile(appId, tenantId);
  console.log('Done!');
}

function updateEnvironmentFile(appId, tenantId) {
  console.log(`Updating ${path.basename(environmentPath)}...`);
  if (!fs.existsSync(environmentPath)) {
    console.log(`${path.basename(environmentPath)} file not found. Copying from template...`);
    fs.copyFileSync(path.join(__dirname, 'default-environment.ts'), environmentPath);
  }

  let environmentPathContents = fs.readFileSync(environmentPath, 'utf8');
  if (!environmentPathContents) {
    throw new Error(`Unable to read file: ${environmentPath}`);
  }

  environmentPathContents = environmentPathContents.replace(/(aadAppId: )'([^']*)'/g, `$1'${appId}'`);
  environmentPathContents = environmentPathContents.replace(/(tenantId: )'([^']*)'/g, `$1'${tenantId}'`);

  fs.writeFileSync(environmentPath, environmentPathContents);
}

function getAppId() {
  const m365rcContents = fs.readFileSync(m365rcPath, 'utf8');
  if (!m365rcContents) {
    throw new Error(`Unable to read file: ${m365rcPath}`);
  }

  const rc = JSON.parse(m365rcContents);
  return rc.apps[0].appId;
}

function getTenantId() {
  const tenantId = execSync(`m365 tenant id get --output text`).toString().trim();
  if (!tenantId) {
    throw new Error(`Unable to retrieve tenant ID.`);
  }

  return tenantId;
}