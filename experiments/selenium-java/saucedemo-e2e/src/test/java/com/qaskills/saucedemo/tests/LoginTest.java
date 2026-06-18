package com.qaskills.saucedemo.tests;

import com.qaskills.saucedemo.dataproviders.LoginDataProvider;
import com.qaskills.saucedemo.pages.InventoryPage;
import com.qaskills.saucedemo.pages.LoginPage;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class LoginTest extends BaseTest {

    private LoginPage loginPage;

    @BeforeMethod(dependsOnMethods = "setUp")
    public void openLoginPage() {
        loginPage = new LoginPage(driver).navigate();
    }

    @Test(description = "Verify successful login with valid credentials")
    public void testSuccessfulLogin() {
        InventoryPage inventoryPage = loginPage.loginAs("standard_user", "secret_sauce");
        inventoryPage.waitForPage();

        assertThat(inventoryPage.getCurrentUrl()).contains("inventory.html");
        assertThat(inventoryPage.getProductCount()).isEqualTo(6);
    }

    @Test(description = "Verify error message for invalid login cases",
            dataProvider = "invalidLoginCases", dataProviderClass = LoginDataProvider.class)
    public void testInvalidLogin(String username, String password, String expectedError) {
        loginPage.enterUsername(username);
        loginPage.enterPassword(password);
        loginPage.clickLoginExpectingError();

        assertThat(loginPage.isErrorDisplayed()).isTrue();
        assertThat(loginPage.getErrorMessage()).contains(expectedError);
    }

    @Test(description = "Verify username is required when submitting empty form")
    public void testEmptyCredentials() {
        loginPage.clickLoginExpectingError();

        assertThat(loginPage.isErrorDisplayed()).isTrue();
        assertThat(loginPage.getErrorMessage()).contains("Username is required");
    }
}
