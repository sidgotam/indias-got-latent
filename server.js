const http = require('http');
const fs = require('fs');
const path = require('path');
const { streamVideoChunk, getEmbedHtml, resolveEpisodeStorage } = require('./server/storageConfig.js');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.mkv': 'video/x-matroska'
};

const server = http.createServer((req, res) => {
    // Strip query parameters
    const [rawPath, queryString] = req.url.split('?');
    let reqPath = decodeURI(rawPath);

    // ==========================================
    // 1. Storage API Routes
    // ==========================================

    // Match /api/video/:id/embed
    const embedMatch = reqPath.match(/^\/api\/video\/([a-zA-Z0-9_-]+)\/embed$/i);
    if (embedMatch) {
        const episodeId = embedMatch[1];
        const html = getEmbedHtml(episodeId);
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
        });
        return res.end(html);
    }

    // Match /api/video/:id
    const videoMatch = reqPath.match(/^\/api\/video\/([a-zA-Z0-9_-]+)$/i);
    if (videoMatch) {
        const episodeId = videoMatch[1];
        const searchParams = new URLSearchParams(queryString || '');
        if (searchParams.get('format') === 'embed') {
            const html = getEmbedHtml(episodeId);
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache'
            });
            return res.end(html);
        }

        // Direct partial range stream
        return streamVideoChunk(episodeId, req, res);
    }

    // Match /api/episodes
    if (reqPath === '/api/episodes') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok' }));
    }

    // ==========================================
    // 2. Static File Serving
    // ==========================================
    if (reqPath === '/' || reqPath === '') {
        reqPath = '/index.html';
    }

    const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
    const distPath = path.join(ROOT, 'dist', safePath);
    const rootPath = path.join(ROOT, safePath);
    const filePath = (fs.existsSync(distPath) && fs.statSync(distPath).isFile()) ? distPath : rootPath;

    // Prevent directory traversal
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // SPA Fallback: if not found, serve dist/index.html or index.html
            const fallbackPath = fs.existsSync(path.join(ROOT, 'dist', 'index.html'))
                ? path.join(ROOT, 'dist', 'index.html')
                : path.join(ROOT, 'index.html');

            if (fs.existsSync(fallbackPath)) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return fs.createReadStream(fallbackPath).pipe(res);
            }

            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        stream.on('error', () => {
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
            }
            res.end('500 Internal Server Error');
        });
    });
});

server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🎙️  INDIA'S GOT LATENT STREAM PORTAL`);
    console.log(`🚀  Local Server:  http://localhost:${PORT}`);
    console.log(`🔒  Storage Layer: Unified Server Video Endpoints Active`);
    console.log(`==================================================\n`);
});
