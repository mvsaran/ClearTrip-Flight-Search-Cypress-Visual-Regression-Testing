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





