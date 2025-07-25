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

  cy.get('ul > li > p')
    .contains(new RegExp(city.split(',')[0], 'i'))  // e.g. "Mumbai"
    .click();
}

  openCalendar() {
    cy.get('.homeCalender button').first().click();
    cy.get('div.DayPicker-Day', { timeout: 20000 }).should('be.visible');
  }

  selectDate(day = null) {
    this.openCalendar();
    if (day) {
      cy.get('div.DayPicker-Day').contains(day).click();
    } else {
      cy.get('div.DayPicker-Day--today').next().click();
    }
  }

  clickSearch() {
   // cy.contains('button', 'Search flights').click();
   cy.get('.sc-c51d1803-0.EJWJt').click({ force: true });
  }
  // New method to get the first result block snapshot
   getFirstResultBlockSnapshot(snapshotName = 'lowest-flight-block') {
  cy.get('[data-testid="airlineBlock"]').first().scrollIntoView().should('be.visible').matchImageSnapshot(snapshotName);
}
  //New method to get lowest price from search results page
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



  }


module.exports = new ClearTripPage();
