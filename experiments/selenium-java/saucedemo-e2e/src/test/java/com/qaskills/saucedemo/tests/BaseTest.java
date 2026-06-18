package com.qaskills.saucedemo.tests;

import com.qaskills.saucedemo.pages.InventoryPage;
import com.qaskills.saucedemo.pages.LoginPage;
import com.qaskills.saucedemo.utils.DriverFactory;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public abstract class BaseTest {

    protected WebDriver driver;

    @Parameters({"browser"})
    @BeforeMethod(alwaysRun = true)
    public void setUp(@Optional("chrome") String browser) {
        DriverFactory.initDriver(browser);
        driver = DriverFactory.getDriver();
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE && driver != null) {
            captureScreenshot(result.getName());
        }
        DriverFactory.quitDriver();
    }

    protected InventoryPage loginAsStandardUser() {
        InventoryPage inventoryPage = new LoginPage(driver)
                .navigate()
                .loginAs("standard_user", "secret_sauce");
        inventoryPage.waitForPage();
        return inventoryPage;
    }

    private void captureScreenshot(String testName) {
        try {
            Path dir = Path.of("target", "screenshots");
            Files.createDirectories(dir);
            Path file = dir.resolve(testName + ".png");
            Files.write(file, new LoginPage(driver).takeScreenshot());
        } catch (IOException ignored) {
            // Best-effort screenshot on failure
        }
    }
}
