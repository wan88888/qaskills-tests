package com.qaskills.saucedemo.tests;

import com.qaskills.saucedemo.pages.CartPage;
import com.qaskills.saucedemo.pages.CheckoutPage;
import com.qaskills.saucedemo.pages.InventoryPage;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CartTest extends BaseTest {

    private static final String BACKPACK = "Sauce Labs Backpack";
    private static final String BOLT_TSHIRT = "Sauce Labs Bolt T-Shirt";

    private CartPage cartPage;

    @BeforeMethod(dependsOnMethods = "setUp")
    public void prepareCart() {
        InventoryPage inventoryPage = loginAsStandardUser();
        inventoryPage.addProductToCart(BACKPACK);
        inventoryPage.addProductToCart(BOLT_TSHIRT);
        cartPage = inventoryPage.openCart();
        cartPage.waitForPage();
    }

    @Test(description = "Verify items appear in cart")
    public void testCartDisplaysItems() {
        assertThat(cartPage.isItemInCart(BACKPACK)).isTrue();
        assertThat(cartPage.isItemInCart(BOLT_TSHIRT)).isTrue();
    }

    @Test(description = "Verify remove item from cart")
    public void testRemoveItemFromCart() {
        cartPage.removeItem(BACKPACK);

        assertThat(cartPage.isItemInCart(BACKPACK)).isFalse();
        InventoryPage inventoryPage = cartPage.continueShopping();
        inventoryPage.waitForPage();
        assertThat(inventoryPage.getCartBadgeText()).isEqualTo("1");
    }

    @Test(description = "Verify navigate to checkout")
    public void testNavigateToCheckout() {
        CheckoutPage checkoutPage = cartPage.proceedToCheckout();
        checkoutPage.waitForStepOne();
        assertThat(checkoutPage.getCurrentUrl()).contains("checkout-step-one.html");
    }
}
