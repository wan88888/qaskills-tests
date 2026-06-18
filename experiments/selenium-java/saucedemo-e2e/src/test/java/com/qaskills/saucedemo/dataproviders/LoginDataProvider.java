package com.qaskills.saucedemo.dataproviders;

import org.testng.annotations.DataProvider;

public final class LoginDataProvider {

    private LoginDataProvider() {
    }

    @DataProvider(name = "invalidLoginCases")
    public static Object[][] invalidLoginCases() {
        return new Object[][]{
                {"locked_out_user", "secret_sauce", "Sorry, this user has been locked out."},
                {"invalid_user", "wrong_password", "Username and password do not match any user in this service"},
        };
    }
}
