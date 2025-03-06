describe('Gestion du panier et des coupons', () => {
  const masquerNavbar = () => {
    cy.document().then((doc) => {
      const style = doc.createElement('style');
      style.id = 'masquer-navbar';
      style.innerHTML = `
        header.fixed.top-0.left-0.w-full.bg-gray-900.bg-opacity-90.backdrop-blur-md.shadow-lg.z-40.transition-all.duration-300.border-b.border-emerald-800 { 
          display: none !important; 
        }
      `;
      doc.head.appendChild(style);
    });
  };

  const afficherNavbar = () => {
    cy.document().then((doc) => {
      const style = doc.getElementById('masquer-navbar');
      if (style) {
        style.remove(); // Supprime le style pour réafficher la navbar
      }
    });
  };

  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.wait(10000);
    masquerNavbar(); // Masquer la navbar au début
    cy.get('.Toastify__toast-container').should('not.exist');
    cy.screenshot('page-accueil');
    cy.visit('http://localhost:5173/login');
    cy.wait(10000);
    cy.screenshot('page-connexion');

    cy.url().should('include', '/login');
    cy.get('.Toastify__toast-container').should('not.exist');
    cy.get('[data-testid="email"]').should('be.visible').type('bahaeeddineabbassi@gmail.com');
    cy.get('[data-testid="password"]').should('be.visible').type('acab1312');
    cy.screenshot('login-formulaire');
    cy.get('button[type="submit"]').contains('Connexion').click();
    cy.wait(5000);
    cy.screenshot('login-success');

    cy.url().should('eq', 'http://localhost:5173/');
    cy.wait(5000);
    cy.screenshot('page-accueil');
  });

  it('Ajoute un produit au panier et applique un coupon', () => {
    cy.intercept('GET', '/api/products/featured').as('getFeaturedProducts');
    cy.visit('http://localhost:5173/');
    cy.wait('@getFeaturedProducts');
    cy.wait(5000);
    cy.screenshot('produits-en-vedette');

    cy.contains('Learn English the hard way', { timeout: 10000 }).click();
    cy.contains('Ajouter au panier').click();
    cy.wait(5000);
    cy.screenshot('ajouter-au-panier');

    // ➡️ Afficher la navbar juste avant le clic sur le panier
    afficherNavbar();

    cy.get('[data-testid="cart-counter"]').click();
    cy.wait(5000);
    cy.screenshot('panier');

    cy.contains('Learn English the hard way').should('be.visible');
    cy.contains('Procéder au checkout').click();
    cy.screenshot('proceed-checkout');
    cy.wait(5000);
    masquerNavbar(); // Masquer la navbar
    cy.screenshot('proceed-checkout');

    // Vérifie si la redirection vers Stripe a eu lieu
    cy.url().should('include', 'checkout.stripe.com');
    cy.screenshot('stripe-checkout');
  });
});
