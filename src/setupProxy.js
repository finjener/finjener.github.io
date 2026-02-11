const express = require('express');

module.exports = function(app) {
  // Serve MP3 files with correct content type
  app.use('/public', express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.mp3')) {
        res.set('Content-Type', 'audio/mpeg');
      }
    }
  }));
}; 