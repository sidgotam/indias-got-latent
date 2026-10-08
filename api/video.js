const { streamVideoChunk, getEmbedHtml, isEpisodeAvailable } = require('../server/storageConfig.js');

module.exports = function handler(req, res) {
  const urlParts = req.url.split('?')[0].split('/');
  // Match episode ID from query or URL
  const episodeId = req.query.id || urlParts[urlParts.length - 1] || 's1-e01';
  const isEmbed = req.query.format === 'embed' || req.url.includes('/embed');

  if (isEmbed) {
    const html = getEmbedHtml(episodeId);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // Direct video stream
  return streamVideoChunk(episodeId, req, res);
};
