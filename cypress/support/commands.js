import {addMatchImageSnapshotCommand} from 'cypress-image-snapshot/command';
addMatchImageSnapshotCommand({
    failureThreshold: 0.03, // 3% threshold
    failureThresholdType: 'percent', // Use percentage for threshold
    capture:'fullPage',
    customSnapshotsDir: 'cypress/snapshots',
    customDiffDir: 'cypress/snapshots/__diff_output__' ,
    capture: 'viewport',
  customDiffConfig: { threshold: 0.1 },
  allowSizeMismatch: true// Capture the full page
});