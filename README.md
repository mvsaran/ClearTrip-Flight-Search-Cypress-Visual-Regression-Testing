# ✈️ ClearTrip Flight Search – Cypress Visual Regression Testing

This project is a Cypress-based **end-to-end testing framework** for automating and visually validating the **ClearTrip flight search page**.

It uses **Cypress with the Page Object Model (POM)** pattern and integrates **visual regression testing** via `cypress-image-snapshot` to ensure the UI remains consistent across changes.

---

## 📸 What is Visual Regression Testing?

Visual Regression Testing is a technique used to detect **unintended UI changes** by comparing screenshots of your application before and after changes.

It helps catch:
- 🧱 Layout breakages  
- 🎨 Style regressions  
- 🧩 Missing or shifted UI elements

---

## 🚀 Features

✅ Search for flights from Dubai to Mumbai  
✅ Select travel dates using calendar  
✅ Extract and validate the **lowest flight price**  
✅ Capture a **visual snapshot** of flight results  
✅ Detect visual differences on UI changes  
✅ Auto-generate **visual diff reports**

---

## 🧾 Test Workflow

1. Visit [ClearTrip](https://www.cleartrip.ae)
2. Enter source and destination cities (Dubai → Mumbai)
3. Pick the next date from today
4. Click `Search flights`
5. Wait for results to load
6. Extract lowest flight price
7. Take a **snapshot** of the first result block
8. Compare with baseline image
9. If mismatch occurs, generate visual diff in `__diff_output__`

---

## 📁 Project Structure
CYPRESSVISUALREGRESSION/
├── cypress/
│ ├── e2e/ # Test specs
│ │ └── cleartripsearch.cy.js
│ ├── pageObjects/ # Page classes (POM)
│ │ └── ClearTripPage.js
│ ├── snapshots/ # Baseline + diff images
│ │ └── diff_output/ # Generated on visual failure
│ ├── support/
│ │ ├── commands.js # Custom commands (image snapshot)
│ │ └── e2e.js # Global setup
├── cypress.config.js # Cypress config
├── package.json # Project dependencies and scripts
├── .gitignore # Ignores snapshots/videos

✅ Prerequisites
Before you begin, make sure:

Node.js and npm are installed

Cypress is not already installed globally (we install it locally)

Git is installed

Your project folder is created (e.g., CYPRESSVISUALREGRESSION/)

🚀 Project Setup Steps
✅ Step 1: Initialize a new Node.js project
npm init -y
This creates a package.json file.

✅ Step 2: Install Cypress and Visual Regression Plugin
npm install --save-dev cypress cypress-image-snapshot
✅ Step 3: Open Cypress for the first time
npx cypress open
This creates the cypress/ folder structure automatically.

✅ Step 4: Project Folder Structure
Organize your folder like this:

CYPRESSVISUALREGRESSION/
├── cypress/
│   ├── e2e/                    # Test specs
│   ├── pageObjects/            # Page Object Model classes
│   ├── support/
│   │   ├── commands.js
│   │   └── e2e.js
│   ├── snapshots/              # Auto-created for visual regression
├── cypress.config.js           # Cypress configuration
├── .gitignore                  # Git exclusions
├── package.json
└── README.md
✅ Step 5: Configure cypress.config.js
Add visual plugin setup:

const { defineConfig } = require('cypress');
const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
    },
    baseUrl: 'https://www.cleartrip.ae/flights/international',
    supportFile: 'cypress/support/e2e.js',
  },
});
✅ Step 6: Configure Support Files
cypress/support/commands.js

import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand({
  failureThreshold: 0.03,
  failureThresholdType: 'percent',
  customSnapshotsDir: 'cypress/snapshots',
  customDiffDir: 'cypress/snapshots/__diff_output__',
});
cypress/support/e2e.js
import './commands';
✅ Step 7: Create Page Object Class
Create cypress/pageObjects/ClearTripPage.js

class ClearTripPage {
  visit() {
    cy.visit('/');
  }

  closePopupIfPresent() {
    cy.get('body').then(($body) => {
      if ($body.find('.alertBox').length > 0) {
        cy.get('.alertBox .close').click({ force: true });
      }
    });
  }

  enterFromCity(city) {
    cy.get('input[placeholder="Any worldwide city or airport"]').first().click().type(city);
    cy.contains('li', city, { timeout: 10000 }).click();
  }

  enterToCity(city) {
    cy.get('input[placeholder="Any worldwide city or airport"]').eq(1).click().clear().type(city);
    cy.get('ul').should('be.visible');
    cy.get('ul > li > p').contains(new RegExp(city.split(',')[0], 'i')).click();
  }

  selectDate() {
    cy.get('.homeCalender button').first().click();
    cy.get('div.DayPicker-Day--today').next().click();
  }

  clickSearch() {
    cy.get('.sc-c51d1803-0.EJWJt').click({ force: true });
  }

  getLowestPrice() {
    return cy.get('[data-testid="airlineBlock"]').first().within(() => {
      return cy.contains('AED')
        .invoke('text')
        .then((text) => {
          const match = text.match(/AED\s?(\d+)/);
          if (match) {
            return parseInt(match[1], 10);
          }
          throw new Error('Lowest price not found');
        });
    });
  }

  getFirstResultBlockSnapshot(snapshotName = 'lowest-flight-block') {
    cy.get('[data-testid="airlineBlock"]').first().scrollIntoView().should('be.visible').matchImageSnapshot(snapshotName);
  }
}

module.exports = new ClearTripPage();
✅ Step 8: Create Test Spec
Create cypress/e2e/cleartripsearch.cy.js:


const clearTripPage = require('../pageObjects/ClearTripPage');

Cypress.on('uncaught:exception', (err, runnable) => {
  if (
    err.message.includes('Minified React error') ||
    err.message.includes('ChunkLoadError') ||
    err.message.includes('ResizeObserver loop limit exceeded')
  ) {
    return false;
  }
  return true;
});

describe('ClearTrip Flight Search Test', () => {
  before(() => {
    cy.viewport(1280, 800);
  });

  it('should search flights and visually compare lowest price block', () => {
    clearTripPage.visit();
    clearTripPage.closePopupIfPresent();
    clearTripPage.enterFromCity('Dubai', 'Dubai, AE - Dubai International Airport');
    cy.wait(2000);
    clearTripPage.enterToCity('Mumbai', 'Mumbai, IN - Chhatrapati Shivaji International Airport');
    clearTripPage.selectDate();
    cy.wait(2000);
    clearTripPage.clickSearch({ force: true });
    cy.url().should('include', '/results');
    clearTripPage.getFirstResultBlockSnapshot(); // 📸 Visual regression here
    clearTripPage.getLowestPrice().then(price => {
      cy.log('Lowest flight price found: AED', price);
    });
  });
});
✅ Step 9: Run the Test
Run in interactive mode:

npx cypress open
Run in headless CI mode:

npx cypress run
📸 Snapshot Behavior
First Run	Later Run (Same UI)	Later Run (Different UI)
Creates baseline	Passes silently	Fails + creates diff image files





