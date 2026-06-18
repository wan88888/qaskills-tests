package com.qaskills.saucedemo.tests;

import com.qaskills.saucedemo.pages.CartPage;
import com.qaskills.saucedemo.pages.CheckoutPage;
import com.qaskills.saucedemo.pages.InventoryPage;
import org.openqa.selenium.By;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CheckoutTest extends BaseTest {

    private static final String BACKPACK = "Sauce Labs Backpack";

    private CheckoutPage checkoutPage;

    @BeforeMethod(dependsOnMethods = "setUp")
    public void openCheckout() {
        InventoryPage inventoryPage = loginAsStandardUser();
        inventoryPage.addProductToCart(BACKPACK);
        CartPage cartPage = inventoryPage.openCart();
        cartPage.waitForPage();
        checkoutPage = cartPage.proceedToCheckout();
        checkoutPage.waitForStepOne();
    }

    @Test(description = "Verify complete checkout flow")
    public void testCompleteCheckout() {
        checkoutPage
                .fillCustomerInfo("Jane", "Doe", "94105")
                .continueToOverview();
        checkoutPage.waitForOverview();

        assertThat(checkoutPage.isProductVisible(BACKPACK)).isTrue();

        checkoutPage.completeOrder();
        checkoutPage.waitForComplete();
        assertThat(driver.findElement(By.id("back-to-products")).isDisplayed()).isTrue();
    }

    @Test(description = "Verify customer info is required")
    public void testCustomerInfoRequired() {
        checkoutPage.continueToOverview();

        assertThat(checkoutPage.getFirstNameError()).contains("First Name is required");
    }

    @Test(description = "Verify cancel checkout returns to cart")
    public void testCancelCheckout() {
        CartPage cartPage = checkoutPage.cancel();
        cartPage.waitForPage();

        assertThat(cartPage.isItemInCart(BACKPACK)).isTrue();
    }
}
