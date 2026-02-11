// config-overrides.js
const path = require('path');

module.exports = function override(config, env) {
  // Add any webpack config customizations here
  
  // Update loader for markdown files to ensure content is properly loaded as text
  config.module.rules.push({
    test: /\.md$/,
    use: [
      {
        loader: 'raw-loader',
        options: {
          esModule: false, // This ensures raw-loader doesn't use ES modules format
        }
      }
    ],
  });
  
  // Suppress source map warnings for third-party packages
  config.ignoreWarnings = [
    {
      module: /node_modules\/@mediapipe\/tasks-vision/,
      message: /Failed to parse source map/,
    },
    // Suppress all source map warnings from node_modules
    function(warning) {
      return (
        warning.module &&
        warning.module.resource &&
        warning.module.resource.includes('node_modules') &&
        warning.message &&
        warning.message.includes('Failed to parse source map')
      );
    }
  ];
  
  // Configure source map loader to ignore missing maps
  const oneOfRule = config.module.rules.find(rule => rule.oneOf);
  if (oneOfRule) {
    const sourceMapRule = oneOfRule.oneOf.find(rule => 
      rule.use && rule.use.some && rule.use.some(use => 
        use.loader && use.loader.includes('source-map-loader')
      )
    );
    if (sourceMapRule) {
      sourceMapRule.exclude = /node_modules\/@mediapipe/;
    }
  }
  
  // Add any other customizations as needed
  
  return config;
};