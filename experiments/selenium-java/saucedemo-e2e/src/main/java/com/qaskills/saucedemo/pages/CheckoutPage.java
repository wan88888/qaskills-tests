package com.qaskills.saucedemo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CheckoutPage extends BasePage {

    private static final By FIRST_NAME_INPUT = By.id("first-name");
    private static final By LAST_NAME_INPUT = By.id("last-name");
    private static final By POSTAL_CODE_INPUT = By.id("postal-code");
    private static final By CONTINUE_BUTTON = By.id("continue");
    private static final By FINISH_BUTTON = By.id("finish");
    private static final By CANCEL_BUTTON = By.id("cancel");
    private static final By SUBTOTAL_LABEL = By.cssSelector(".summary_subtotal_label");
    private static final By TAX_LABEL = By.cssSelector(".summary_tax_label");
    private static final By TOTAL_LABEL = By.cssSelector(".summary_total_label");
    private static final By COMPLETE_HEADER = By.cssSelector(".complete-header");

    public CheckoutPage(WebDriver driver) {
        super(driver);
    }

    public void waitForStepOne() {
        waitForUrlContains("checkout-step-one.html");
        wait.until(driver -> isDisplayed(FIRST_NAME_INPUT));
    }

    public CheckoutPage fillCustomerInfo(String firstName, String lastName, String postalCode) {
        type(FIRST_NAME_INPUT, firstName);
        type(LAST_NAME_INPUT, lastName);
        type(POSTAL_CODE_INPUT, postalCode);
        return this;
    }

    public CheckoutPage continueToOverview() {
        click(CONTINUE_BUTTON);
        return this;
    }

    public void waitForOverview() {
        waitForUrlContains("checkout-step-two.html");
        wait.until(driver -> isDisplayed(SUBTOTAL_LABEL) && isDisplayed(TAX_LABEL) && isDisplayed(TOTAL_LABEL));
    }

    public CheckoutPage completeOrder() {
        click(FINISH_BUTTON);
        return this;
    }

    public void waitForComplete() {
        waitForUrlContains("checkout-complete.html");
        wait.until(driver -> getText(COMPLETE_HEADER).contains("Thank you for your order!"));
    }

    public CartPage cancel() {
        click(CANCEL_BUTTON);
        return new CartPage(driver);
    }

    public boolean isProductVisible(String productName) {
        return isDisplayed(By.xpath("//*[contains(text(),'" + productName + "')]"));
    }

    public String getFirstNameError() {
        return getText(By.cssSelector("[data-test='error']"));
    }
}
