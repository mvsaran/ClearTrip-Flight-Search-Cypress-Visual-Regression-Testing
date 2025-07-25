const { defineConfig } = require("cypress");
const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.cleartrip.ae/flights',
    pageLoadTimeout: 180000,
    chromeWebSecurity: false,
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      
      
    },
  },
});
