const generateRollupConfig = require('videojs-generate-rollup-config');
const config = generateRollupConfig();

// Add additonal builds/customization here!

export default Object.values(config.builds);
