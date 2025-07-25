const clearTripPage = require('../pageObjects/ClearTripPage');

Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore known React chunk and minified build errors
  if (
    err.message.includes('Minified React error') ||
    err.message.includes('ChunkLoadError') ||
    err.message.includes('Loading chunk') ||
    err.message.includes('ResizeObserver loop limit exceeded')
  ) {
    return false;
  }

  // Let other unexpected errors fail the test
  return true;
});


describe('ClearTrip Flight Search Test', () => {
  before(() => {
    cy.viewport(1280, 800);
  });

  it('should search flights from Dubai to Mumbai and get lowest price', () => {
    clearTripPage.visit();
    clearTripPage.closePopupIfPresent();

    clearTripPage.enterFromCity('Dubai', 'Dubai, AE - Dubai International Airport');
    cy.wait(2000); // Wait for autocomplete to settle
    clearTripPage.enterToCity('Mumbai', 'Mumbai, IN - Chhatrapati Shivaji International Airport');

    clearTripPage.selectDate();

    // Optional wait to avoid race conditions
    cy.wait(2000);

    
    clearTripPage.clickSearch({force: true});
    cy.wait(2000); // Wait for search results to load
    
    
    cy.url().should('include', '/results');
  
   

    // Validate lowest price
    clearTripPage.getLowestPrice().then(price => {
      cy.log('Lowest flight price found: AED', price);
      // ✅ Visual regression test
    clearTripPage.getFirstResultBlockSnapshot();
      
    });
  });
});
