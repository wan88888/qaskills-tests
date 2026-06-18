export class InventoryPage {
  get pageTitle() {
    return cy.contains('.title', 'Products');
  }

  get cartLink() {
    return cy.getByTest('shopping-cart-link');
  }

  get cartBadge() {
    return cy.getByTest('shopping-cart-badge');
  }

  get sortDropdown() {
    return cy.get('[data-test="product-sort-container"]');
  }

  get menuButton() {
    return cy.get('#react-burger-menu-btn');
  }

  get logoutLink() {
    return cy.getByTest('logout-sidebar-link');
  }

  get productTitles() {
    return cy.get('[data-test$="-title-link"]');
  }

  visit() {
    cy.visit('/inventory.html', { failOnStatusCode: false });
    return this;
  }

  assertLoaded() {
    cy.url().should('include', 'inventory.html');
    this.pageTitle.should('be.visible');
    return this;
  }

  inventoryItem(productName: string) {
    return cy.contains('.inventory_item', productName);
  }

  addToCartButton(productName: string) {
    return this.inventoryItem(productName).find('button').contains('Add to cart');
  }

  removeButton(productName: string) {
    return this.inventoryItem(productName).find('button').contains('Remove');
  }

  addProduct(productName: string) {
    this.addToCartButton(productName).click();
    return this;
  }

  removeProduct(productName: string) {
    this.removeButton(productName).click();
    return this;
  }

  openCart() {
    this.cartLink.click();
    return this;
  }

  sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    this.sortDropdown.select(option);
    return this;
  }

  logout() {
    this.menuButton.click();
    this.logoutLink.click();
    return this;
  }
}

export const inventoryPage = new InventoryPage();
