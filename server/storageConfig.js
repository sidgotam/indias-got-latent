/**
 * Server-Side Video Storage & Stream Configuration
 * 
 * Google Drive is utilized purely as an internal storage backend.
 * All storage identifiers and provider details remain strictly server-side.
 * The frontend client only requests abstracted application endpoints:
 *   /api/video/:episodeId
 *   /api/video/:episodeId/embed
 */

const https = require('https');
const http = require('http');

// Internal Storage Map: Episode ID -> Storage Backend Source
const EPISODE_STORAGE_MAP = {
  // Season 1 (Available Episodes)
  "s1-e01": { provider: "google-drive", fileId: "1bccMfHnHgSuegozF_5qp78vWwSVcwrIq", filename: "Season1Episode1.mkv" },
  "s1-e02": { provider: "google-drive", fileId: "1EZ7-DvvGynEnxpBCHO93NmaD-Yesw1FU", filename: "Season1episode2.mkv" },
  "s1-e03": { provider: "google-drive", fileId: "1Fe1SkaCv7b2d2C4FWuS9gt18ygdIm3pu", filename: "Season1episode3.mkv" },
  "s1-e04": { provider: "google-drive", fileId: "1gHvFlD5dBFc63NaMQQSudfm6PySmXpDs", filename: "Season1episode4.mkv" },
  "s1-e05": { provider: "google-drive", fileId: "1xq7nmLIcp4Wnn17F8s1diDFdIrK1WA43", filename: "Season1episode5.mkv" },
  "s1-e06": { provider: "google-drive", fileId: "1rwaSaBCdyPE4zIwM5qbrE3YxiNQMU3vS", filename: "Season1episode6.mkv" },
  "s1-e07": { provider: "google-drive", fileId: "19nq5G7BNghO36Kti6a5ZBunJ97LkCmTd", filename: "Season1episode7.mkv" },
  "s1-e08": { provider: "google-drive", fileId: "1u6ad12iHKHmhR4jBSERc7fiLecGzNLP8", filename: "Season1episode8.mkv" },

  // Season 1 (Upcoming Episodes - mapped when uploaded)
  "s1-e09": null,
  "s1-e10": null,
  "s1-e11": null,
  "s1-e12": null,

  // Season 2
  "s2-e01": null,
  "s2-e02": null,
  "s2-e03": null,
  "s2-e04": null,
  "s2-e05": null,
  "s2-e06": null,
  "s2-e07": null,
  "s2-e08": null,
  "s2-e09": null,
  "s2-e10": null,
  "s2-e11": null,
  "s2-e12": null,

  // VIP Specials
  "vip-e01": null,
  "vip-e02": null,
  "vip-e03": null,
  "vip-e04": null,
  "vip-e05": null,
  "vip-e06": null
};

/**
 * Resolves episode storage configuration
 */
function resolveEpisodeStorage(episodeId) {
  if (!episodeId) return null;
  const cleanId = String(episodeId).trim().toLowerCase();
  const entry = EPISODE_STORAGE_MAP[cleanId];
  if (!entry || !entry.fileId) return null;
  return entry;
}

/**
 * Checks if episode has valid storage backend
 */
function isEpisodeAvailable(episodeId) {
  return Boolean(resolveEpisodeStorage(episodeId));
}

/**
 * Generates upstream storage direct download/stream URL
 */
function getUpstreamDownloadUrl(fileId) {
  return `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`;
}

/**
 * Generates upstream preview embed URL
 */
function getUpstreamEmbedUrl(fileId) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
}

/**
 * Streams media from storage backend supporting HTTP Range requests (206 Partial Content).
 * Pipes chunks directly to res without loading the video into server memory.
 */
function streamVideoChunk(episodeId, req, res) {
  const storage = resolveEpisodeStorage(episodeId);
  if (!storage) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Video is temporarily unavailable.' }));
  }

  const upstreamUrl = getUpstreamDownloadUrl(storage.fileId);
  const upstreamHeaders = {};

  // Forward Range header if requested by player
  if (req.headers.range) {
    upstreamHeaders['Range'] = req.headers.range;
  }

  const isMatroska = Boolean(storage.filename && storage.filename.toLowerCase().endsWith('.mkv'));

  // Request upstream stream
  const upstreamReq = https.get(upstreamUrl, { headers: upstreamHeaders }, (upstreamRes) => {
    // If upstream redirects (302/303/307), follow location
    if (upstreamRes.statusCode >= 300 && upstreamRes.statusCode < 400 && upstreamRes.headers.location) {
      https.get(upstreamRes.headers.location, { headers: upstreamHeaders }, (redirectRes) => {
        pipeStreamResponse(redirectRes, req, res, isMatroska);
      }).on('error', (err) => {
        handleStreamError(err, res);
      });
      return;
    }

    pipeStreamResponse(upstreamRes, req, res, isMatroska);
  });

  upstreamReq.on('error', (err) => {
    handleStreamError(err, res);
  });

  // If client closes browser tab or seeks away, abort upstream request to free resources
  req.on('close', () => {
    upstreamReq.destroy();
  });
}

function pipeStreamResponse(upstreamRes, req, res, isMatroska) {
  const statusCode = upstreamRes.statusCode === 206 ? 206 : 200;
  const contentType = isMatroska ? 'video/webm' : 'video/mp4';
  const headers = {
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, max-age=3600',
    'X-Content-Type-Options': 'nosniff'
  };

  if (upstreamRes.headers['content-range']) {
    headers['Content-Range'] = upstreamRes.headers['content-range'];
  }
  if (upstreamRes.headers['content-length']) {
    headers['Content-Length'] = upstreamRes.headers['content-length'];
  }

  res.writeHead(statusCode, headers);

  if (req.method === 'HEAD') {
    return res.end();
  }

  upstreamRes.pipe(res);

  res.on('close', () => {
    upstreamRes.destroy();
  });
}

function handleStreamError(err, res) {
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Video is temporarily unavailable.' }));
  }
}

/**
 * Returns clean HTML for the embedded player frame fallback.
 * Uses sandboxing without allow-popups to prevent external redirects.
 */
function getEmbedHtml(episodeId) {
  const storage = resolveEpisodeStorage(episodeId);
  if (!storage) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Video Unavailable</title>
  <style>
    body { margin: 0; background: #060910; color: #f1f5f9; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; }
    .card { background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
    h3 { margin-top: 0; color: #f59e0b; }
  </style>
</head>
<body>
  <div class="card">
    <h3>Video Temporarily Unavailable</h3>
    <p>This episode is currently being processed for streaming.</p>
  </div>
</body>
</html>`;
  }

  const upstreamUrl = getUpstreamEmbedUrl(storage.fileId);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stream Player</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: #000000;
      overflow: hidden;
    }
    .player-stream-container {
      position: relative;
      width: 100%;
      height: 100%;
      background: #000000;
    }
    .player-stream-frame {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
      background: #000000;
    }
  </style>
</head>
<body>
  <div class="player-stream-container">
    <iframe
      class="player-stream-frame"
      src="${upstreamUrl}"
      sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</body>
</html>`;
}

module.exports = {
  EPISODE_STORAGE_MAP,
  resolveEpisodeStorage,
  isEpisodeAvailable,
  streamVideoChunk,
  getEmbedHtml
};
