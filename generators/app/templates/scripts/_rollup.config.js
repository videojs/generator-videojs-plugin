const generateRollupConfig = require('videojs-generate-rollup-config');
const config = generateRollupConfig();

export default Object.values(config.builds);
