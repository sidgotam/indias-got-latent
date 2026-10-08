import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

function getStorageModule() {
  try {
    const configPath = path.resolve('./server/storageConfig.js');
    delete require.cache[configPath];
    return require('./server/storageConfig.js');
  } catch (e) {
    return require('./server/storageConfig.js');
  }
}

function videoApiPlugin() {
  return {
    name: 'video-api-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [rawPath, queryString] = req.url.split('?');
        const reqPath = decodeURI(rawPath);
        const storage = getStorageModule();

        // Match /api/video/:id/embed
        const embedMatch = reqPath.match(/^\/api\/video\/([a-zA-Z0-9_-]+)\/embed$/i);
        if (embedMatch) {
          const episodeId = embedMatch[1];
          const html = storage.getEmbedHtml(episodeId);
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.statusCode = 200;
          return res.end(html);
        }

        // Match /api/video/:id
        const videoMatch = reqPath.match(/^\/api\/video\/([a-zA-Z0-9_-]+)$/i);
        if (videoMatch) {
          const episodeId = videoMatch[1];
          const searchParams = new URLSearchParams(queryString || '');
          if (searchParams.get('format') === 'embed') {
            const html = storage.getEmbedHtml(episodeId);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            res.statusCode = 200;
            return res.end(html);
          }

          return storage.streamVideoChunk(episodeId, req, res);
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), videoApiPlugin()],
  server: {
    port: 3000,
    host: true,
    open: false
  },
  preview: {
    port: 3000,
    host: true
  }
});
