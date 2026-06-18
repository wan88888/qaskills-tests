package com.qaskills.saucedemo.tests;

import com.qaskills.saucedemo.pages.InventoryPage;
import com.qaskills.saucedemo.pages.LoginPage;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class InventoryTest extends BaseTest {

    private static final String BACKPACK = "Sauce Labs Backpack";
    private static final String BIKE_LIGHT = "Sauce Labs Bike Light";

    private InventoryPage inventoryPage;

    @BeforeMethod(dependsOnMethods = "setUp")
    public void login() {
        inventoryPage = loginAsStandardUser();
    }

    @Test(description = "Verify product catalog is displayed")
    public void testProductCatalog() {
        assertThat(inventoryPage.getProductCount()).isEqualTo(6);
    }

    @Test(description = "Verify add to cart updates badge")
    public void testAddProductToCart() {
        inventoryPage.addProductToCart(BACKPACK);

        assertThat(inventoryPage.getCartBadgeText()).isEqualTo("1");
        assertThat(inventoryPage.isAddToCartVisible(BACKPACK)).isFalse();
        assertThat(inventoryPage.isRemoveVisible(BACKPACK)).isTrue();
    }

    @Test(description = "Verify remove product from inventory page")
    public void testRemoveProductFromCart() {
        inventoryPage.addProductToCart(BIKE_LIGHT);
        inventoryPage.removeProductFromCart(BIKE_LIGHT);

        assertThat(inventoryPage.isCartBadgeDisplayed()).isFalse();
    }

    @Test(description = "Verify sort products A to Z")
    public void testSortProductsAscending() {
        inventoryPage.sortBy("az");
        List<String> names = inventoryPage.getProductNames();
        List<String> sorted = new ArrayList<>(names);
        sorted.sort(Comparator.naturalOrder());

        assertThat(names).isEqualTo(sorted);
    }

    @Test(description = "Verify sort products Z to A")
    public void testSortProductsDescending() {
        inventoryPage.sortBy("za");
        List<String> names = inventoryPage.getProductNames();
        List<String> sorted = new ArrayList<>(names);
        sorted.sort(Comparator.reverseOrder());

        assertThat(names).isEqualTo(sorted);
    }

    @Test(description = "Verify logout returns to login page")
    public void testLogout() {
        LoginPage loginPage = inventoryPage.logout();

        assertThat(loginPage.isLoginButtonDisplayed()).isTrue();
        assertThat(loginPage.getCurrentUrl()).doesNotContain("inventory.html");
    }
}
