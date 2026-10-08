const fs = require('fs');
const vm = require('vm');
const path = require('path');

const code = fs.readFileSync('data.js', 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);

if (!fs.existsSync('src/data')) {
    fs.mkdirSync('src/data', { recursive: true });
}

// Make sure thumbnail paths and QR paths are consistent with Vite public root
const helperFunctions = `
export function extractGoogleDriveId(input) {
  if (!input) return '';
  input = input.trim();
  const matchFolder = input.match(/\\/folders\\/([a-zA-Z0-9_-]+)/);
  if (matchFolder && matchFolder[1]) return matchFolder[1];
  const matchFileD = input.match(/\\/file\\/d\\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];
  const matchIdParam = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];
  if (!input.includes('/') && !input.includes('.')) return input;
  return input;
}

export function isEpisodeStreamReady(ep) {
  if (!ep || !ep.driveId) return false;
  const cleanId = extractGoogleDriveId(ep.driveId);
  if (!cleanId || cleanId === '1AermIto6wOKAT_rHowr4629uE5g0gYsU' || cleanId.includes('sample-drive-id')) return false;
  return true;
}

export function getDriveEmbedUrl(driveId) {
  const cleanId = extractGoogleDriveId(driveId);
  if (!cleanId) return '';
  if (cleanId === '1AermIto6wOKAT_rHowr4629uE5g0gYsU') {
    return 'https://drive.google.com/embeddedfolderview?id=' + cleanId + '#grid';
  }
  return 'https://drive.google.com/file/d/' + cleanId + '/preview';
}
`;

const fileContent = '// Generated from data.js\n\n' +
'export const VIDEO_STREAM_LINKS = ' + JSON.stringify(ctx.window.VIDEO_STREAM_LINKS, null, 2) + ';\n\n' +
'export const DEFAULT_SERIES_INFO = ' + JSON.stringify(ctx.window.DEFAULT_SERIES_INFO, null, 2) + ';\n\n' +
'export const DEFAULT_EPISODES = ' + JSON.stringify(ctx.window.DEFAULT_EPISODES, null, 2) + ';\n\n' +
'export const DRIVE_CONFIG = ' + JSON.stringify(ctx.window.DRIVE_CONFIG, null, 2) + ';\n\n' +
helperFunctions;

fs.writeFileSync('src/data/seriesData.js', fileContent, 'utf8');
console.log('Successfully generated src/data/seriesData.js!');
