package com.qaskills.jsonplaceholder.tests.e2e_integration;

import com.qaskills.jsonplaceholder.base.BaseTest;
import com.qaskills.jsonplaceholder.endpoints.APIConstants;
import com.qaskills.jsonplaceholder.pojos.request.Post;
import io.qameta.allure.Description;
import io.qameta.allure.Owner;
import io.restassured.RestAssured;
import org.testng.ITestContext;
import org.testng.annotations.Test;

public class TestPostIntegrationFlow extends BaseTest {

    private static final String UPDATED_TITLE = "Updated title from E2E flow";

    @Test(priority = 1)
    @Owner("qaskills")
    @Description("E2E Step 1 - Create post and store response in ITestContext")
    public void testCreatePost(ITestContext iTestContext) {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL)
                .body(payloadManager.createPostPayloadAsString())
                .when()
                .post();

        validatableResponse = response.then();
        validatableResponse.statusCode(201);

        Post post = payloadManager.postFromJson(response.asString());
        assertActions.verifyStringKeyNotNull(post.getId());
        iTestContext.setAttribute("createdPostId", post.getId());
        iTestContext.setAttribute("createdPostTitle", post.getTitle());
    }

    @Test(priority = 2)
    @Description("E2E Step 2 - Read baseline post via GET /posts/1")
    public void testReadBaselinePost(ITestContext iTestContext) {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL + "/1")
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        Post post = payloadManager.postFromJson(response.asString());
        assertActions.verifyResponseBody(post.getId(), 1, "baseline post id");
        iTestContext.setAttribute("baselinePostTitle", post.getTitle());
    }

    @Test(priority = 3)
    @Description("E2E Step 3 - Patch post and pass updated title through ITestContext")
    public void testUpdatePost(ITestContext iTestContext) {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL + "/1")
                .body(payloadManager.updatePostTitlePayload(UPDATED_TITLE))
                .when()
                .patch();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        Post post = payloadManager.postFromJson(response.asString());
        assertActions.verifyStringKey(post.getTitle(), UPDATED_TITLE);
        iTestContext.setAttribute("updatedTitle", post.getTitle());
    }

    @Test(priority = 4)
    @Description("E2E Step 4 - Verify shared state from previous step via ITestContext")
    public void testVerifySharedState(ITestContext iTestContext) {
        String createdTitle = (String) iTestContext.getAttribute("createdPostTitle");
        String baselineTitle = (String) iTestContext.getAttribute("baselinePostTitle");
        String updatedTitle = (String) iTestContext.getAttribute("updatedTitle");

        assertActions.verifyStringKeyNotNull(createdTitle);
        assertActions.verifyStringKeyNotNull(baselineTitle);
        assertActions.verifyStringKey(updatedTitle, UPDATED_TITLE);
    }

    @Test(priority = 5)
    @Description("E2E Step 5 - Delete post")
    public void testDeletePost() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL + "/1")
                .when()
                .delete();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);
    }
}
