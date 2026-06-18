package com.qaskills.jsonplaceholder.tests.crud;

import com.qaskills.jsonplaceholder.base.BaseTest;
import com.qaskills.jsonplaceholder.endpoints.APIConstants;
import io.qameta.allure.Description;
import io.qameta.allure.Owner;
import io.restassured.RestAssured;
import org.testng.annotations.Test;

public class TestResourcesSmoke extends BaseTest {

    @Test(groups = "reg", priority = 1)
    @Owner("qaskills")
    @Description("Smoke - GET /posts returns 100 items")
    public void testPostsCollectionAvailable() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL)
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);
        assertActions.verifyContentType(response, "application/json");
        assertActions.verifyResponseTime(response, 5_000);
        assertActions.verifyResponseBody(response.jsonPath().getList("$").size(), 100, "posts count");
    }

    @Test(groups = "reg", priority = 2)
    @Description("Smoke - GET /comments returns 500 items")
    public void testCommentsCollectionAvailable() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.COMMENTS_URL)
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);
        assertActions.verifyResponseBody(response.jsonPath().getList("$").size(), 500, "comments count");
    }

    @Test(groups = "reg", priority = 3)
    @Description("Smoke - GET /todos returns 200 items")
    public void testTodosCollectionAvailable() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.TODOS_URL)
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);
        assertActions.verifyResponseBody(response.jsonPath().getList("$").size(), 200, "todos count");
    }

    @Test(groups = "reg", priority = 4)
    @Description("Smoke - GET /users returns 10 items")
    public void testUsersCollectionAvailable() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.USERS_URL)
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);
        assertActions.verifyResponseBody(response.jsonPath().getList("$").size(), 10, "users count");
    }

    @Test(groups = "reg", priority = 5)
    @Description("Smoke - GET /albums returns 100 items")
    public void testAlbumsCollectionAvailable() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.ALBUMS_URL)
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);
        assertActions.verifyResponseBody(response.jsonPath().getList("$").size(), 100, "albums count");
    }

    @Test(groups = "reg", priority = 6)
    @Description("Smoke - GET /photos returns 5000 items")
    public void testPhotosCollectionAvailable() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.PHOTOS_URL)
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);
        assertActions.verifyResponseBody(response.jsonPath().getList("$").size(), 5000, "photos count");
    }
}
