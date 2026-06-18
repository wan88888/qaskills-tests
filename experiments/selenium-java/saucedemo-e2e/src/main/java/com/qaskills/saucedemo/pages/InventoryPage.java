package com.qaskills.saucedemo.pages;

import com.qaskills.saucedemo.utils.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.stream.Collectors;

public class InventoryPage extends BasePage {

    private static final By PAGE_TITLE = By.cssSelector(".title");
    private static final By CART_LINK = By.cssSelector("[data-test='shopping-cart-link']");
    private static final By CART_BADGE = By.cssSelector("[data-test='shopping-cart-badge']");
    private static final By SORT_DROPDOWN = By.cssSelector("[data-test='product-sort-container']");
    private static final By MENU_BUTTON = By.id("react-burger-menu-btn");
    private static final By LOGOUT_LINK = By.id("logout_sidebar_link");
    private static final By INVENTORY_ITEMS = By.cssSelector(".inventory_item");
    private static final By PRODUCT_TITLES = By.cssSelector("[data-test$='-title-link']");

    public InventoryPage(WebDriver driver) {
        super(driver);
    }

    public InventoryPage navigate() {
        driver.get(ConfigReader.getProperty("base.url") + "/inventory.html");
        return this;
    }

    public void waitForPage() {
        waitForUrlContains("inventory.html");
        wait.until(driver -> getText(PAGE_TITLE).equals("Products"));
    }

    public InventoryPage addProductToCart(String productName) {
        click(productAddToCartButton(productName));
        return this;
    }

    public InventoryPage removeProductFromCart(String productName) {
        click(productRemoveButton(productName));
        return this;
    }

    public CartPage openCart() {
        click(CART_LINK);
        return new CartPage(driver);
    }

    public InventoryPage sortBy(String value) {
        selectByValue(SORT_DROPDOWN, value);
        return this;
    }

    public LoginPage logout() {
        click(MENU_BUTTON);
        click(LOGOUT_LINK);
        return new LoginPage(driver);
    }

    public int getProductCount() {
        return driver.findElements(INVENTORY_ITEMS).size();
    }

    public String getCartBadgeText() {
        return getText(CART_BADGE);
    }

    public boolean isCartBadgeDisplayed() {
        return isDisplayed(CART_BADGE);
    }

    public boolean isAddToCartVisible(String productName) {
        return isDisplayed(productAddToCartButton(productName));
    }

    public boolean isRemoveVisible(String productName) {
        return isDisplayed(productRemoveButton(productName));
    }

    public List<String> getProductNames() {
        return driver.findElements(PRODUCT_TITLES).stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
    }

    private By productAddToCartButton(String productName) {
        return By.xpath("//div[contains(@class,'inventory_item') and contains(.,'" + productName
                + "')]//button[contains(@data-test,'add-to-cart')]");
    }

    private By productRemoveButton(String productName) {
        return By.xpath("//div[contains(@class,'inventory_item') and contains(.,'" + productName
                + "')]//button[contains(@data-test,'remove')]");
    }
}
