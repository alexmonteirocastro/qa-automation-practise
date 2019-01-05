/// <reference types="Cypress" />

context('The QA Engineer app', () => {
  let scoreSum = 0 // instanciating this variable that wll be the counter for summing the individual quote scores

  it('Opens the browser and navigates to the page', () => {
    cy.visit('https://qa-engineer.herokuapp.com/') // navigates to the page and waits for the page to load
  });

  it('Finds the ENTER button', () => {
    cy.get('#enter').invoke('text').should('equal', 'Enter') // asserting on the innerText of the element
  });

  it('Clicks ENTER button and gets redirected to "code" page', () => {
    cy.get('#enter').click()
    // no need to use explicit waits as cypress autaomatically detects page load events and waits for pages to load
    cy.url().should('contain', 'code') // asserts that we have been redirected to the code page
  });

  it('Finds "secret" input, grabs its value and types it in input', () => {
    cy.get('[name="secret"]').then($input => {
      cy.wrap($input).should('have.attr', 'type').and('equal', 'hidden') // asserts that this field is hidden
      const secretValue = $input.val() // grabs the input value and stores it in a variable
      cy.get('[name="code"]').type(secretValue) // types the previous grabbed value
    })
  });

  it('"Are you a robot" box should be checked', () => {
    cy.get('[name="robot"]').then($input => {
      cy.wrap($input).check()
      cy.wrap($input).should('be.checked')
    })
  });

  it('Clicks Submit button and redirects to "lists" page', () => {
    cy.get('button[type="submit"]').click()
    cy.url().should('contain', 'lists') // asserts that we have been redirected to the lists page
  });

  it('Shows Famous and Awesome quotes', () => {
    // asserting that exists in the DOm elements that contain the specified text and that they are visible
    cy.contains('Awesome Quotes').should('be.visible') 
    cy.contains('Famous Quotes').should('be.visible')
  });

  it('Shows 2 lists with 5 items each', () => {
    cy.get('ul').find('li ul').should('have.length', '2') // in te list there should be two lists nested
    cy.get('ul li ul').each(($elem, index) => {
      cy.get('ul li ul').eq(index).children().should('have.length', '5') // each nested list contains 5 nested items
    })
  });

  it('Should show a total of 10 quotes and scores', () => {
    cy.get('ul li span:nth-of-type(1)').should('have.length', '10') // each list items contains 2 spans, the first onebeing the actual quote
    cy.get('ul li span:nth-of-type(1)').each((element, index) => {
      cy.get('ul li span:nth-of-type(1)').eq(index).should('be.visible') // quotes should be visible
      cy.get('ul li span:nth-of-type(2)').eq(index).should('be.visible').and('have.class', 'score') // the second span is the score and should also be visible
    })
  });

  it('Loops through all the quote scores and grabs the score', () => {
    cy.get('.score').each((element, index) => {
      cy.get('.score').eq(index).then($score => {
        scoreSum += Number($score.text()) // just grabbing the innerText value, parsing it into number and adding it to the sum variable
      })
    })   
  });

  it('Total score should equal the sum of all individual quote scores', () => {
    // checking that there exists in the DOM an element with such text that asserts that the total score below matches the sum of scores
    cy.get('body').contains(`Total score: ${scoreSum}`) 
  });
});