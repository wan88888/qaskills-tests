package com.qaskills.saucedemo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CartPage extends BasePage {

    private static final By PAGE_TITLE = By.cssSelector(".title");
    private static final By CHECKOUT_BUTTON = By.id("checkout");
    private static final By CONTINUE_SHOPPING_BUTTON = By.id("continue-shopping");

    public CartPage(WebDriver driver) {
        super(driver);
    }

    public void waitForPage() {
        waitForUrlContains("cart.html");
        wait.until(driver -> getText(PAGE_TITLE).equals("Your Cart"));
    }

    public boolean isItemInCart(String productName) {
        return isDisplayed(cartItem(productName));
    }

    public CartPage removeItem(String productName) {
        click(By.xpath("//div[contains(@class,'cart_item') and contains(.,'" + productName
                + "')]//button[contains(@data-test,'remove')]"));
        return this;
    }

    public InventoryPage continueShopping() {
        click(CONTINUE_SHOPPING_BUTTON);
        return new InventoryPage(driver);
    }

    public CheckoutPage proceedToCheckout() {
        click(CHECKOUT_BUTTON);
        return new CheckoutPage(driver);
    }

    private By cartItem(String productName) {
        return By.xpath("//div[contains(@class,'cart_item') and contains(.,'" + productName + "')]");
    }
}
