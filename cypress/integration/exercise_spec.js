/// <reference types="Cypress" />

context('The QA Engineer app', () => {
  let scoreSum = 0

  it('Opens the browser and navigates to the page', () => {
    cy.visit('https://qa-engineer.herokuapp.com/')
  });

  it('Finds the ENTER button', () => {
    cy.get('#enter').invoke('text').should('equal', 'Enter')
  });

  it('Clicks ENTER button and gets redirected to "code" page', () => {
    cy.get('#enter').click()
    cy.url().should('contain', 'code')
  });

  it('Finds "secret" input, grabs its value and types it in input', () => {
    cy.get('[name="secret"]').then($input => {
      cy.wrap($input).should('have.attr', 'type').and('equal', 'hidden')
      const secretValue = $input.val()
      cy.get('[name="code"]').type(secretValue)
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
    cy.url().should('contain', 'lists')
  });

  it('Shows Famous and Awesome quotes', () => {
    cy.contains('Awesome Quotes').should('be.visible')
    cy.contains('Famous Quotes').should('be.visible')
  });

  it('Shows 2 lists with 5 items each', () => {
    cy.get('ul').find('li ul').should('have.length', '2')
    cy.get('ul li ul').each(($elem, index) => {
      cy.get('ul li ul').eq(index).children().should('have.length', '5')
    })
  });

  it('Should show a total of 10 quotes and scores', () => {
    cy.get('ul li span:nth-of-type(1)').should('have.length', '10')
    cy.get('ul li span:nth-of-type(1)').each((element, index) => {
      cy.get('ul li span:nth-of-type(1)').eq(index).should('be.visible')
      cy.get('ul li span:nth-of-type(2)').eq(index).should('be.visible').and('have.class', 'score')
    })
  });

  it('Loops through all the quote scores and grabs the score', () => {
    cy.get('.score').each((element, index) => {
      cy.get('.score').eq(index).then($score => {
        scoreSum += Number($score.text())
      })
    })   
  });

  it('Total score should equal the sum of all individual quote scores', () => {
    cy.get('body').contains(`Total score: ${scoreSum}`)
  });
});