import { inventoryPage } from '../../pages/inventory.page';
import { loginPage } from '../../pages/login.page';

describe('Inventory', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.loginAs(users.standard.username, users.standard.password);
    });
    inventoryPage.visit();
  });

  it('should display product catalog', () => {
    inventoryPage.assertLoaded();
    inventoryPage.productTitles.should('have.length', 6);
  });

  it('should add product to cart and update badge', () => {
    cy.fixture('checkout.json').then(({ products }) => {
      inventoryPage.addProduct(products.backpack);
      inventoryPage.cartBadge.should('have.text', '1');
      inventoryPage.addToCartButton(products.backpack).should('not.exist');
      inventoryPage.removeButton(products.backpack).should('be.visible');
    });
  });

  it('should remove product from cart on inventory page', () => {
    cy.fixture('checkout.json').then(({ products }) => {
      inventoryPage.addProduct(products.bikeLight);
      inventoryPage.removeProduct(products.bikeLight);
      inventoryPage.cartBadge.should('not.exist');
    });
  });

  it('should sort products from A to Z', () => {
    inventoryPage.sortBy('az');
    inventoryPage.productTitles.then(($items) => {
      const names = [...$items].map((el) => el.textContent?.trim() ?? '');
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).to.deep.equal(sorted);
    });
  });

  it('should sort products from Z to A', () => {
    inventoryPage.sortBy('za');
    inventoryPage.productTitles.then(($items) => {
      const names = [...$items].map((el) => el.textContent?.trim() ?? '');
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).to.deep.equal(sorted);
    });
  });

  it('should logout and return to login page', () => {
    inventoryPage.logout();
    loginPage.loginButton.should('be.visible');
    loginPage.usernameInput.should('be.visible');
  });
});
