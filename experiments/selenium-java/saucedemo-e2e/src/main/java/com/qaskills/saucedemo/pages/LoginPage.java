package com.qaskills.saucedemo.pages;

import com.qaskills.saucedemo.utils.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    private static final By USERNAME_INPUT = By.id("user-name");
    private static final By PASSWORD_INPUT = By.id("password");
    private static final By LOGIN_BUTTON = By.id("login-button");
    private static final By ERROR_MESSAGE = By.cssSelector("[data-test='error']");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public LoginPage navigate() {
        driver.get(ConfigReader.getProperty("base.url") + "/");
        return this;
    }

    public LoginPage enterUsername(String username) {
        type(USERNAME_INPUT, username);
        return this;
    }

    public LoginPage enterPassword(String password) {
        type(PASSWORD_INPUT, password);
        return this;
    }

    public InventoryPage clickLogin() {
        click(LOGIN_BUTTON);
        return new InventoryPage(driver);
    }

    public LoginPage clickLoginExpectingError() {
        click(LOGIN_BUTTON);
        return this;
    }

    public InventoryPage loginAs(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        return clickLogin();
    }

    public String getErrorMessage() {
        return getText(ERROR_MESSAGE);
    }

    public boolean isErrorDisplayed() {
        return isDisplayed(ERROR_MESSAGE);
    }

    public boolean isLoginButtonDisplayed() {
        return isDisplayed(LOGIN_BUTTON);
    }
}
