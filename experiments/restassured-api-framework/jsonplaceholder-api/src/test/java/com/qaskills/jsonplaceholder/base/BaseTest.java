package com.qaskills.jsonplaceholder.base;

import com.qaskills.jsonplaceholder.asserts.AssertActions;
import com.qaskills.jsonplaceholder.endpoints.APIConstants;
import com.qaskills.jsonplaceholder.modules.PayloadManager;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.response.Response;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;
import org.testng.annotations.BeforeMethod;

public class BaseTest {

    protected RequestSpecification requestSpecification;
    protected AssertActions assertActions;
    protected PayloadManager payloadManager;
    protected Response response;
    protected ValidatableResponse validatableResponse;

    @BeforeMethod
    public void setUp() {
        payloadManager = new PayloadManager();
        assertActions = new AssertActions();

        requestSpecification = new RequestSpecBuilder()
                .setBaseUri(APIConstants.BASE_URL)
                .addHeader("Accept", "application/json")
                .addHeader("Content-Type", "application/json")
                .build();
    }
}
