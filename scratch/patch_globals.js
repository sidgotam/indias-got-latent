const fs = require('fs');

let dataCode = fs.readFileSync('data.js', 'utf8');

dataCode = dataCode.replace('const VIDEO_STREAM_LINKS =', 'var VIDEO_STREAM_LINKS =');
dataCode = dataCode.replace('const EXTRA_EPISODES =', 'var EXTRA_EPISODES =');
dataCode = dataCode.replace('const DEFAULT_SERIES_INFO =', 'var DEFAULT_SERIES_INFO =');
dataCode = dataCode.replace('const DEFAULT_EPISODES =', 'var DEFAULT_EPISODES =');
dataCode = dataCode.replace('const DRIVE_CONFIG =', 'var DRIVE_CONFIG =');
dataCode = dataCode.replace('const SAMPLE_DRIVE_IDS =', 'var SAMPLE_DRIVE_IDS =');

if (!dataCode.includes('window.VIDEO_STREAM_LINKS')) {
    dataCode += `\nif (typeof window !== 'undefined') {
    window.VIDEO_STREAM_LINKS = VIDEO_STREAM_LINKS;
    window.EXTRA_EPISODES = EXTRA_EPISODES;
    window.DEFAULT_SERIES_INFO = DEFAULT_SERIES_INFO;
    window.DEFAULT_EPISODES = DEFAULT_EPISODES;
    window.DRIVE_CONFIG = DRIVE_CONFIG;
}\n`;
}

fs.writeFileSync('data.js', dataCode, 'utf8');
console.log('data.js patched with global exports!');
