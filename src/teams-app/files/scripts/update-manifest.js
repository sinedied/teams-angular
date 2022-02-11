// ---------------------------------------------------------------------------
// Updates manifest files with new appId and public domain.
// ---------------------------------------------------------------------------

const path = require('path');
const fs = require('fs');
const process = require('process');
const pkg = require('../package.json');

const aadManifestPath = path.join(__dirname, '../aad-app-manifest.json');
const manifestPath = path.join(__dirname, '../package/manifest.json');
const m365rcPath = path.join(__dirname, '../.m365rc.json');
const usage = `Usage: node ${path.basename(process.argv[1])} <public_domain>`;

run();

// ---------------------------------------------------------------------------

function run() {
  const args = process.argv.slice(2);

  if (args.length === 0 || (!args[0] && !process.env.PUBLIC_DOMAIN)) {
    console.error(usage);
    process.exit(-1);
  }

  const publicDomain = args[0] || process.env.PUBLIC_DOMAIN;
  updateManifests(publicDomain);
}

function updateManifests(publicDomain) {
  const appId = getAppId(); 
  updateManifest(appId, publicDomain);
  updateAadManifest(appId, publicDomain);
  console.log('Done!');
}

function updateAadManifest(appId, publicDomain) {
  console.log(`Updating ${path.basename(aadManifestPath)}...`);
  const aadManifestContents = fs.readFileSync(aadManifestPath, 'utf8');
  if (!aadManifestContents) {
    throw new Error(`Unable to read file: ${aadManifestPath}`);
  }

  const aadManifest = JSON.parse(aadManifestContents);
  aadManifest.appId = appId;
  aadManifest.identifierUris = [`api://${publicDomain}/${appId}`];
  aadManifest.replyUrlsWithType[1].url = `https://${publicDomain}/auth`;

  fs.writeFileSync(aadManifestPath, JSON.stringify(aadManifest, null, 2));
}

function updateManifest(appId, publicDomain) {
  console.log(`Updating ${path.basename(manifestPath)}...`);
  const manifestContents = fs.readFileSync(manifestPath, 'utf8');
  if (!manifestContents) {
    throw new Error(`Unable to read file: ${manifestPath}`);
  }

  const manifest = JSON.parse(manifestContents);

  manifest.version = pkg.version;
  manifest.webApplicationInfo.id = appId;
  manifest.webApplicationInfo.resource = `api://${publicDomain}/${appId}`;
  manifest.staticTabs[0].contentUrl = `https://${publicDomain}`;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function getAppId() {
  const m365rcContents = fs.readFileSync(m365rcPath, 'utf8');
  if (!m365rcContents) {
    throw new Error(`Unable to read file: ${m365rcPath}`);
  }

  const rc = JSON.parse(m365rcContents);
  return rc.apps[0].appId;
}
